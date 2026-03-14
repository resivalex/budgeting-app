"""Service for creating and restoring full application backups as ZIP archives."""

import io
import json
import os
import sqlite3
import tempfile
import zipfile
from datetime import datetime, timezone
from typing import Dict, Any
import pycouchdb

SQLITE_ARCHIVE_PATH = "sqlite/budgeting-app.sqlite3"
COUCHDB_ARCHIVE_PATH = "couchdb/budgeting.json"
SETTINGS_ARCHIVE_PATH = "couchdb/budgeting-settings.json"
COUCHDB_DATABASE_NAME = "budgeting"
SETTINGS_DB_NAME = "budgeting-settings"
SETTINGS_KEYS = [
    "spending_limits",
    "category_expansions",
    "account_properties",
    "transactions_uploaded_at",
]


class BackupService:
    """Creates and restores full backups of both SQLite and CouchDB databases."""

    def __init__(self, sqlite_path: str, db_url: str):
        self._sqlite_path = sqlite_path
        self._db_url = db_url

    def create_backup_zip(self) -> bytes:
        sqlite_bytes = self._dump_sqlite()
        couchdb_bytes = self._dump_couchdb()
        settings_bytes = self._dump_settings_as_couchdb()

        buf = io.BytesIO()
        with zipfile.ZipFile(buf, "w", zipfile.ZIP_DEFLATED) as zf:
            zf.writestr(SQLITE_ARCHIVE_PATH, sqlite_bytes)
            zf.writestr(COUCHDB_ARCHIVE_PATH, couchdb_bytes)
            zf.writestr(SETTINGS_ARCHIVE_PATH, settings_bytes)
        return buf.getvalue()

    def restore_from_zip(self, zip_bytes: bytes) -> Dict[str, Any]:
        buf = io.BytesIO(zip_bytes)
        with zipfile.ZipFile(buf, "r") as zf:
            archive_names = zf.namelist()
            if SQLITE_ARCHIVE_PATH not in archive_names:
                raise ValueError(f"Missing {SQLITE_ARCHIVE_PATH} in archive")
            if COUCHDB_ARCHIVE_PATH not in archive_names:
                raise ValueError(f"Missing {COUCHDB_ARCHIVE_PATH} in archive")

            sqlite_bytes = zf.read(SQLITE_ARCHIVE_PATH)
            couchdb_bytes = zf.read(COUCHDB_ARCHIVE_PATH)
            settings_bytes = (
                zf.read(SETTINGS_ARCHIVE_PATH)
                if SETTINGS_ARCHIVE_PATH in archive_names
                else None
            )

        self._restore_sqlite(sqlite_bytes)
        couchdb_result = self._restore_couchdb(couchdb_bytes)

        if settings_bytes is not None:
            settings_result = self._restore_settings_couchdb(settings_bytes)
        else:
            settings_result = self._restore_settings_from_sqlite(sqlite_bytes)

        return {
            "status": "success",
            "restored_couchdb_docs": couchdb_result["restored_count"],
            "restored_settings_docs": settings_result["restored_count"],
        }

    def _dump_sqlite(self) -> bytes:
        source = sqlite3.connect(self._sqlite_path)
        tmp_fd, tmp_path = tempfile.mkstemp(suffix=".sqlite3")
        os.close(tmp_fd)
        try:
            dest = sqlite3.connect(tmp_path)
            try:
                source.backup(dest)
            finally:
                dest.close()
            source.close()

            with open(tmp_path, "rb") as f:
                return f.read()
        finally:
            if os.path.exists(tmp_path):
                os.unlink(tmp_path)

    def _dump_couchdb(self) -> bytes:
        server = pycouchdb.Server(self._db_url)
        if COUCHDB_DATABASE_NAME not in server:
            server.create(COUCHDB_DATABASE_NAME)
        db = server.database(COUCHDB_DATABASE_NAME)

        all_docs = db.all()
        docs = []
        for row in all_docs:
            doc = dict(row["doc"])
            doc.pop("_rev", None)
            docs.append(doc)

        dump_data = {
            "database": COUCHDB_DATABASE_NAME,
            "exported_at": datetime.now(timezone.utc).isoformat(),
            "doc_count": len(docs),
            "docs": docs,
        }
        return json.dumps(dump_data, ensure_ascii=False, indent=2).encode("utf-8")

    def _restore_sqlite(self, db_bytes: bytes):
        tmp_path = self._sqlite_path + ".tmp"
        with open(tmp_path, "wb") as f:
            f.write(db_bytes)
        os.replace(tmp_path, self._sqlite_path)

    def _restore_couchdb(self, dump_bytes: bytes) -> Dict[str, int]:
        dump_data = json.loads(dump_bytes.decode("utf-8"))
        docs = dump_data["docs"]

        server = pycouchdb.Server(self._db_url)
        if COUCHDB_DATABASE_NAME in server:
            server.delete(COUCHDB_DATABASE_NAME)
        db = server.create(COUCHDB_DATABASE_NAME)

        if docs:
            for doc in docs:
                doc.pop("_rev", None)
            db.save_bulk(docs, transaction=True)
            db.compact()

        return {"restored_count": len(docs)}

    def _dump_settings_as_couchdb(self) -> bytes:
        conn = sqlite3.connect(self._sqlite_path)
        try:
            placeholders = ",".join("?" * len(SETTINGS_KEYS))
            cursor = conn.execute(
                f"SELECT name, value FROM settings WHERE name IN ({placeholders})",
                SETTINGS_KEYS,
            )
            rows = {row[0]: row[1] for row in cursor.fetchall()}
        finally:
            conn.close()

        # JSON keys: parse the string value to object for proper serialization
        json_keys = {"spending_limits", "category_expansions", "account_properties"}
        
        docs = []
        for key in SETTINGS_KEYS:
            if key in rows:
                value = rows[key]
                # Parse JSON strings for specific keys
                if key in json_keys:
                    value = json.loads(value)
                docs.append({"_id": key, "value": value})
        
        dump_data = {
            "database": SETTINGS_DB_NAME,
            "exported_at": datetime.now(timezone.utc).isoformat(),
            "doc_count": len(docs),
            "docs": docs,
        }
        return json.dumps(dump_data, ensure_ascii=False, indent=2).encode("utf-8")

    def _restore_settings_couchdb(self, dump_bytes: bytes) -> Dict[str, int]:
        dump_data = json.loads(dump_bytes.decode("utf-8"))
        docs = dump_data["docs"]

        server = pycouchdb.Server(self._db_url)
        if SETTINGS_DB_NAME in server:
            server.delete(SETTINGS_DB_NAME)
        db = server.create(SETTINGS_DB_NAME)

        if docs:
            for doc in docs:
                doc.pop("_rev", None)
            db.save_bulk(docs, transaction=True)
            db.compact()

        return {"restored_count": len(docs)}

    def _restore_settings_from_sqlite(self, sqlite_bytes: bytes) -> Dict[str, int]:
        """Backward compat: populate budgeting-settings CouchDB DB from SQLite bytes."""
        tmp_fd, tmp_path = tempfile.mkstemp(suffix=".sqlite3")
        os.close(tmp_fd)
        try:
            with open(tmp_path, "wb") as f:
                f.write(sqlite_bytes)
            conn = sqlite3.connect(tmp_path)
            try:
                placeholders = ",".join("?" * len(SETTINGS_KEYS))
                cursor = conn.execute(
                    f"SELECT name, value FROM settings WHERE name IN ({placeholders})",
                    SETTINGS_KEYS,
                )
                rows = {row[0]: row[1] for row in cursor.fetchall()}
            finally:
                conn.close()
        finally:
            if os.path.exists(tmp_path):
                os.unlink(tmp_path)

        # JSON keys: parse the string value to object for proper serialization
        json_keys = {"spending_limits", "category_expansions", "account_properties"}
        
        docs = []
        for key in SETTINGS_KEYS:
            if key in rows:
                value = rows[key]
                # Parse JSON strings for specific keys
                if key in json_keys:
                    value = json.loads(value)
                docs.append({"_id": key, "value": value})
        
        dump_data = {
            "database": SETTINGS_DB_NAME,
            "exported_at": datetime.now(timezone.utc).isoformat(),
            "doc_count": len(docs),
            "docs": docs,
        }
        return self._restore_settings_couchdb(
            json.dumps(dump_data, ensure_ascii=False, indent=2).encode("utf-8")
        )

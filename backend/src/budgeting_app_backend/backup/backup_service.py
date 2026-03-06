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
COUCHDB_DATABASE_NAME = "budgeting"


class BackupService:
    """Creates and restores full backups of both SQLite and CouchDB databases."""

    def __init__(self, sqlite_path: str, db_url: str):
        self._sqlite_path = sqlite_path
        self._db_url = db_url

    def create_backup_zip(self) -> bytes:
        sqlite_bytes = self._dump_sqlite()
        couchdb_bytes = self._dump_couchdb()

        buf = io.BytesIO()
        with zipfile.ZipFile(buf, "w", zipfile.ZIP_DEFLATED) as zf:
            zf.writestr(SQLITE_ARCHIVE_PATH, sqlite_bytes)
            zf.writestr(COUCHDB_ARCHIVE_PATH, couchdb_bytes)
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

        self._restore_sqlite(sqlite_bytes)
        couchdb_result = self._restore_couchdb(couchdb_bytes)

        return {
            "status": "success",
            "restored_couchdb_docs": couchdb_result["restored_count"],
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

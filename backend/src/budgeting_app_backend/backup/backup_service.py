"""Service for creating and restoring full application backups as ZIP archives."""

import io
import json
import zipfile
from datetime import datetime, timezone
from typing import Dict, Any
import pycouchdb

COUCHDB_ARCHIVE_PATH = "couchdb/budgeting.json"
COUCHDB_DATABASE_NAME = "budgeting"


class BackupService:
    """Creates and restores full backups of the CouchDB budgeting database."""

    def __init__(self, db_url: str):
        self._db_url = db_url

    def create_backup_zip(self) -> bytes:
        couchdb_bytes = self._dump_couchdb()

        buf = io.BytesIO()
        with zipfile.ZipFile(buf, "w", zipfile.ZIP_DEFLATED) as zf:
            zf.writestr(COUCHDB_ARCHIVE_PATH, couchdb_bytes)
        return buf.getvalue()

    def restore_from_zip(self, zip_bytes: bytes) -> Dict[str, Any]:
        buf = io.BytesIO(zip_bytes)
        with zipfile.ZipFile(buf, "r") as zf:
            archive_names = zf.namelist()
            if COUCHDB_ARCHIVE_PATH not in archive_names:
                raise ValueError(f"Missing {COUCHDB_ARCHIVE_PATH} in archive")

            couchdb_bytes = zf.read(COUCHDB_ARCHIVE_PATH)

        result = self._restore_couchdb(couchdb_bytes)

        return {
            "status": "success",
            "restored_docs": result["restored_count"],
        }

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



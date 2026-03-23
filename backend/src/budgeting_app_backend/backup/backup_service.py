"""Service for creating and restoring full application backups as JSON."""

import json
from datetime import datetime, timezone
from typing import Dict, Any
import pycouchdb

COUCHDB_DATABASE_NAME = "budgeting"


class BackupService:
    """Creates and restores full backups of the CouchDB budgeting database."""

    def __init__(self, db_url: str):
        self._db_url = db_url

    def create_backup_json(self) -> bytes:
        server = pycouchdb.Server(self._db_url)
        if COUCHDB_DATABASE_NAME not in server:
            server.create(COUCHDB_DATABASE_NAME)
        db = server.database(COUCHDB_DATABASE_NAME)

        docs = []
        for row in db.all():
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

    def restore_from_json(self, json_bytes: bytes) -> Dict[str, Any]:
        dump_data = json.loads(json_bytes.decode("utf-8"))
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

        return {
            "status": "success",
            "restored_docs": len(docs),
        }



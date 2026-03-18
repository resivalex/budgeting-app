"""Settings implementation backed by the unified CouchDB budgeting database."""

import json
import pycouchdb
import pycouchdb.exceptions

DATABASE_NAME = "budgeting"
SETTINGS_KEY_PREFIX = "cfg:"


class CouchDbSettings:
    """Stores settings as documents in CouchDB with cfg: key prefix."""

    def __init__(self, db_url: str):
        self._server = pycouchdb.Server(db_url)
        self._db = self._get_or_create_db()

    def _get_or_create_db(self):
        if DATABASE_NAME not in self._server:
            self._server.create(DATABASE_NAME)
        return self._server.database(DATABASE_NAME)

    def get(self, name: str) -> str:
        doc_id = SETTINGS_KEY_PREFIX + name
        try:
            doc = self._db.get(doc_id)
        except pycouchdb.exceptions.NotFound:
            return None

        value = doc["value"]
        if isinstance(value, (dict, list)):
            return json.dumps(value, ensure_ascii=False)
        return value

    def set(self, name: str, value: str) -> None:
        doc_id = SETTINGS_KEY_PREFIX + name
        try:
            parsed = json.loads(value)
        except (json.JSONDecodeError, TypeError):
            parsed = value

        try:
            existing = self._db.get(doc_id)
            existing["value"] = parsed
            self._db.save(existing)
        except pycouchdb.exceptions.NotFound:
            self._db.save({"_id": doc_id, "value": parsed, "kind": "setting"})

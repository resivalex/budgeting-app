"""Settings implementation backed by CouchDB budgeting-settings database."""

import json
import pycouchdb
import pycouchdb.exceptions

SETTINGS_DB_NAME = "budgeting-settings"


class CouchDbSettings:
    """Stores settings as documents in CouchDB."""

    def __init__(self, db_url: str):
        self._server = pycouchdb.Server(db_url)
        self._db = self._get_or_create_db()

    def _get_or_create_db(self):
        if SETTINGS_DB_NAME not in self._server:
            self._server.create(SETTINGS_DB_NAME)
        return self._server.database(SETTINGS_DB_NAME)

    def get(self, name: str) -> str:
        try:
            doc = self._db.get(name)
        except pycouchdb.exceptions.NotFound:
            return None

        value = doc["value"]
        if isinstance(value, (dict, list)):
            return json.dumps(value, ensure_ascii=False)
        return value

    def set(self, name: str, value: str) -> None:
        try:
            parsed = json.loads(value)
        except (json.JSONDecodeError, TypeError):
            parsed = value

        try:
            existing = self._db.get(name)
            existing["value"] = parsed
            self._db.save(existing)
        except pycouchdb.exceptions.NotFound:
            self._db.save({"_id": name, "value": parsed})

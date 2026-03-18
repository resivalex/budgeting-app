import uuid

import pycouchdb
import pandas as pd
import io


SETTINGS_KEY_PREFIX = "cfg:"


class CsvImporting:
    def __init__(self, url):
        self.__server = pycouchdb.Server(url)

    def perform(self, content: bytes):
        text = content.decode("utf8")
        records = _parse_text(text)

        for record in records:
            record["_id"] = "tx:" + uuid.uuid4().hex
            record["kind"] = "transaction"

        settings_docs = self._extract_settings()
        db = _recreate_database(self.__server, "budgeting")
        db.save_bulk(settings_docs + records, transaction=True)
        db.compact()

    def _extract_settings(self):
        if "budgeting" not in self.__server:
            return []
        db = self.__server.database("budgeting")
        docs = []
        for row in db.all():
            doc = dict(row["doc"])
            if doc["_id"].startswith(SETTINGS_KEY_PREFIX):
                doc.pop("_rev", None)
                docs.append(doc)
        return docs


def _recreate_database(server, db_name):
    if db_name in server:
        server.delete(db_name)
    return server.create(db_name)


def _parse_text(text: str):
    stream = io.StringIO(text)
    return pd.read_csv(stream, dtype=str).fillna("").to_dict(orient="records")

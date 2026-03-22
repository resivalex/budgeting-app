import pycouchdb
import pycouchdb.exceptions
import pandas as pd
import io


class CsvExporting:
    def __init__(self, url):
        self.__server = pycouchdb.Server(url)

    def perform(self):
        db = _get_or_create_database(self.__server, "budgeting")
        id_to_name = _load_account_id_to_name_map(db)
        records = db.all()
        records = [
            doc["doc"] for doc in records
            if doc["doc"].get("kind") == "transaction"
        ]
        for record in records:
            record["account"] = id_to_name.get(record.get("account", ""), record.get("account", ""))
            if record.get("type") == "transfer":
                record["payee"] = id_to_name.get(record.get("payee", ""), record.get("payee", ""))
        columns = [
            "datetime",
            "account",
            "category",
            "type",
            "amount",
            "currency",
            "payee",
            "comment",
            "budget_name",
        ]
        if len(records) == 0:
            df = pd.DataFrame(columns=columns)
        else:
            df = pd.DataFrame(records)
            drop_cols = [c for c in ["_id", "_rev", "kind"] if c in df.columns]
            df = df.drop(columns=drop_cols)
            df = df.sort_values(by=["datetime"], ascending=False)
            df = df[columns]

        stream = io.StringIO()
        df.to_csv(stream, index=False)

        return stream.getvalue()


def _load_account_id_to_name_map(db):
    try:
        doc = db.get("cfg:account_properties")
    except pycouchdb.exceptions.NotFound:
        return {}
    accounts = doc.get("value", {}).get("accounts", [])
    return {a["id"]: a["name"] for a in accounts if "id" in a and "name" in a}


def _get_or_create_database(server, db_name):
    if db_name not in server:
        server.create(db_name)
    return server.database(db_name)

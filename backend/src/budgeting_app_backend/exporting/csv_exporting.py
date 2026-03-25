import pycouchdb
import pycouchdb.exceptions
import pandas as pd
import io


class CsvExporting:
    def __init__(self, url):
        self.__server = pycouchdb.Server(url)

    def perform(self):
        db = _get_or_create_database(self.__server, "budgeting")
        account_id_to_name = _load_account_id_to_name_map(db)
        bucket_id_to_name = _load_bucket_id_to_name_map(db)
        records = db.all()
        records = [
            doc["doc"] for doc in records
            if doc["doc"].get("kind") == "transaction"
        ]
        for record in records:
            account_from = record.get("account_from", "")
            account_to = record.get("account_to", "")
            tx_type = _derive_transaction_type(account_from, account_to)
            record["type"] = tx_type

            if tx_type == "income":
                own_account = account_to
                bucket_id = record.get("bucket_from", "default")
            elif tx_type == "expense":
                own_account = account_from
                bucket_id = record.get("bucket_to", "default")
            else:
                own_account = account_from
                bucket_id = "default"

            record["account"] = account_id_to_name.get(own_account, own_account)
            if tx_type == "transfer":
                record["payee"] = account_id_to_name.get(account_to, account_to)
            else:
                record["payee"] = record.get("counterparty", "")
            record["bucket"] = bucket_id_to_name.get(bucket_id, bucket_id)
        columns = [
            "datetime",
            "account",
            "category",
            "type",
            "amount",
            "currency",
            "payee",
            "comment",
            "bucket",
        ]
        if len(records) == 0:
            df = pd.DataFrame(columns=columns)
        else:
            df = pd.DataFrame(records)
            drop_cols = [
                c for c in [
                    "_id", "_rev", "kind",
                    "account_from", "account_to", "counterparty",
                    "bucket_from", "bucket_to",
                ] if c in df.columns
            ]
            df = df.drop(columns=drop_cols)
            df = df.sort_values(by=["datetime"], ascending=False)
            df = df[columns]

        stream = io.StringIO()
        df.to_csv(stream, index=False)

        return stream.getvalue()


def _derive_transaction_type(account_from, account_to):
    if account_from.startswith("external_"):
        return "income"
    if account_to.startswith("external_"):
        return "expense"
    return "transfer"


def _load_account_id_to_name_map(db):
    try:
        doc = db.get("cfg:account_properties")
    except pycouchdb.exceptions.NotFound:
        return {}
    accounts = doc.get("value", {}).get("accounts", [])
    return {a["id"]: a["name"] for a in accounts if "id" in a and "name" in a}


def _load_bucket_id_to_name_map(db):
    try:
        doc = db.get("cfg:buckets")
    except pycouchdb.exceptions.NotFound:
        return {}
    buckets = doc.get("value", {}).get("buckets", [])
    return {b["id"]: b["name"] for b in buckets if "id" in b and "name" in b}


def _get_or_create_database(server, db_name):
    if db_name not in server:
        server.create(db_name)
    return server.database(db_name)

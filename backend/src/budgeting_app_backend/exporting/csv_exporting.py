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
        external_account_ids = _load_external_account_ids(db)
        records = db.all()
        records = [
            doc["doc"] for doc in records
            if doc["doc"].get("kind") == "transaction"
        ]
        for record in records:
            account_from = record.get("account_from", "")
            account_to = record.get("account_to", "")
            bucket_from = record.get("bucket_from", "default")
            bucket_to = record.get("bucket_to", "default")
            tx_type = _derive_transaction_type(
                account_from, account_to, bucket_from, bucket_to, external_account_ids
            )
            record["type"] = tx_type
            record["account_from_name"] = account_id_to_name.get(account_from, account_from)
            record["account_to_name"] = account_id_to_name.get(account_to, account_to)
            record["bucket_from_name"] = bucket_id_to_name.get(bucket_from, bucket_from)
            record["bucket_to_name"] = bucket_id_to_name.get(bucket_to, bucket_to)
            record["payee"] = record.get("counterparty", "")
        columns = [
            "datetime",
            "account_from_name",
            "account_to_name",
            "category",
            "type",
            "amount",
            "currency",
            "payee",
            "comment",
            "bucket_from_name",
            "bucket_to_name",
        ]
        if len(records) == 0:
            df = pd.DataFrame(columns=columns)
        else:
            df = pd.DataFrame(records)
            keep_cols = [c for c in columns if c in df.columns]
            df = df[keep_cols]
            df = df.sort_values(by=["datetime"], ascending=False)
            df = df[columns]
        column_renames = {
            "account_from_name": "account_from",
            "account_to_name": "account_to",
            "bucket_from_name": "bucket_from",
            "bucket_to_name": "bucket_to",
        }
        df = df.rename(columns=column_renames)

        stream = io.StringIO()
        df.to_csv(stream, index=False)

        return stream.getvalue()


def _derive_transaction_type(account_from, account_to, bucket_from, bucket_to, external_account_ids):
    from_external = account_from in external_account_ids
    to_external = account_to in external_account_ids

    if from_external and not to_external and bucket_to == "default":
        return "income"
    if not from_external and to_external and bucket_from == "default":
        return "expense"
    if (
        not from_external
        and not to_external
        and bucket_from == "default"
        and bucket_to == "default"
    ):
        return "transfer"
    return "custom"


def _load_account_id_to_name_map(db):
    try:
        doc = db.get("cfg:account_properties")
    except pycouchdb.exceptions.NotFound:
        return {}
    accounts = doc.get("value", {}).get("accounts", [])
    return {a["id"]: a["name"] for a in accounts if "id" in a and "name" in a}


def _load_external_account_ids(db):
    try:
        doc = db.get("cfg:account_properties")
    except pycouchdb.exceptions.NotFound:
        return set()
    accounts = doc.get("value", {}).get("accounts", [])
    return {a["id"] for a in accounts if a.get("external", False)}


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

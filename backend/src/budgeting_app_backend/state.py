from datetime import datetime

from budgeting_app_backend.protocols import SettingsProtocol

from .exporting import CsvExporting as TransactionsCsvExporting
from .settings import (
    UploadDetails,
    UploadDetailsValue,
)


class State:
    def __init__(
        self,
        db_url: str,
        settings: SettingsProtocol,
    ):
        self._db_url = db_url
        self._upload_details = UploadDetails(settings=settings)

    def exporting(self) -> bytes:
        csv_exporting = TransactionsCsvExporting(url=self._db_url)
        return csv_exporting.perform().encode("utf-8")

    def settings(self) -> UploadDetailsValue:
        return self._upload_details.get()

    def mark_transactions_uploaded(self):
        self._upload_details.set(uploaded_at=datetime.utcnow().isoformat())

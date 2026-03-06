from budgeting_app_backend.services import GoogleDriveService


class GoogleDriveDump:
    """Transaction data dumps to Google Drive."""
    
    def __init__(self, credentials_path=None, folder_id=None):
        self._google_drive = GoogleDriveService(
            credentials_path=credentials_path,
            folder_id=folder_id
        )
        
    def put(self, content: bytes) -> dict:
        return self._google_drive.upload_file(content)

"""Scheduler for automated backups to Google Drive."""

import logging
from datetime import datetime
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
from typing import Dict, Any
from .backup_service import BackupService

logger = logging.getLogger(__name__)


class BackupScheduler:
    def __init__(
        self,
        backup_service: BackupService,
        hour: int = 3,
        minute: int = 0,
        google_drive_credentials_path: str = None,
        google_drive_folder_id: str = None,
    ):
        self.backup_service = backup_service
        self.scheduler = BackgroundScheduler()
        self.hour = hour
        self.minute = minute
        self._google_drive_credentials_path = google_drive_credentials_path
        self._google_drive_folder_id = google_drive_folder_id
        self._configure_scheduler()

    def _configure_scheduler(self):
        self.scheduler.add_job(
            self._perform_backup,
            trigger=CronTrigger(hour=self.hour, minute=self.minute),
            id="daily_backup",
            name=f"Daily backup at {self.hour:02d}:{self.minute:02d} UTC",
            replace_existing=True,
        )

    def _perform_backup(self):
        logger.info("Starting scheduled daily backup...")
        try:
            json_bytes = self.backup_service.create_backup_json()
            self._upload_to_google_drive(json_bytes)
            logger.info("Daily backup completed successfully.")
        except Exception as e:
            logger.error(f"Unexpected error during daily backup: {str(e)}")

    def _upload_to_google_drive(self, json_bytes: bytes):
        if not self._google_drive_credentials_path or not self._google_drive_folder_id:
            logger.warning("Google Drive not configured, skipping upload")
            return

        try:
            from budgeting_app_backend.services import GoogleDriveService

            drive = GoogleDriveService(
                credentials_path=self._google_drive_credentials_path,
                folder_id=self._google_drive_folder_id,
            )
            today = datetime.now().strftime("%Y-%m-%d")
            filename = f"backup-{today}.json"
            result = drive.upload_file(json_bytes, mime_type="application/json", filename=filename)
            logger.info(f"Uploaded backup to Google Drive: {result.get('name')}")
        except Exception as e:
            logger.error(f"Failed to upload backup to Google Drive: {str(e)}")

    def start(self):
        if not self.scheduler.running:
            self.scheduler.start()
            job = self.scheduler.get_job("daily_backup")
            if job:
                next_run = (
                    job.next_run_time.strftime("%Y-%m-%d %H:%M:%S UTC")
                    if job.next_run_time
                    else "unknown"
                )
                logger.info(f"Backup scheduler started (next run: {next_run})")
            else:
                logger.warning("Backup scheduler started but daily_backup job not found")
        else:
            logger.info("Scheduler already running, not starting again")

    def shutdown(self):
        if self.scheduler.running:
            self.scheduler.shutdown()
            logger.info("Backup scheduler shut down")

    def trigger_backup_now(self) -> Dict[str, Any]:
        logger.info("Manually triggered backup...")
        try:
            json_bytes = self.backup_service.create_backup_json()
            self._upload_to_google_drive(json_bytes)
            return {
                "status": "success",
                "message": "Backup completed successfully",
                "size_bytes": len(json_bytes),
            }
        except Exception as e:
            logger.error(f"Error in manual backup: {str(e)}")
            return {"status": "error", "message": f"Backup failed: {str(e)}"}

    def get_next_backup_time(self) -> str | None:
        job = self.scheduler.get_job("daily_backup")
        if job and job.next_run_time:
            return job.next_run_time.isoformat()
        return None

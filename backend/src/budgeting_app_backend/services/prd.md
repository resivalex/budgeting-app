# Feature: Backend Services

## Overview

External service integrations for the budgeting application backend, providing seamless integration with third-party platforms for data backup, file storage, and cloud synchronization with comprehensive error handling and automatic retry mechanisms.

## Functionality

### GoogleDriveService

- **Authentication & Authorization**: Service account-based authentication with Google OAuth2 for secure API access and credential management
- **File Upload Operations**: Automated CSV file uploads to designated Google Drive folders with timestamped filenames for organized backup storage
- **Folder Management**: Configurable target folder support for organized file storage and backup categorization
- **Metadata Handling**: Comprehensive file metadata management including file IDs, names, and shareable web view links for easy access
- **Error Handling**: Robust error management with detailed validation for missing credentials and configuration parameters
- **Resumable Uploads**: Support for large file uploads with resumable upload capability for reliability over unstable connections
- **Automatic Naming**: Intelligent filename generation with ISO 8601 timestamps for chronological organization and easy identification
- **Permissions Integration**: Proper Google Drive permissions handling for shared folders and service account access control

### Service Architecture

- **Dependency Injection**: Clean service instantiation with configurable credentials and folder paths for flexible deployment scenarios
- **Environment Configuration**: Environment variable-based configuration for credentials path and target folder ID with validation
- **Protocol Implementation**: Future-ready architecture for additional external service integrations following consistent patterns
- **Credential Validation**: Comprehensive validation of service account credentials and Google Drive API access before operations
- **Resource Management**: Proper API service initialization and connection management for optimal performance and reliability

## Technical Notes

### Google Drive Integration

- **Google API Client Library**: Uses official Google API Python client with proper OAuth2 service account authentication
- **Service Account Credentials**: JSON-based service account credentials for secure, automated access without user interaction
- **Drive API v3**: Latest Google Drive API version for enhanced functionality and performance optimization
- **Scopes Configuration**: Minimal required scopes ('https://www.googleapis.com/auth/drive') for security best practices
- **Media Upload Handling**: Proper binary data handling with MediaIoBaseUpload for efficient file transfer operations

### Configuration & Deployment

- **Environment Variables**: Configurable through GOOGLE_DRIVE_CREDENTIALS_PATH and GOOGLE_DRIVE_FOLDER_ID environment variables
- **Credential Security**: Service account JSON files stored securely outside version control with proper file permissions
- **Error Recovery**: Detailed error messages for troubleshooting credential and configuration issues
- **Validation Logic**: Pre-flight validation of credentials and folder access before attempting upload operations

### Performance & Reliability

- **Resumable Uploads**: Built-in support for resumable uploads to handle network interruptions and large file transfers
- **Connection Management**: Efficient API service reuse within service instance lifecycle for optimal performance
- **File Metadata**: Comprehensive response handling with file IDs, names, and public links for integration with other systems
- **MIME Type Support**: Configurable MIME types with CSV as default for flexible file type handling

### Integration Patterns

- **Backend State Integration**: Seamlessly integrates with the State class for automated backup operations during data import
- **Backup Service Compatibility**: Designed for integration with BackupService and scheduled backup operations
- **API Endpoint Integration**: Ready for direct integration with FastAPI endpoints for manual backup triggers
- **Logging Support**: Structured logging integration for monitoring upload operations and troubleshooting issues

## Component References

- **[Backend State](../state.py)**: Main state management system that utilizes GoogleDriveService for backup operations
- **[Backup Service](../backup/)**: Automated backup system that orchestrates data export and Google Drive uploads
- **[SQLite Module](../sqlite/prd.md)**: Database persistence layer that provides data for backup operations
- **[Main API](../../main.py)**: FastAPI application that exposes manual backup trigger endpoints

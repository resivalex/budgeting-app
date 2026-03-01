# Feature: Backend API

## Overview

A robust FastAPI-based backend service providing comprehensive financial data management, user configuration storage, automated backup systems, and secure API endpoints for the offline-first budgeting application with multi-currency support and cloud integration.

## Functionality

### Core API Services

- **RESTful API Design**: Comprehensive REST API with standardized endpoints for all application data and configuration management
- **Authentication & Authorization**: Token-based authentication system with secure credential management and request authorization
- **Multi-Currency Financial Operations**: Complete financial transaction management with multi-currency support and real-time data processing
- **Real-time Data Synchronization**: Bidirectional data sync capabilities supporting offline-first client architecture with conflict resolution
- **Automated Backup Systems**: Full-database backup as ZIP archive (SQLite + CouchDB), with restore capability and optional Google Drive upload
- **Configuration Management**: Comprehensive user preference and application settings management with persistent storage

### Data Management Layer

- **Transaction Operations**: Complete CRUD operations for financial transactions with bulk processing, data validation, and budget name association for multi-budget support
- **Budget Management**: Sophisticated budget configuration with spending limits, currency conversion, monthly tracking, and named budgets for transaction grouping
- **User Preferences**: Flexible user configuration storage including account properties, category expansions, and visual customization
- **Import/Export Operations**: CSV-based data import and export functionality for backup, migration, and external integration with backward compatibility for evolving transaction fields (e.g., budget_name defaults for older CSVs)
- **Data Integrity**: Comprehensive data validation, error handling, and consistency checks across all operations

### External Integrations

- **Google Drive Backup**: Optional scheduled cloud backup upload of ZIP archives
- **Full Database Restore**: Restore both SQLite and CouchDB from a single ZIP archive
- **Database Synchronization**: CouchDB integration for real-time data replication and offline synchronization support
- **Cross-Platform Compatibility**: API design optimized for web, mobile, and desktop client applications
- **Third-Party Extensions**: Extensible architecture supporting future integrations with banking APIs and financial services

### Security & Reliability

- **Secure Authentication**: Password-based authentication with token management and session security
- **Data Protection**: Encrypted data transmission and secure credential management across all endpoints
- **Error Handling**: Comprehensive error management with structured error responses and detailed logging
- **Performance Optimization**: Efficient data processing, connection pooling, and resource management for optimal response times
- **Monitoring & Logging**: Detailed operational logging and health monitoring for production deployment

## Technical Notes

- FastAPI framework with automatic OpenAPI documentation
- Dual database architecture: CouchDB for transactions, SQLite for configuration
- Token-based authentication and authorization
- Docker containerization for deployment
- Automated daily backups via APScheduler

## Module References

- **[Services](./src/budgeting_app_backend/services/prd.md)**: External service integrations including Google Drive backup functionality
- **[Settings](./src/budgeting_app_backend/settings/prd.md)**: Comprehensive application configuration management with user preferences and budget configurations
- **[SQLite](./src/budgeting_app_backend/sqlite/prd.md)**: Lightweight database abstraction for persistent configuration storage
- **[Transactions](./src/budgeting_app_backend/transactions/prd.md)**: Core transaction data management with database access and backup integration
- **[Exporting](./src/budgeting_app_backend/exporting/prd.md)**: Data export functionality transforming transaction data into standardized CSV format
- **[Importing](./src/budgeting_app_backend/importing/prd.md)**: Data import functionality with complete database reconstruction and backup automation
- **[Backup](./src/budgeting_app_backend/backup/prd.md)**: Full backup/restore system with ZIP archives containing SQLite and CouchDB snapshots

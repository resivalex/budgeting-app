# Budgeting App

Personal finance manager with automated backups.

## Architecture

Three-tier offline-first application:

- **Frontend**: React 19 PWA with PouchDB for local offline storage
- **Database**: CouchDB for transaction document storage and bidirectional sync
- **Backend**: FastAPI Python API with SQLite for configuration settings

### Data Flow

```
Web (PouchDB) <--sync--> CouchDB <--read--> Backend (FastAPI)
                                    SQLite (settings/limits)
```

**Transaction Data**: Lives in CouchDB and syncs bidirectionally with browser's PouchDB for offline-first capability. Backend reads transactions from CouchDB for exports and backups.

**Configuration Data**: Spending limits, account properties, and category expansions are stored in SQLite, managed exclusively by the backend.

**Backups**: Automated CSV exports to Google Drive, scheduled daily via backend scheduler.

## Components

- **Backend**: FastAPI Python API ([details](backend/README.md))
- **Database**: CouchDB via Docker ([config](db/README.md))
- **Frontend**: React 19 PWA ([usage](web/README.md))

## Getting Started

### Quick Start (Docker)

```bash
# Development
docker-compose -f docker-compose.dev.yml up

# Production
docker-compose up -d
```

Access:

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000/api
- Database: http://localhost:9002

> Note: Each component can also be run independently by using the component-specific Docker Compose files.

### Manual Setup

#### Database

```bash
cd db
cp .env.example .env
docker-compose -f docker-compose.dev.yml up -d
```

#### Backend

```bash
cd backend
cp .env.example .env
poetry install
poetry run alembic upgrade head
poetry run uvicorn main:app --reload
```

#### Frontend

```bash
cd web
cp .env.example .env
yarn install
yarn start
```

## Features

- Budget management with categories & limits
- Transaction tracking
- Data visualization
- Offline support
- Automated Google Drive backups
- CSV import/export

## License

[MIT License](LICENSE)

# Budgeting App - AI Coding Instructions

## Documentation Workflow

**Always read corresponding README files before starting work** to understand current architecture and decisions. **Update READMEs at the end of your work** to keep them in sync with code changes. This ensures documentation stays current and valuable.

Relevant README files: `README.md` (root), `backend/README.md`, `web/README.md`, `db/README.md`

## Architecture

Three-tier offline-first app: React PWA (`web/`) ↔ CouchDB (`db/`) ↔ FastAPI backend (`backend/`). See component READMEs for architectural details.

## Development Commands

```bash
# Full stack (from root)
docker-compose -f docker-compose.dev.yml up

# Individual components
cd backend && poetry run uvicorn main:app --reload  # API at :8000
cd web && yarn start                                 # Frontend at :3000
cd db && docker-compose -f docker-compose.dev.yml up # CouchDB at :9002

# Backend migrations
cd backend && poetry run alembic upgrade head
cd backend && poetry run alembic revision --autogenerate -m "description"

# Frontend
cd web && yarn build
```

## Key Patterns

### Frontend (web/src/)

- **Service layer**: `DbService` wraps PouchDB, `BackendService` wraps API calls
- **Path aliases**: Use `@/` for imports (e.g., `import { TransactionDTO } from '@/types'`)
- **Component structure**: Feature folders under `components/` with container pattern (`*Container.tsx` handles logic, presentational components below)
- **State management**: Jotai atoms for global state, React hooks for local

### Backend (backend/src/budgeting_app_backend/)

- **State pattern**: `State` class aggregates all services, created via factory in `main.py`
- **Protocols**: Type interfaces in `protocols/` define contracts between modules
- **Exports in `__init__.py`**: Public API exposed through module's `__init__.py`

## Coding Style

Write clean, self-documenting code without obvious comments:

**Naming**: Descriptive and concise

```typescript
// Good
const pullFromRemote = useCallback(async function pullFromRemoteImpl() { ... })
const needsDatabaseReset = localStorage.transactionsUploadedAt !== remoteSettings.transactionsUploadedAt

// Avoid
const pfr = useCallback(async function f() { ... })  // Cryptic
const flag = x !== y  // Non-descriptive
```

**Functions**: Single responsibility, named for what they do

```python
# Good
def _get_currency_config(self, value: SpendingLimitsValue, date: str) -> CurrencyConfigValue:
    return next((c.config for c in value.month_currency_configs if c.date == date), None)

# Avoid
def process(self, v, d):  # Unclear what this does
```

**No obvious comments**: Code clarity over comments

```typescript
// Good
const immediateFirstPull = 0;
const retryPushDelay = 3000;
const syncIntervalMs = 10000;

// Avoid
const delay = 3000; // Wait 3 seconds before retry (obvious from context)
```

**TypeScript**: Use strict types, leverage inference

```typescript
// Good
interface Props {
  backendService: BackendService;
  dbService: DbService;
  isLoading: boolean;
}

// Avoid generic types or 'any' unless necessary
```

**Python**: Type hints on public interfaces, Pydantic models for data

```python
# Good
class MonthLimit(BaseModel):
    date: str
    currency: str
    amount: float

def get(self) -> SpendingLimitsValue:
    return SpendingLimitsValue.parse_raw(self._settings.get("spending_limits"))
```

## Conventions

- Backend uses Poetry for dependencies, Python 3.9+
- Frontend uses Yarn, TypeScript strict mode
- Docker Compose files: `*.base.yml` (shared), `*.dev.yml` (dev), `*.yml` (prod)
- PRD documents in `prd.md` files describe feature requirements

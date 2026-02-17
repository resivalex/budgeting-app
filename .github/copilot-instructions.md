# Budgeting App - AI Coding Instructions

## Documentation Workflow

**Always read both README and PRD files before starting work.** Update them after making code changes to keep documentation synchronized.

### Documentation Update Workflow

When making code changes:

1. **Identify affected directories** - Determine which directories contain modified files
2. **Read existing documentation** - Fully read README and PRD files in affected directories before updating
3. **Update README files** - Reflect technical changes (architecture, setup, commands, workflows)
4. **Update PRD files** - Reflect requirement changes (features, functionality, integrations)

### README vs PRD - Separation of Concerns

**README files** (Developer-focused):

- **Audience**: Developers setting up, running, or modifying the code
- **Content**: Setup instructions, commands, architecture decisions, technical workflows, "how to" guides
- **Examples**: Installation steps, environment config, migration commands, debugging tips
- **Include**: High-level architecture, key innovations, design rationale, usage examples, API surface
- **Exclude**: Specific method signatures, line-by-line explanations, low-level algorithms, implementation details

**PRD files** (Requirement-focused):

- **Audience**: Understanding what features do and why they exist
- **Content**: Feature functionality, user interactions, business requirements, integration points
- **Focus**: "What" and "why", not "how" - requirements without implementation details
- **Include**: Feature descriptions, user workflows, business logic, data flows, integration points
- **Exclude**: Technical implementation, code structure, deployment details, architectural decisions

**Key Files**:

- Root: `README.md`, `prd.md`
- Backend: `backend/README.md`, `backend/prd.md`, module-level `prd.md` files
- Frontend: `web/README.md`, `web/prd.md`, component-level `prd.md` files
- Database: `db/README.md`, `db/prd.md`

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

**Documentation in code**: Minimal and purposeful

```python
# Good - Single-line docstrings for modules and classes only
"""Service for managing transaction synchronization."""

class TransactionService:
    """Handles transaction CRUD operations and sync logic."""

    def sync_with_remote(self, transactions: list[Transaction]) -> SyncResult:
        # Method is self-documenting, no docstring needed
        ...

# Avoid - Obvious comments and verbose docstrings
def calculate_total(items):
    """
    This function calculates the total.
    Args: items - list of items
    Returns: total
    """
    total = 0  # Initialize total to zero
    for item in items:  # Loop through items
        total += item.price  # Add price to total
    return total  # Return the result
```

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

**No obvious comments**: Code clarity over comments; clean up redundant comments after refactoring

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

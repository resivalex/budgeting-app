# Frontend Refactoring Plan: Separate Business Logic from UI

## Goal

Introduce a clean separation between business logic and UI using **Domain Services + Jotai Atoms** pattern. This eliminates prop drilling, centralizes state, and makes business logic framework-agnostic.

## Strategy

- **Incremental refactor**: Feature-by-feature, starting with transactions
- **No unit tests**: Focus on structural changes only
- **Separate StorageService**: Abstract localStorage for flexibility

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     React Components                         │
│  (Containers read atoms, call domain methods, render UI)    │
└─────────────────────────┬───────────────────────────────────┘
                          │ useAtom, domain.method()
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                     src/state/ (Jotai Atoms)                │
│  Reactive state holders: transactionsAtom, syncStatusAtom   │
└─────────────────────────┬───────────────────────────────────┘
                          │ atom.set()
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                  src/domain/ (Domain Services)              │
│  Pure TS classes with business logic, no React deps         │
│  TransactionDomain, SyncDomain, SettingsDomain              │
└─────────────────────────┬───────────────────────────────────┘
                          │ service.method()
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                  src/services/ (Infrastructure)             │
│  DbService, BackendService, StorageService                  │
└─────────────────────────────────────────────────────────────┘
```

---

## Phase 1: Foundation

### Step 1.1: Create StorageService

Create `src/services/StorageService.ts` to abstract all localStorage access.

**Tasks:**

- Define interface with typed keys (credentials, transactionsUploadedAt, accountColors, categoryExpansions)
- Implement get/set/remove methods with JSON serialization
- Export from `src/services/index.ts`

### Step 1.2: Create state folder structure

Create `src/state/` folder for Jotai atoms.

**Tasks:**

- Create `src/state/index.ts` as barrel export
- Create `src/state/types.ts` for shared state types if needed

### Step 1.3: Create domain folder structure

Create `src/domain/` folder for domain services.

**Tasks:**

- Create `src/domain/index.ts` as barrel export
- Establish naming convention: `*Domain.ts` for domain service classes

---

## Phase 2: Transactions Domain (First Feature)

### Step 2.1: Create transactionsAtom

Create `src/state/transactionsAtom.ts`.

**Tasks:**

- Define atom holding `TransactionDTO[]`
- Define derived atom for aggregations (or keep aggregations computed on-demand)
- Export atoms

### Step 2.2: Create TransactionDomain

Create `src/domain/TransactionDomain.ts`.

**Tasks:**

- Accept `DbService` in constructor
- Move transaction CRUD logic from `useTransactions.ts`:
  - `loadTransactions()`
  - `createTransaction()`
  - `updateTransaction()`
  - `deleteTransaction()`
- Methods should return data, not update atoms directly

### Step 2.3: Create useTransactionsDomain hook

Create `src/hooks/useTransactionsDomain.ts` as thin adapter.

**Tasks:**

- Wire TransactionDomain methods to transactionsAtom updates
- Expose same interface as current `useTransactions` for easy migration
- Keep TransactionAggregator usage here or in derived atom

### Step 2.4: Migrate useTransactions consumers

Update components that use `useTransactions`.

**Tasks:**

- Replace `useTransactions` import with `useTransactionsDomain`
- Verify functionality works identically
- Remove old `useTransactions.ts` when all consumers migrated

---

## Phase 3: Sync Domain

### Step 3.1: Create syncStatusAtom

Create `src/state/syncStatusAtom.ts`.

**Tasks:**

- Define atom holding sync state (isOnline, isSyncing, lastSyncTime, etc.)
- Export atoms

### Step 3.2: Create SyncDomain

Create `src/domain/SyncDomain.ts`.

**Tasks:**

- Accept `DbService`, `BackendService`, `StorageService` in constructor
- Move sync logic from `useSyncService.ts`:
  - `pullFromRemote()`
  - `pushToRemote()`
  - `checkDatabaseReset()`
  - `startSyncLoop()` / `stopSyncLoop()`
- Emit events or return status for atom updates

### Step 3.3: Create useSyncDomain hook

Create `src/hooks/useSyncDomain.ts`.

**Tasks:**

- Wire SyncDomain to syncStatusAtom
- Integrate with transactionsAtom (reload after sync)
- Handle lifecycle (start sync on mount, cleanup on unmount)

### Step 3.4: Migrate useSyncService consumers

Update `AuthorizedAppContainer` and related components.

**Tasks:**

- Replace `useSyncService` with `useSyncDomain`
- Remove old `useSyncService.ts`

---

## Phase 4: Settings & Config Domain

### Step 4.1: Create configAtom

Create `src/state/configAtom.ts`.

**Tasks:**

- Define atoms for: accountColors, categoryExpansions, spendingLimits
- Initialize from StorageService where applicable

### Step 4.2: Create SettingsDomain

Create `src/domain/SettingsDomain.ts`.

**Tasks:**

- Accept `BackendService`, `StorageService` in constructor
- Move settings logic:
  - `loadAccountColors()`
  - `loadCategoryExpansions()`
  - `loadSpendingLimits()`
  - `saveAccountColors()` / `saveCategoryExpansions()`

### Step 4.3: Create useSettingsDomain hook

Create `src/hooks/useSettingsDomain.ts`.

**Tasks:**

- Wire SettingsDomain to configAtom
- Replace `useAccountColors`, `useCategoryExpansions` hooks

### Step 4.4: Migrate settings consumers

Update components using settings hooks.

**Tasks:**

- Replace old hooks with atom reads + domain methods
- Remove old settings hooks

---

## Phase 5: Cleanup & Consolidation

### Step 5.1: Slim down containers

Review all `*Container.tsx` files.

**Tasks:**

- Remove any remaining business logic
- Containers should only: read atoms, call domain methods, pass data to presentational components

### Step 5.2: Remove prop drilling from AuthorizedAppContainer

Refactor `AuthorizedAppContainer.tsx`.

**Tasks:**

- Remove transactions/sync state passed as props
- Child components read atoms directly
- Keep service initialization and domain wiring

### Step 5.3: Organize hooks folder

Create `src/hooks/` if not exists.

**Tasks:**

- Move all domain adapter hooks here
- Update imports across codebase
- Keep component-specific hooks in component folders if preferred

### Step 5.4: Update barrel exports

Ensure clean imports.

**Tasks:**

- `src/state/index.ts` exports all atoms
- `src/domain/index.ts` exports all domain classes
- `src/hooks/index.ts` exports all hooks (optional)
- `src/services/index.ts` includes StorageService

---

## Migration Checklist

Use this checklist to track progress:

- [x] **Phase 1: Foundation**

  - [x] StorageService created
  - [x] state/ folder created
  - [x] domain/ folder created

- [x] **Phase 2: Transactions**

  - [x] transactionsAtom created
  - [x] TransactionDomain created
  - [x] useTransactionsDomain hook created
  - [x] All consumers migrated
  - [x] Old useTransactions.ts removed

- [x] **Phase 3: Sync**

  - [x] syncStatusAtom created
  - [x] SyncDomain created
  - [x] useSyncDomain hook created
  - [x] All consumers migrated
  - [x] Old useSyncService.ts removed

- [x] **Phase 4: Settings**

  - [x] configAtom created
  - [x] SettingsDomain created
  - [x] useSettingsDomain hook created
  - [x] All consumers migrated
  - [x] Old settings hooks removed

- [x] **Phase 5: Cleanup**
  - [x] Containers slimmed down
  - [x] Prop drilling removed
  - [x] Hooks organized
  - [x] Exports updated

---

## Notes

- **Backwards compatibility**: Each step should leave the app in a working state
- **Local decisions**: Exact method signatures and atom shapes can be refined during implementation
- **Jotai patterns**: Use `atom()` for writable state, `atom((get) => ...)` for derived/computed values
- **Service instantiation**: Domain classes instantiated once in app initialization, passed to hooks via context or direct import

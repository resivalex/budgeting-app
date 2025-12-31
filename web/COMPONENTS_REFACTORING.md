# Components Refactoring Plan: Extract Business Logic from UI

## Goal

Extract remaining business logic from UI container components into the existing domain services and Jotai atoms pattern. Containers should only read atoms, call domain methods, and render UI - no business calculations.

## Strategy

- **Incremental refactor**: One container at a time
- **Reuse existing architecture**: Add to existing domain services and atoms
- **Eliminate localStorage access**: All localStorage reads should go through StorageService and atoms

---

## Current Issues Found

### 1. BudgetsContainer (High Priority)

**Location**: `src/components/Budgets/BudgetsContainer.tsx`

**Business Logic Found**:

- `calculateBudget()` - Budget calculation with currency conversion
- `calculateBudgets()` - Month budgets aggregation with spending limits
- `getAvailableMonths()` - Extracts available months from spending limits
- `calculateExpectationRatioByCurrentDate()` - Date-based progress calculation
- `requestBudgetsFromBackend()` - SpendingLimits fetching with localStorage caching
- `updateBudgetItem()` - Budget item modification via BackendService
- Direct `localStorage.config` and `localStorage.spendingLimits` access
- BackendService instantiation inside component

### 2. TransactionFormContainer (Medium Priority)

**Location**: `src/components/TransactionForm/TransactionFormContainer.tsx`

**Business Logic Found**:

- `useCategoryExtensions()` - Category name mapping from localStorage
- `getAvailableCurrenciesAndAccounts()` - Filter logic for transfers
- `adjustCurrencyAndAccounts()` - State adjustment based on type change
- Transaction DTO construction in `handleSave()`
- Form validation logic in `isValid`
- `TransactionAggregator` instantiation for payee/comment filtering
- Direct `localStorage.categoryExpansions` and `localStorage.accountProperties` access

### 3. TransactionsPageContainer (Low Priority)

**Location**: `src/components/Transactions/TransactionsPageContainer.tsx`

**Business Logic Found**:

- Transaction filtering logic with cross-language matching
- Filter conditions for transfers vs regular transactions

### 4. HomeContainer (Low Priority)

**Location**: `src/components/Home/HomeContainer.tsx`

**Business Logic Found**:

- Direct `localStorage.accountProperties` access
- Account coloring merge logic

### 5. AuthorizedAppContainer (Low Priority)

**Location**: `src/components/App/AuthorizedAppContainer.tsx`

**Business Logic Found**:

- CSV export with blob creation and download logic in `handleExport()`
- `localStorage.removeItem('config')` in logout

---

## Phase 1: Budgets Domain (High Impact)

### Step 1.1: Create spendingLimitsAtom

Create `src/state/spendingLimitsAtom.ts`.

**Tasks:**

- Define atom holding `SpendingLimitsDTO | null`
- Export atom

### Step 1.2: Create BudgetsDomain

Create `src/domain/BudgetsDomain.ts`.

**Tasks:**

- Move `calculateBudget()` from BudgetsContainer
- Move `calculateBudgets()` from BudgetsContainer
- Move `getAvailableMonths()` from BudgetsContainer
- Move `calculateExpectationRatioByCurrentDate()` from BudgetsContainer
- Accept `BackendService`, `StorageService` in constructor
- Add `loadSpendingLimits()` method with caching
- Add `updateBudgetItem()` method
- All methods should be pure functions or return data

### Step 1.3: Create useBudgetsDomain hook

Create `src/hooks/useBudgetsDomain.ts`.

**Tasks:**

- Wire BudgetsDomain to spendingLimitsAtom
- Wire to transactionsAtom for budget calculations
- Expose `budgets`, `availableMonths`, `selectedMonth`, `loadBudgets()`, `updateBudgetItem()`
- Handle loading state and error fallback to cached values

### Step 1.4: Refactor BudgetsContainer

Update `src/components/Budgets/BudgetsContainer.tsx`.

**Tasks:**

- Replace inline functions with useBudgetsDomain hook
- Remove all localStorage access
- Remove BackendService instantiation
- Container only manages UI state (focusedBudgetName, selectedMonth)

---

## Phase 2: Transaction Form Domain (Medium Impact)

### Step 2.1: Enhance configAtom

Update `src/state/configAtom.ts`.

**Tasks:**

- Ensure categoryExpansions and accountProperties are available
- Already done in previous refactoring, verify atoms are accessible

### Step 2.2: Create TransactionFormDomain

Create `src/domain/TransactionFormDomain.ts`.

**Tasks:**

- Move category extension mapping logic
- Move `getAvailableCurrenciesAndAccounts()` - filter currencies/accounts for transfer type
- Move form validation logic
- Move transaction DTO construction
- Add `getPayeesByCategory()` using TransactionAggregator
- Add `getCommentsByCategory()` using TransactionAggregator
- Pure functions, no state management

### Step 2.3: Create useTransactionFormDomain hook

Create `src/hooks/useTransactionFormDomain.ts`.

**Tasks:**

- Wire TransactionFormDomain to atoms
- Read categoryExpansions from configAtom
- Read accountProperties from configAtom
- Expose helper functions for form logic
- Manage form state internally or expose for container

### Step 2.4: Refactor TransactionFormContainer

Update `src/components/TransactionForm/TransactionFormContainer.tsx`.

**Tasks:**

- Replace localStorage reads with atom access via hook
- Replace inline business logic with domain calls
- Keep only React form state management
- Remove TransactionAggregator instantiation

---

## Phase 3: Transaction Filtering Domain (Low Impact)

### Step 3.1: Create TransactionFilterDomain

Create `src/domain/TransactionFilterDomain.ts`.

**Tasks:**

- Move filtering logic from TransactionsPageContainer
- Implement `filterTransactions(transactions, filters)` method
- Handle cross-language matching internally
- Handle transfer account logic

### Step 3.2: Create useTransactionFilterDomain hook (Optional)

Create `src/hooks/useTransactionFilterDomain.ts`.

**Tasks:**

- Wire domain to transactionsAtom
- Expose filtered transactions derived from atom
- Or keep as pure function call in container

### Step 3.3: Refactor TransactionsPageContainer

Update `src/components/Transactions/TransactionsPageContainer.tsx`.

**Tasks:**

- Replace inline filtering with domain call
- Container only passes filtered results to child

---

## Phase 4: Home & Account Coloring (Low Impact)

### Step 4.1: Create useColoredAccountsDomain hook

Create `src/hooks/useColoredAccountsDomain.ts`.

**Tasks:**

- Replace current `useColoredAccounts` util with atom-based hook
- Read accountProperties from configAtom instead of localStorage
- Return `ColoredAccountDetailsDTO[]`

### Step 4.2: Refactor HomeContainer

Update `src/components/Home/HomeContainer.tsx`.

**Tasks:**

- Use useColoredAccountsDomain hook
- Remove localStorage access
- Remove mergeAccountDetailsAndProperties call

### Step 4.3: Update TransactionFormContainer

Update account coloring usage.

**Tasks:**

- Replace `useColoredAccounts` util with new hook
- Remove localStorage.accountProperties access

---

## Phase 5: Export & Auth Cleanup

### Step 5.1: Add export to existing domain

Update `src/domain/SettingsDomain.ts` or create `ExportDomain.ts`.

**Tasks:**

- Move CSV export logic from AuthorizedAppContainer
- `exportToCsv()` - handles blob creation and download trigger
- Or add to BackendService as a helper

### Step 5.2: Add logout to AuthDomain (Optional)

Create `src/domain/AuthDomain.ts` if needed.

**Tasks:**

- Move logout logic (clear localStorage, reload)
- Or keep in container as it's primarily UI-driven

### Step 5.3: Refactor AuthorizedAppContainer

Update `src/components/App/AuthorizedAppContainer.tsx`.

**Tasks:**

- Replace handleExport inline logic with domain call
- Use StorageService for logout cleanup

---

## Migration Checklist

Use this checklist to track progress:

- [ ] **Phase 1: Budgets**

  - [ ] spendingLimitsAtom created
  - [ ] BudgetsDomain created
  - [ ] useBudgetsDomain hook created
  - [ ] BudgetsContainer refactored
  - [ ] All localStorage access removed from BudgetsContainer

- [ ] **Phase 2: Transaction Form**

  - [ ] TransactionFormDomain created
  - [ ] useTransactionFormDomain hook created
  - [ ] TransactionFormContainer refactored
  - [ ] All localStorage access removed from TransactionFormContainer

- [ ] **Phase 3: Transaction Filtering**

  - [ ] TransactionFilterDomain created
  - [ ] TransactionsPageContainer refactored

- [ ] **Phase 4: Home & Account Coloring**

  - [ ] useColoredAccountsDomain hook created
  - [ ] HomeContainer refactored
  - [ ] Old useColoredAccounts util removed

- [ ] **Phase 5: Export & Auth**
  - [ ] Export logic moved to domain
  - [ ] AuthorizedAppContainer cleaned up
  - [ ] All containers use StorageService via atoms

---

## Expected Outcomes

After completing this refactoring:

1. **All containers** will only:

   - Read Jotai atoms for state
   - Call domain methods for business logic
   - Manage local UI state (focused items, form inputs)
   - Render presentational components

2. **No direct localStorage access** in any component - all through StorageService and atoms

3. **Business logic fully testable** without React rendering

4. **Consistent architecture** across all features following Domain + Atoms + Hooks pattern

---

## Notes

- **Priority order**: Phases are ordered by impact and complexity
- **Backwards compatibility**: Each phase should leave the app working
- **Atom granularity**: Prefer fine-grained atoms for selective re-renders
- **Domain instantiation**: Use useMemo in hooks to prevent recreations
- **Service dependencies**: Pass services via hook parameters, not direct imports in domains

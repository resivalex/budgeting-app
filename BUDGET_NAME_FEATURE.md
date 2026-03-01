# Budget Name Feature — Implementation Plan

## Context

**Current state:**

- `SpendingLimit` has `name`, `color`, `categories[]`, `month_limits[]`
- Each category belongs to exactly one budget (via `categories[]` list)
- `TransactionDTO` has no `budget_name` field
- Budget calculation matches transactions by `transaction.category ∈ budget.categories`
- "ОБЩИЙ" (Total) and "Другое" (Rest) are synthetic — computed from real budgets

**Target state:**

- Transactions carry `budget_name` field; budget calculation uses it exclusively
- Transaction form auto-assigns `budget_name` from the category's budget
- Category list on each budget is used only to infer `budget_name` for new transactions
- Eventually: categories can belong to multiple budgets (many-to-many)

**Migration path:** add field → persist → assign on new transactions → migrate existing → switch calculation

---

## Step 1 — Add `budget_name` field to `TransactionDTO`

**Goal:** Lay the groundwork with zero behavior change.

**Files:**

- `web/src/types/TransactionDTO.ts` — add `budget_name: string` (empty string `""` = unset)
- `web/src/domain/TransactionFormDomain.ts` — add `budget_name: ''` to `buildTransactionDTO` return value (required for compilation)

**Acceptance:** TypeScript compiles; app behaves identically; all new transactions get `budget_name: ""`.

---

## Step 2 — Persist `budget_name` in PouchDB / CouchDB and backend

**Goal:** `budget_name` survives reload and sync.

**Files:**

- `web/src/services/DbService.ts` — in `readAllDocs()`, default missing `budget_name` to `""` (old PouchDB docs lack the field); write path works automatically (PouchDB stores all DTO properties)
- `backend/src/budgeting_app_backend/exporting/csv_exporting.py` — add `"budget_name"` to the hardcoded `columns` list; default missing column to `""`
- `backend/src/budgeting_app_backend/importing/csv_importing.py` — after CSV parse, ensure `budget_name` column exists with `""` default for old CSVs

**Acceptance:** A transaction saved with `budget_name` retains it after reload and CouchDB sync. CSV export/import round-trips `budget_name`.

---

## Step 3 — Transaction form: auto-assign `budget_name` from category

**Goal:** All new transactions get `budget_name` based on which budget owns the selected category.

**Files:**

- `web/src/domain/TransactionFormDomain.ts`
  - add `getBudgetNameForCategory(category, spendingLimits): string` — iterate `spendingLimits.limits`, find the one whose `categories` includes `category`, return its `name`; return `""` if none found
  - update `buildTransactionDTO` to accept `budget_name` parameter (instead of hardcoded `""`)
- `web/src/hooks/useTransactionFormDomain.ts` — subscribe to `spendingLimitsAtom`; return `spendingLimits` alongside existing values
- `web/src/components/TransactionForm/TransactionFormContainer.tsx`
  - add `budgetName` state; destructure `spendingLimits` from hook
  - on category change, call `domain.getBudgetNameForCategory(category, spendingLimits)` → `setBudgetName`
  - when editing, initialize `budgetName` from `transaction.budget_name`
  - pass `budgetName` to `buildTransactionDTO`

**Behavior:** Category selected → look up the budget that contains this category → set `budget_name`. If none found, `budget_name` stays `""`. No UI for `budget_name` — silent auto-assign only. Categories are not month-specific in `SpendingLimit`, so no `monthDate` parameter needed.

**Acceptance:** New transactions have `budget_name`; budget calculation still runs on categories (unchanged); budget view totals are unaffected.

---

## Step 4 — Migrate existing transactions: assign `budget_name` from category

**Goal:** All existing transactions get `budget_name` so the category-based fallback can be dropped.

**Files:**

- `web/src/domain/MigrationDomain.ts` (new) — one-time migration logic:
  - read all transactions via `DbService.readAllDocs()`
  - build category → budget name lookup from `SpendingLimitsDTO.limits`
  - for each transaction where `budget_name` is `""`: look up category, set `budget_name`
  - batch-write modified transactions via `DbService.bulkUpdate()` (new method)
  - store migration version in `localStorage` to avoid re-running
- `web/src/services/DbService.ts` — add `bulkUpdate(docs)` method wrapping PouchDB `bulkDocs()` for efficient batch writes
- `web/src/components/App/AuthorizedAppContainer.tsx` — trigger migration after initial data load, gated on localStorage version check
- SpendingLimits data sourced from `localStorage` cache (or fetched from backend if unavailable)

**Behavior:** After migration every transaction has a non-empty `budget_name` (except transfers and transactions whose category belongs to no budget — those keep `""`). Normal sync loop pushes changes to CouchDB.

**Acceptance:** No transaction in PouchDB has an empty `budget_name` for a category that belongs to a budget.

---

## Step 5 — Switch budget calculation to use `budget_name` exclusively

**Goal:** Drop category-based matching; `budget_name` is the single source of truth.

**Files:**

- `web/src/domain/BudgetsDomain.ts`:
  - `calculateSingleBudget` — match by `transaction.budget_name === budget.name` instead of category map
  - "Другое" collects transactions where `budget_name === ""`
  - "ОБЩИЙ" computed by summing real budgets' `spentAmount` (avoids mismatch with stale `budget_name` values)
  - `buildRestLimit` simplified — no longer needs `allCategories` set
  - remove `categories` parameter from `calculateBudgets`
- `web/src/hooks/useBudgetsDomain.ts` — remove `aggregations.categories` from `calculateBudgets` call

**Acceptance:** Budget totals are identical to pre-migration; category lists on `SpendingLimit` are no longer used for matching (only for inferring `budget_name` on new transactions).

---

## Step 6 — Show and edit `budget_name` on transactions

**Goal:** `budget_name` is visible and manually correctable.

**Files:**

- `web/src/components/Transactions/Transaction/TransactionContent.tsx` — display `budget_name` as a colored badge next to category (use budget's `color` from SpendingLimits)
- `web/src/components/Transactions/Transaction/TransactionTile.tsx` — pass `budget_name` to `TransactionContent`
- `web/src/components/Transactions/TransactionInfoModal.tsx` — display `budget_name` field in detail view
- `web/src/components/TransactionForm/FormInputs/BudgetName.tsx` (new) — dropdown of all budget names, following `Category.tsx` react-select pattern
- `web/src/components/TransactionForm/FormInputs/index.tsx` — export `BudgetName`
- `web/src/components/TransactionForm/StepByStepTransactionForm.tsx` — accept and render `BudgetName` step
- `web/src/components/TransactionForm/StepByStepTransactionForm/FormLayout.tsx` — add `BudgetName` step after Category
- `web/src/hooks/useTransactionFormDomain.ts` — derive `budgetNameOptions` from `spendingLimits.limits[].name`

**Acceptance:** Transaction list shows `budget_name` badge. Editing a transaction shows its current `budget_name` in a dropdown and allows saving a new one.

---

## Step 7 — Allow many-to-many: categories in multiple budgets + disambiguation UI

**Goal:** A category can appear in multiple budgets; user picks which budget at transaction creation time.

**Files:**

- `web/src/domain/TransactionFormDomain.ts` — change `getBudgetNameForCategory` → `getBudgetNamesForCategory` returning `string[]`
- `web/src/components/TransactionForm/FormInputs/BudgetName.tsx` — update to show filtered options from `getBudgetNamesForCategory`; render only when 2+ matches (auto-assign when exactly 1)
- `web/src/components/TransactionForm/TransactionFormContainer.tsx` — use `getBudgetNamesForCategory`; show `BudgetName` step conditionally when ambiguous; silent auto-assign when unambiguous

**Behavior:**

1. One matching budget → silent auto-assign (same as Step 3)
2. Two or more → show "Budget" dropdown, pre-selected to first match
3. Zero → `budget_name` stays `""`

**Acceptance:** A category in two budgets shows a disambiguation dropdown in the form.

---

## Progress overview

| Step | What the app gains                                                          |
| ---- | --------------------------------------------------------------------------- |
| 1    | Type-safe foundation, no visible change                                     |
| 2    | `budget_name` is durable across reload and sync                             |
| 3    | Form silently assigns `budget_name` for all new transactions                |
| 4    | All existing transactions have `budget_name`                                |
| 5    | Budget calculation uses `budget_name` exclusively; categories only for form |
| 6    | `budget_name` visible and editable for legacy correction                    |
| 7    | Many-to-many categories; disambiguation dropdown in form                    |

Each step leaves the app fully working.

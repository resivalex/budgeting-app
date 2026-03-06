# Budgets Component

## Architecture

Follows the container/presentational pattern:

- **`BudgetsContainer`** — wires `useBudgetsDomain` and `transactionAggregations` props, manages focused-budget state, delegates all rendering to `Budgets`
- **`Budgets`** — presentational layout: month selector (`react-select`) + list of `Budget` tiles + `BudgetInfoModal` overlay
- **`Budget`** — single budget tile with long-press detection (`use-long-press`) and `BudgetProgressBar`
- **`BudgetProgressBar`** — 4-segment bar (profit / spent / remaining / overdraft) plus an external ratio marker for the current-date expectation line
- **`BudgetInfoModal`** — full detail modal with inline amount/currency editing, expandable category list, and embedded `TransactionsContainer`

## Data Shape

```ts
type BudgetDTO = {
  name: string
  color: string
  currency: string
  amount: number
  categories: string[]
  transactions: TransactionDTO[]
  spentAmount: number
  isEditable: boolean
}
```

All computed budget data comes from `useBudgetsDomain` (see `web/src/hooks/useBudgetsDomain.ts`), which fetches spending limits from the backend and matches transactions client-side.

## Key Design Decisions

- **Long-press to open details**: keeps the tile tap-target clean for future navigation while allowing detail access on mobile
- **Progress bar segments**: normalised against `max(totalAmount, spentAmount, totalAmount - spentAmount)` so all scenarios (profit, on-track, overdraft) render proportionally without exceeding 100%
- **`isEditable` flag on DTO**: only user-defined budgets allow inline editing; auto-generated aggregates (Total / Rest) are read-only

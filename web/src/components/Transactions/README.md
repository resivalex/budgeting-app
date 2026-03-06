# Transactions

## Architecture

Container pattern with a two-level nesting:

```
TransactionsPageContainer   — filtering logic, reads spendingLimitsAtom for budget names
  └── TransactionsPage      — filter UI (collapsible panel, active-filter tags)
        └── TransactionsContainer  — focus/unfocus state, React Router navigation
              └── Transactions     — virtualized list, date-header grouping, modal trigger
                    ├── Transaction/TransactionTile  — individual row rendering
                    └── TransactionInfoModal         — detail view with edit/delete
```

## Key Libraries

- **react-virtualized** (`List` + `AutoSizer`) — renders only visible rows; dynamic row heights are tracked in state and recomputed on change.
- **Jotai** (`spendingLimitsAtom`) — budget name list sourced from global atom in `TransactionsPageContainer`.
- **React Router** — `TransactionsContainer` calls `navigate` to push the edit route.
- **TransactionFilterDomain** — stateless domain class instantiated once per module; handles multi-field filtering with cross-language (English/Russian) matching.

## Component Responsibilities

| Component                   | Responsibility                                                                       |
| --------------------------- | ------------------------------------------------------------------------------------ |
| `TransactionsPageContainer` | Applies `TransactionFilterDomain` filter, supplies `budgetNames` from Jotai          |
| `TransactionsPage`          | Collapsible filter panel, active-filter tag display, local filter state before apply |
| `TransactionsContainer`     | `focusedTransactionId` state, edit navigation                                        |
| `Transactions`              | Virtualized list, date-header memo, row height tracking, modal rendering             |
| `TransactionTile`           | Row layout, long-press detection                                                     |
| `TransactionInfoModal`      | Two-step delete confirmation, Russian locale labels                                  |

## Design Notes

- Date headers are computed with a single `useMemo` pass comparing consecutive transaction dates (converted to locale time via `convertToLocaleTime`).
- Filter inputs have a local draft state inside `TransactionsPage`; values are committed to parent only on "Apply" or reset on "Reset", keeping the list stable while the user types.

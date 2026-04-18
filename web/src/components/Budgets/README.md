# Budgets Component

## Key Design Decisions

- **Long-press to open details**: Keeps the tile tap-target clean for future navigation while allowing detail access on mobile.
- **Progress bar segments**: Normalised so all scenarios (profit, on-track, overdraft) render proportionally — the bar never exceeds 100% regardless of which value is dominant. A 4-segment bar (profit / spent / remaining / overdraft) plus an external ratio marker for the current-date expectation line.
- **`isEditable` flag on DTO**: Only user-defined budgets allow inline editing; auto-generated aggregates (Total / Rest) are read-only.
- **Embedded transactions**: The detail modal embeds `TransactionsContainer` to show all transactions contributing to the budget without navigating away.

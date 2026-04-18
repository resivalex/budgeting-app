# Transactions

## Design Notes

- **Date header memoization**: Date headers are memoized by comparing consecutive transaction dates after locale-time conversion, avoiding re-computation on unrelated state changes.
- **Virtualization**: react-virtualized (`List` + `AutoSizer`) renders only visible rows; dynamic row heights are tracked in state and recomputed on change. Necessary for smooth scrolling with large transaction lists.
- **Filter draft state**: Filter inputs maintain a local draft state inside `TransactionsPage` — the list stays stable while the user edits filter values; changes are committed explicitly via "Apply".

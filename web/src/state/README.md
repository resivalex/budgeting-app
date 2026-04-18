# State Management

Jotai atoms for application-wide reactive state.

## Patterns

- **Base + derived**: Heavy data lives in a raw atom; consumers use a writable wrapper or derived read-only atom. Example: `transactionsAtom` auto-sorts by `datetime` descending on write; `transactionsAggregationsAtom` recomputes aggregations via `TransactionDomain.getAggregations` whenever transactions change.
- **Slice atoms**: Sub-fields of a composite atom (e.g., `categoryExpansionsAtom` and `accountPropertiesAtom` from `configAtom`) are exposed as independent writable atoms that write back to the parent, avoiding prop-drilling without duplicating state.

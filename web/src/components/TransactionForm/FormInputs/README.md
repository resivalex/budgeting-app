# FormInputs

Collection of controlled, stateless presentational input components for the transaction form, all exported from `index.tsx`.

## Accordion Interface

Every component receives `isExpanded` / `onExpand` / `onComplete` props:

- **Collapsed** – renders the current value as a summary; clicking calls `onExpand`.
- **Expanded** – renders the full input; selecting a value calls `onComplete` to advance to the next field.

## Components

| Component              | Input type                                 |
| ---------------------- | ------------------------------------------ |
| `Type`                 | Button group                               |
| `Amount`               | Numeric text field                         |
| `Currency`             | react-select dropdown                      |
| `Account`              | react-select dropdown                      |
| `PayeeTransferAccount` | react-select dropdown                      |
| `Category`             | react-select dropdown                      |
| `BudgetName`           | react-select dropdown                      |
| `Payee`                | Autocomplete text field                    |
| `Comment`              | Free-text field                            |
| `Datetime`             | Date-time picker                           |
| `SaveButton`           | Submit button                              |

## Technology

- `styled-components` for scoped styles including the expand/collapse color transition.
- `react-select` (with `reactSelectSmallStyles` util) for all dropdown inputs.

# FormInputs

Collection of presentational input components for the transaction form. Each component is a controlled, stateless UI element exported from `index.tsx`.

## Common Pattern

Every component receives `isExpanded` / `onExpand` / `onComplete` props to support the step-by-step accordion-style form:

- **Collapsed** – shows the current value as a summary; clicking calls `onExpand`.
- **Expanded** – renders the full input; selecting a value calls `onComplete` to advance to the next field.

## Components

| Component              | Input type                                 | Notes                                                                                    |
| ---------------------- | ------------------------------------------ | ---------------------------------------------------------------------------------------- |
| `Type`                 | Button group (income / expense / transfer) | Auto-focuses on expand                                                                   |
| `Amount`               | Numeric text field                         | Decimal-safe                                                                             |
| `Currency`             | react-select dropdown                      | Driven by account + system currency                                                      |
| `Account`              | react-select dropdown                      | Color-coded options                                                                      |
| `PayeeTransferAccount` | react-select dropdown                      | Excludes selected primary account                                                        |
| `Category`             | react-select dropdown                      | Options ordered by history                                                               |
| `BudgetName`           | react-select dropdown                      | Appends "(без бюджета)" as last option; does not auto-focus when advancing from category |
| `Payee`                | Autocomplete text field                    | Suggestions from transaction history                                                     |
| `Comment`              | Free-text field                            | Optional                                                                                 |
| `Datetime`             | Date-time picker                           | Timezone-aware, locale-formatted                                                         |
| `SaveButton`           | Submit button                              | Disabled until all required fields valid                                                 |

## Technology

- `styled-components` for scoped styles including the expand/collapse color transition.
- `react-select` (with `reactSelectSmallStyles` util) for all dropdown inputs.

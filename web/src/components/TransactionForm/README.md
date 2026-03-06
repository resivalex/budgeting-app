# TransactionForm

Transaction creation and editing module. Exports `TransactionFormContainer` as the public entry point.

## Architecture

```
TransactionFormContainer         ← state management, domain logic, routing
  └── StepByStepTransactionForm  ← presentational, assembles step components
        └── FormLayout           ← step order and visibility by transaction type
              └── FormInputs/    ← individual field input components
```

- **`TransactionFormContainer`**: Owns all form state, initializes from an existing transaction in edit mode (via `:transactionId` URL param), delegates business logic to `useTransactionFormDomain`, and converts between UTC and local time on load/save.
- **`StepByStepTransactionForm`**: Pure presentational component. Wraps each `FormInputs` field in a step adapter and passes them to `FormLayout`.
- **`FormLayout`** (`StepByStepTransactionForm/`): Orchestrates step progression and conditional field visibility based on transaction type (income / expense / transfer).
- **`FormInputs/`**: Individual step components — Type, Currency, Amount, Account, Category, BudgetName, Payee, PayeeTransferAccount, Comment, Datetime, SaveButton.

## Key Patterns

**`LimitedAccountSelect` injection** — the parent passes in an account selector component, keeping account-fetching logic outside this module.

**Budget name auto-resolution** — on category change, `domain.getBudgetNamesForCategory` finds matching budgets. If exactly one matches, it is auto-selected. The dropdown orders matching budgets first, then non-matching, then "(без бюджета)".

**Transfer account swap** — if the user selects the same account for both source and destination, they are automatically swapped to prevent duplicates.

**Edit mode** — when `:transactionId` is present in the URL, the form loads that transaction's data. If the transaction is not found, it redirects to `/`.

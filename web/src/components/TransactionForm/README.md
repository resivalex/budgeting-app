# TransactionForm

Transaction creation and editing module.

## Key Patterns

**UTC/local time conversion** — Datetimes are stored in UTC; `TransactionFormContainer` converts to local time on load and back to UTC on save.

**Account step mapping** — All transaction types use `accountFrom`/`accountTo` directly. The Account step maps to `accountTo` for income, `accountFrom` for expense/transfer. The BudgetName step maps to `bucketFrom` for income, `bucketTo` for expense.

**`LimitedAccountSelect` injection** — The parent passes in an account selector component, keeping account-fetching logic outside this module.

**Mobile fullscreen overlays** — Dropdown and suggestion fields use `FullscreenOverlay` on mobile (≤768px) to render options in a portal-based fullscreen panel, avoiding viewport overflow. The overlay uses the Visual Viewport API (`window.visualViewport`) to resize when the software keyboard opens. Fields requiring explicit confirmation show a floating circular confirm button (FAB). Desktop retains inline `react-select` and `SuggestingInput` components. See [FormInputs README](./FormInputs/README.md) for details.

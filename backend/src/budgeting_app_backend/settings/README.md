# Settings Module

Persistent key-value configuration store backed by CouchDB (`budgeting-settings` database), exposing four typed service classes.

## Architecture

Each service class (`SpendingLimits`, `CategoryExpansions`, `AccountProperties`, `UploadDetails`) accepts a `SettingsProtocol` in its constructor and serializes/deserializes Pydantic models as JSON strings. This keeps the services storage-agnostic and easy to test with a mock.

## SpendingLimits

The most complex service. Stores the full budget config as a single `SpendingLimitsValue` blob and exposes month-scoped read/write helpers (`get_month_budget`, `set_month_budget`, `set_month_budget_item`) that slice/merge into the top-level structure without requiring the caller to understand the full model.

Key Pydantic models: `SpendingLimitsValue`, `SpendingLimit`, `MonthLimit`, `MonthCurrencyConfig`, `MonthSliceSpendingLimitsValue`, `MonthItemSpendingLimitValue`.

## Public API

All value types and service classes are re-exported from `__init__.py`. Import from the package root:

```python
from budgeting_app_backend.settings import SpendingLimits, SpendingLimitsValue, UploadDetails
```

## Dependencies

- `SettingsProtocol` (in `protocols/`) — storage interface implemented by `CouchDbSettings`
- Composed and wired by `State` in `state.py`

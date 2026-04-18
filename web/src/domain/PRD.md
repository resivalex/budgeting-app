# Feature: Domain Services

## Overview

Business logic layer providing domain services for the budgeting application.

## Transaction Type Derivation (Canonical Source)

Each transaction's type is derived from its accounts and buckets:

- **Income**: `account_from` is an external account, `account_to` is internal, and `bucket_to` is `default`.
- **Expense**: `account_to` is an external account, `account_from` is internal, and `bucket_from` is `default`.
- **Transfer**: both accounts are internal and both buckets are `default`.
- **Custom**: all other combinations.

External accounts are identified by `owner === 'external'` in the account's properties document (`cfg:account_properties` in CouchDB).

## Key Business Rules

### Synchronization

The app stays in sync with the remote backend while remaining fully usable offline. If the server data has been reset, the local database is automatically rebuilt from the remote source. A forced refresh can also be triggered on demand (e.g. after a render failure).

### Budget Spending Calculation

Spending is determined purely by `bucket_from`/`bucket_to` fields: `bucket_to` matching a budget increases its spent amount, `bucket_from` matching reduces it. A single transaction can affect two budgets simultaneously (e.g., a transfer between tracked buckets). Unassigned transactions appear in a "Другое" (Other) group.

### Transaction Form

See [TransactionForm PRD](../components/TransactionForm/PRD.md) for form-to-schema mapping rules.

### Transaction Filtering

Text search supports mistyped input via cross-layout (English/Russian keyboard) matching. Account filter matches against both `account_from` and `account_to`; bucket filter matches against both `bucket_from` and `bucket_to`.

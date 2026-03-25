# Feature: Domain Services

## Overview

Business logic layer providing domain services for transactions, synchronization, settings, budgets, forms, filtering, export, and authentication.

## Features

### Transactions

Users can create, view, update, and delete transactions. Transactions are always presented in descending chronological order. The app derives aggregated data from transactions — account balances, available categories, currencies, payees, and comments — to power form suggestions and filtering.

### Synchronization

The app stays in sync with the remote backend while remaining fully usable offline. On reconnect, local data is reconciled with the server. If the server data has been reset (e.g. after a bulk import), the local database is automatically rebuilt from the remote source. A forced refresh can also be triggered on demand (e.g. after a render failure) to fully reset and re-pull all data. The UI reflects online/offline status throughout.

### Settings

Category expansions (human-readable category labels) and account visual properties are stored as documents in the CouchDB/PouchDB database and read directly from the local PouchDB replica.

### Budgets

Users can define monthly spending limits per bucket and track actuals against them. Every transaction is assigned to a bucket; unassigned transactions appear in a "Другое" (Other) group. A "ОБЩИЙ" (Total) budget summarizes spending across all defined buckets. Multi-currency accounts are supported through currency conversion. Budget limits can be updated in-app.

### Transaction Form

The form assists users with smart defaults: category labels are expanded for clarity, the bucket is auto-assigned from the selected category, and payee/comment suggestions are filtered by context. Transfer transactions filter available currencies and accounts appropriately. The form validates input before submission. Internally, the form maps user inputs (type, account, payee, bucket) to the CouchDB schema (`account_from`/`account_to`, `counterparty`, `bucket_from`/`bucket_to`) using external accounts for income/expense transactions.

### Transaction Filtering

Users can filter the transaction list by account, payee, comment, category, and bucket. Text search supports mistyped input due to cross-layout (English/Russian keyboard) matching. Account filter matches against both `account_from` and `account_to` fields.

### Export

Users can export all transactions as a timestamped CSV file downloaded directly in the browser.

### Authentication

Users authenticate with a backend URL and password. The session persists across page reloads. Users can log out, which clears the session and reloads the app.

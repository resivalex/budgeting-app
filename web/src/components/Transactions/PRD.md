# Feature: Transactions

## Overview

Transaction list page where users browse, filter, and manage their financial records.

## User Workflows

### Browsing Transactions

- Transactions are grouped by date with formatted date headers (Russian locale).
- Each row adapts its layout by transaction type:
  - **Income / Expense**: header shows the bucket name (or category if no bucket), followed by the internal account name; counterparty (bold) and category appear smaller below.
  - **Transfer**: header shows source → destination account with an arrow.
  - **Custom**: header shows account_from → account_to with an arrow; bucket_from → bucket_to appear on the next line in grey; category and counterparty appear smaller below.
- Color-coded amounts indicate income (green), expense (red), or custom (purple). Transfers have no color. Signs (+ / −) appear for income and expense only.
- Tapping a row's time area reveals the exact time of the transaction.
- An empty-state message is shown when the list has no records.

### Filtering

- A collapsible search panel lets users filter by account, payee, comment, category, and bucket.
- Filter edits are staged locally; users explicitly commit them via an "Apply" button (which also collapses the panel) or discard them via "Reset".
- Filters support cross-language matching (English/Russian input).
- Account filtering covers both sides of transfer transactions.
- Active filters appear as removable tags below the search bar; all filters can be cleared at once.

### Transaction Operations

- Long-pressing a transaction row opens a detail modal with all transaction fields.
- For income/expense, the modal shows the internal account and bucket. For transfers, it shows both accounts. For custom transactions, it shows account_from/account_to and bucket_from/bucket_to separately.
- From the modal, users can navigate to the edit form or delete the transaction.
- Deletion requires a second confirmation tap to prevent accidental removal.

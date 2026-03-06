# Feature: Transactions

## Overview

Transaction list page where users browse, filter, and manage their financial records.

## User Workflows

### Browsing Transactions

- Transactions are grouped by date with formatted date headers (Russian locale).
- Each row shows category, account, payee, amount, currency; a budget name appears as a colored badge when assigned.
- Color-coded amounts indicate income (green) or expense (red).
- Transfer transactions display source → destination account arrows.
- Tapping a row's time area reveals the exact time of the transaction.
- An empty-state message is shown when the list has no records.

### Filtering

- A collapsible search panel lets users filter by account, payee, comment, category, and budget name.
- Filter edits are staged locally; users explicitly commit them via an "Apply" button (which also collapses the panel) or discard them via "Reset".
- Filters support cross-language matching (English/Russian input).
- Account filtering covers both sides of transfer transactions.
- Active filters appear as removable tags below the search bar; all filters can be cleared at once.

### Transaction Operations

- Long-pressing a transaction row opens a detail modal with all transaction fields.
- From the modal, users can navigate to the edit form or delete the transaction.
- Deletion requires a second confirmation tap to prevent accidental removal.

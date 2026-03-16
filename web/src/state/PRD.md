# Feature: Global Application State

## Overview

Application-wide state that components read and update reactively, covering transactions, sync status, display configuration, and budget limits.

## Features

### Transaction State

- Transactions are always presented newest-first regardless of insertion order.
- Real-time aggregations (accounts, categories, currencies, payees, comments) are available to any component without re-fetching.

### Sync Status

- The UI reflects whether the app is offline, whether a push operation has failed, and whether the initial data load has completed — enabling appropriate loading and error feedback to the user.

### Display Configuration

- Category expansions control how categories are grouped and displayed.
- Per-account color properties allow visual differentiation between accounts.

### Spending Limits

- Monthly budget category limits are accessible globally for budget tracking and reporting.

### Currency Configs

- Per-month currency configurations (main currency and conversion rates) are accessible globally for multi-currency budget calculations.

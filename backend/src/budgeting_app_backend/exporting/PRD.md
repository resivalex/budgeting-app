# Feature: Backend Exporting Module

## Overview

Allows users to download all their transaction data as a CSV file.

## Features

- **Transaction Export**: All transactions exported with a fixed, consistent column set: `datetime`, `account`, `category`, `type`, `amount`, `currency`, `payee`, `comment`, `budget_name`
- **Chronological Ordering**: Exported records are sorted newest first
- **Empty Dataset Handling**: Returns a valid CSV with headers even when there are no transactions

## User Workflows

- **Manual Export**: User triggers `GET /exporting` to download a CSV backup of all transactions
- **Pre-Import Backup**: System automatically exports current data before overwriting the database during an import

## Integration Points

- **[Importing Module](../importing/PRD.md)**: Uses exporting as a pre-import backup step

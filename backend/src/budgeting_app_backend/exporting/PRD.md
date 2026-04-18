# Feature: Backend Exporting Module

## Overview

Allows users to download all their transaction data as a CSV file.

## Requirements

- **Full Column Set**: Exports exactly these fields: `datetime`, `account_from`, `account_to`, `category`, `type`, `amount`, `currency`, `payee`, `comment`, `bucket_from`, `bucket_to`
- **Transaction Types**: Derives one of four types — `income`, `expense`, `transfer`, `custom` — see [Transaction Domain PRD](../../../../web/src/domain/PRD.md) for derivation rules.
- **Account & Bucket Name Resolution**: Replaces all account and bucket IDs with human-readable names
- **Chronological Ordering**: Records sorted newest first
- **Empty Dataset**: Returns a valid CSV with headers even when there are no transactions

## User Workflows

- **Manual Export**: Users can download a full CSV backup of all transactions on demand

# Feature: Backend Exporting Module

## Overview

Allows users to download all their transaction data as a CSV file.

## Requirements

- **Full Column Set**: Exports exactly these fields: `datetime`, `account_from`, `account_to`, `category`, `type`, `amount`, `currency`, `payee`, `comment`, `bucket_from`, `bucket_to`
- **Transaction Types**: Derives one of four types — `income`, `expense`, `transfer`, `custom` — using account membership in the external-accounts set and bucket rules.
- **External Account Detection**: Reads the `external: true` flag from the `cfg:account_properties` CouchDB document to build the set of external account IDs.
- **Chronological Ordering**: Records sorted newest first
- **Empty Dataset**: Returns a valid CSV with headers even when there are no transactions
- **Account & Bucket Name Resolution**: Replaces all account IDs and bucket IDs with human-readable names for both the `_from` and `_to` variants

## User Workflows

- **Manual Export**: Users can download a full CSV backup of all transactions on demand

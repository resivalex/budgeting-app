# Feature: Backend Importing Module

## Overview

CSV-based full-database import that replaces all transaction data with the contents of an uploaded CSV file.

## Features

- **CSV Upload**: User uploads a CSV file to replace all existing transactions
- **Full Replacement**: The entire database is recreated — not merged — eliminating any conflict with prior data
- **Settings Preservation**: Existing settings documents (`cfg:`-prefixed) are extracted before the database is recreated and restored alongside the new transactions
- **Document Conventions**: Imported transactions receive `tx:`-prefixed keys and `kind: "transaction"`
- **Atomic Operation**: All records are committed together; partial imports do not occur

## User Workflow

1. User uploads a CSV file via the import endpoint
2. Settings documents are preserved; all transactions are discarded and replaced with CSV contents
3. Upload timestamp is updated to reflect the new state

## Integration Points

- The upload timestamp is updated after a successful import, triggering sync awareness in connected clients

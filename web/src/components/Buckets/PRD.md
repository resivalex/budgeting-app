# Feature: Buckets (Назначения)

## Overview

Displays all configured buckets with their current balances calculated from transactions, broken down by currency.

## Functionality

- **Bucket List**: Shows all buckets defined in the `cfg:buckets` setting with their name and color
- **Per-Currency Balances**: For each bucket, calculates the net balance per currency based on all transactions where the bucket appears as `bucket_from` (debit) or `bucket_to` (credit)
- **Empty State**: Shows "Нет назначений" when no buckets are configured; shows "Нет транзакций" for buckets with no associated transactions

## Data Flow

- Reads `bucketsAtom` for the list of configured buckets
- Reads `transactionsAtom` for all transactions
- Computes balances by iterating transactions: `bucket_to` adds to balance, `bucket_from` subtracts from balance
- Zero-balance currencies are excluded from display

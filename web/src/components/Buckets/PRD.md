# Feature: Buckets (Назначения)

## Overview

Displays all configured buckets with their current balances calculated from transactions, broken down by account, with currency conversion to a selected main currency.

## Functionality

- **Bucket List**: Shows all buckets defined in the `cfg:buckets` setting with their name and color
- **Per-Account Balances**: For each bucket, calculates the net balance per account based on all transactions where the bucket appears as `bucket_from` (debit) or `bucket_to` (credit). Accounts display their configured name and color dot
- **Main Currency Selector**: Dropdown at top to choose the main currency for total calculations
- **Exchange Rate Display**: Shows latest known conversion rates to the selected main currency, with the date each rate was last updated
- **Total Balance**: Each bucket shows its total balance converted to the main currency, displayed beside the bucket name
- **Empty State**: Shows "Нет назначений" when no buckets are configured; shows "Нет транзакций" for buckets with no associated transactions

## Data Flow

- Reads `bucketsAtom` for the list of configured buckets
- Reads `transactionsAtom` for all transactions
- Reads `currencyConfigsAtom` for monthly exchange rate configurations
- Reads `accountPropertiesAtom` for account names and colors
- Reads `transactionsAggregationsAtom` for the list of available currencies
- Computes balances by iterating transactions: `bucket_to` adds to balance, `bucket_from` subtracts from balance
- Builds exchange rates by iterating month configs from oldest to newest, keeping the most recent rate for each currency
- Zero-balance accounts are excluded from display

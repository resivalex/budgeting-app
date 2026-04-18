# Feature: Global Application State

## Overview

Application-wide reactive state via Jotai atoms covering transactions, sync status, display configuration, and budget limits.

## Key Behaviors

- Transactions are always presented newest-first regardless of insertion order
- Aggregations (accounts, categories, currencies, payees, comments) are derived automatically from the transaction set
- Per-month currency configurations (main currency and conversion rates) are accessible globally for multi-currency calculations

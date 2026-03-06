# Feature: Backend Transactions Module

## Overview

Provides access to stored transaction data and the ability to back up transaction datasets to cloud storage.

## Features

### Transaction Data Retrieval

The system reads all transactions from the database and exposes them via the `GET /transactions` API endpoint. This powers the frontend's transaction list and all downstream features that depend on transaction data (export, budgets, filtering).

### Pre-Import Backup

Before replacing the transaction database with an imported CSV, the system automatically backs up the current dataset to Google Drive. This preserves the previous state and allows recovery if an import produces unexpected results.

## Integration Points

- Transaction reads feed the transactions API endpoint and the CSV export pipeline
- The backup is triggered automatically during CSV import — users do not initiate it manually
- Backup storage depends on Google Drive access configured via service credentials

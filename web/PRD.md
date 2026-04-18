# Feature: Web Frontend

## Overview

Offline-first React PWA providing personal budget tracking, multi-currency support, and real-time sync for comprehensive financial management.

## Core Experience

- **Offline-First**: Full functionality without internet; changes sync automatically on reconnect
- **Real-time Sync**: Bidirectional PouchDB↔CouchDB sync with conflict resolution and database reset detection
- **Render Error Recovery**: Automatic data refresh on UI rendering failure; persistent failures show technical error details

## User Workflows

- **Authentication**: Password-based login with session persistence across reloads
- **Transaction Management**: Step-by-step guided entry with automatic bucket assignment from category; filtering by account/payee/comment/category/bucket with cross-language search (see [Transactions PRD](./src/components/Transactions/PRD.md), [TransactionForm PRD](./src/components/TransactionForm/PRD.md))
- **Budget Tracking**: Monthly budget overview with color-coded progress; spending computed from bucket assignments; "Другое" (Rest) collects unassigned transactions (see [Budgets PRD](./src/components/Budgets/PRD.md))
- **Bucket Balances**: Per-currency balance totals computed from transactions (see [Buckets PRD](./src/components/Buckets/PRD.md))
- **Account Dashboard**: Color-coded account balances overview (see [Home PRD](./src/components/Home/PRD.md))
- **Data Export**: CSV export with timestamped filenames
- **Configuration**: Bucket definitions and spending limits managed locally and synced with remote database

## Component References

- [Domain](./src/domain/PRD.md) — Canonical source for transaction type derivation rules
- [App](./src/components/App/PRD.md) — Authentication and navigation
- [Transactions](./src/components/Transactions/PRD.md) — Transaction list and filtering
- [TransactionForm](./src/components/TransactionForm/PRD.md) — Transaction creation/editing
- [Budgets](./src/components/Budgets/PRD.md) — Budget management
- [Buckets](./src/components/Buckets/PRD.md) — Bucket balances

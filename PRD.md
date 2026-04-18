# Feature: Personal Budgeting Application

## Overview

Offline-first personal finance application with multi-currency support, automated backups, and real-time sync across devices.

## Key Business Rules

- **Transaction Types**: Each transaction is classified as income, expense, transfer, or custom based on account ownership — see [Transaction Domain PRD](./web/src/domain/PRD.md) for derivation rules.
- **Budget Assignment**: Every transaction is assigned a bucket (budget category). The category-to-bucket mapping determines the default assignment, with manual override available.
- **Multi-Currency**: All features support multiple currencies with configurable exchange rates.
- **Offline-First**: Full functionality without internet; bidirectional sync on reconnect with automatic conflict resolution.

## Component References

- **[Web Frontend](./web/PRD.md)**: User interface and offline-first experience
- **[Backend API](./backend/PRD.md)**: Data management, authentication, and cloud integration
- **[Database](./db/PRD.md)**: Transaction storage and synchronization

# Feature: Domain Hooks

## Overview

Hooks expose the following business capabilities to UI components: transaction management, background sync, settings, budgets, and form support.

## Features

### Transaction Management

Users can view, add, edit, and delete transactions with changes reflected in the UI immediately. Transactions are loaded from the local database on startup.

### Background Sync

The app continuously synchronizes with the remote server: pulling new transactions on a regular interval and retrying failed pushes automatically. Sync status (offline, error, in-progress) is surfaced to the UI so users can see connectivity state.

### Settings

User-defined category expansions and account properties are loaded at startup. When the backend is unavailable, previously cached values are used so the UI remains functional offline.

### Budgets

Users can select a month, view spending against per-category limits, and see how far into the month they are. Budget limits can be updated and are persisted to the backend.

### Transaction Form

The form for creating or editing a transaction is pre-populated with available currencies, payees, categories, and comments derived from existing transaction history.

### Colored Accounts

Accounts are displayed with user-assigned colors, allowing quick visual distinction between accounts.

### Mobile Detection

The `useIsMobile` hook provides responsive breakpoint detection, enabling components to render mobile-optimized UIs (such as fullscreen overlays for form field selection) on narrow viewports.

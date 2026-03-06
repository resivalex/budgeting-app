# Feature: App

## Overview

Main application shell providing authentication, navigation, data synchronization, and the primary user interface for the offline-first budgeting application.

## Features

- **Authentication**: Login/logout with credential persistence and automatic session restoration on revisit
- **Offline Support**: Overlay indicator when the backend is unreachable; local data remains accessible
- **Navigation**: Routes between home dashboard, transaction list, budget view, and transaction add/edit forms
- **Transaction Management**: Add, edit, and delete transactions with immediate user feedback via toast notifications
- **Transaction Filtering**: Filter transaction list by account, payee, comment, category, and budget
- **Data Export**: Export all transactions to CSV
- **Status Feedback**: Loading indicator during data sync; app version display in menu

## Navigation

| Path                           | Screen                           |
| ------------------------------ | -------------------------------- |
| `/`                            | Home dashboard                   |
| `/transactions`                | Transaction list                 |
| `/budgets`                     | Budget overview                  |
| `/add`                         | Add transaction form              |
| `/transactions/:transactionId` | Edit transaction form             |

## User Workflows

- **First visit / logged out**: User enters backend URL and password to authenticate
- **Authenticated session**: App restores session automatically; user lands on the home dashboard
- **Adding a transaction**: User navigates to the add form, submits, receives a confirmation notification, and is returned to the transaction list
- **Editing / deleting**: User taps a transaction to open the edit form or removes it directly; notification confirms the action
- **Going offline**: An overlay appears informing the user of lost connectivity; previously loaded data remains visible

## Integration

Depends on sync, transaction, and settings domain hooks — see [hooks PRD](../../hooks/PRD.md).

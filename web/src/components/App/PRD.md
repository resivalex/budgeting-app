# Feature: App

## Overview

Main application shell providing authentication, navigation, data synchronization, and the primary user interface.

## Navigation

| Path                           | Screen                |
| ------------------------------ | --------------------- |
| `/`                            | Home dashboard        |
| `/transactions`                | Transaction list      |
| `/budgets`                     | Budget overview       |
| `/add`                         | Add transaction form  |
| `/transactions/:transactionId` | Edit transaction form |

## User Workflows

- **First visit / logged out**: User enters backend URL and password to authenticate
- **Authenticated session**: App restores session automatically; user lands on the home dashboard
- **Adding a transaction**: User navigates to add form, submits, receives confirmation notification, returns to transaction list
- **Editing / deleting**: User taps a transaction to open edit form or removes it; notification confirms the action
- **Going offline**: Overlay appears indicating lost connectivity; previously loaded data remains visible
- **Render error recovery**: If the UI fails to render, the app automatically pulls fresh data and retries; persistent failures show technical error details

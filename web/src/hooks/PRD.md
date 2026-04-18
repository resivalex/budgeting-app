# Feature: Domain Hooks

## Overview

Hooks expose business capabilities to UI components: transaction management, background sync, settings, budgets, and form support.

## Features

### Background Sync

The app continuously synchronizes with the remote server: pulling on a regular cadence and retrying failed pushes automatically. Only one push runs at a time — concurrent attempts are skipped and the next retry picks up pending changes. Sync status (offline, error, in-progress) is surfaced to the UI. A force-refresh capability allows the error boundary to trigger a full database reset and re-pull when rendering fails.

### Transaction Form

Form options (currencies, payees, categories, comments) are derived from existing transaction history for autocomplete suggestions.

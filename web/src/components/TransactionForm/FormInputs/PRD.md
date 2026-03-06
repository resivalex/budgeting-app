# Feature: Transaction Form Input Components

## Overview

Specialized input fields for entering a transaction, designed around a guided step-by-step flow where the user progresses through fields one at a time.

## User Workflow

The form walks the user through each required field in sequence. Each field can be collapsed (shows current value) or expanded (ready for input). Selecting a value automatically advances to the next field.

## Fields and Business Rules

- **Type**: Choose between income, expense, or transfer. Auto-focuses when expanded.
- **Amount**: Enter the transaction amount; supports decimal values.
- **Currency**: Select the currency; driven by the selected account and system currency settings.
- **Account**: Choose the account; options are color-coded by account.
- **Transfer Account**: For transfers, select the destination account (excludes the source account).
- **Category**: Pick a spending category; options are ordered by previous usage.
- **Budget Name**: Link the transaction to a named budget. Auto-filled when a category with a matching budget is selected; budgets matching the current category appear first. Defaults to no budget ("без бюджета").
- **Payee**: Enter or pick the payee; suggestions come from previous transactions.
- **Comment**: Optional free-text note.
- **Date/Time**: Set when the transaction occurred, with timezone and locale support.
- **Save**: Confirms the transaction; inactive until all required fields are filled.

# Feature: Transaction Form

## Overview

Step-by-step transaction creation and editing interface with intelligent defaults, validation, and bucket assignment.

## Step-by-Step Workflow

The form guides users through fields one at a time. See [FormInputs PRD](./FormInputs/PRD.md) for individual field behavior and mobile experience.

## Transaction Type Rules

Supports income, expense, transfer, and custom types. For transaction type derivation rules, see [Domain PRD](../../domain/PRD.md).

- **Custom transactions**: Allow free selection of both account_from/account_to and bucket_from/bucket_to from all accounts (including external); account lists are filtered by selected currency. Custom amounts display in purple.
- **Custom and transfer**: Origin and destination accounts are independent and may be equal.

## Field Visibility by Type

- **Income/Expense**: Account, Category, BudgetName, Payee, Comment
- **Transfer**: Account (source), Account (destination), Category
- **Custom**: Account From, Account To, Bucket From, Bucket To, Category, Payee, Comment

## Smart Initialization & Defaults

- Edit mode: pre-fills all fields from the existing transaction; navigating to an invalid transaction ID redirects to home
- Bucket auto-assigned from selected category
- Budget-first flow: after account selection, user picks budget before category
- Budget-aware category ordering: categories belonging to the selected budget appear first
- Bucket dropdown: matching buckets first, then non-matching, default bucket always last
- Payee/comment suggestions filtered by context from transaction history

## Value Preservation on Type Switch

Switching transaction type preserves the primary account and active bucket while resetting hidden fields:
- Primary account maps to `accountTo` for income, `accountFrom` for expense/transfer — if the new primary field is empty, the value moves from the old primary
- Active bucket moves between `bucketFrom` (income) and `bucketTo` (expense) on income↔expense switches
- Hidden account fields reset to `''`, hidden bucket fields reset to `'default'`

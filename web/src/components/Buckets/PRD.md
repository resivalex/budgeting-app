# Feature: Buckets (Назначения)

## Overview

Displays all configured buckets with their current balances calculated from transactions, broken down by account, with currency conversion to a selected main currency.

## Calculation Rules

Balance per bucket per account: `bucket_to` adds to balance, `bucket_from` subtracts — consistent with [Domain PRD](../../domain/PRD.md) spending rules. Zero-balance accounts are excluded from display. Exchange rates are built by iterating month configs from oldest to newest, keeping the most recent rate for each currency. Total balance per bucket is converted to the user-selected main currency.

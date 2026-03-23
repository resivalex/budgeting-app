# Feature: Transaction Form Input Components

## Overview

Specialized input fields for entering a transaction, designed around a guided step-by-step flow where the user progresses through fields one at a time.

## User Workflow

The form walks the user through each required field in sequence. Each field can be collapsed (shows current value) or expanded (ready for input). Selecting a value automatically advances to the next field.

### Mobile Experience

On mobile devices (≤768px), dropdown and suggestion fields open as fullscreen overlays instead of inline dropdowns. This ensures all options are visible without being clipped below the viewport or hidden behind the virtual keyboard. The overlay dynamically adjusts its size to the visible viewport when the software keyboard opens. Users can dismiss the overlay via a back button to return to the form without selecting. Fields that require explicit confirmation (free-text inputs and fields without auto-close on selection) display a floating confirm button at the bottom-right corner of the overlay for easy one-handed access.

## Fields and Business Rules

- **Type**: Choose between income, expense, or transfer. Auto-focuses when expanded.
- **Amount**: Enter the transaction amount; supports decimal values.
- **Currency**: Select the currency; driven by the selected account and system currency settings.
- **Account**: Choose the account; options are color-coded by account. On mobile, the fullscreen overlay shows all account options with colored backgrounds.
- **Transfer Account**: For transfers, select the destination account (excludes the source account).
- **Category**: Pick a spending category; options are ordered by previous usage. On mobile, the fullscreen overlay includes a search input for filtering. The currently selected category is pinned to the top of the list when no search is active. A floating confirm button allows closing without changing the selection.
- **Bucket**: Link the transaction to a bucket. Auto-filled when a category with a matching bucket is selected; buckets matching the current category appear first, with the default bucket always last. On mobile, searchable fullscreen overlay with a floating confirm button to keep the current value.
- **Payee**: Enter or pick the payee; suggestions come from previous transactions. On mobile, fullscreen overlay with text input and suggestion list, plus a floating confirm button to submit the typed value.
- **Comment**: Optional free-text note. On mobile, same fullscreen overlay pattern as Payee with a floating confirm button.
- **Date/Time**: Set when the transaction occurred, with timezone and locale support.
- **Save**: Confirms the transaction; inactive until all required fields are filled.

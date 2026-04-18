# Feature: Transaction Form Input Components

## Overview

Specialized input fields for entering a transaction, designed around a guided step-by-step flow where the user progresses through fields one at a time.

## User Workflow

Each field can be collapsed (shows current value) or expanded (ready for input). Selecting a value automatically advances to the next field.

### Mobile Experience

On mobile (≤768px), dropdown and suggestion fields open as fullscreen overlays instead of inline dropdowns. The overlay dynamically adjusts to the visible viewport when the software keyboard opens. Users can dismiss via back button without selecting. Fields requiring explicit confirmation (free-text inputs and fields without auto-close) display a floating confirm button at the bottom-right.

## Field Business Rules

- **Category**: Options ordered by previous usage. Selected category pinned to top when no search is active. On mobile, searchable fullscreen overlay with confirm button.
- **Bucket**: Auto-filled when a category with a matching bucket is selected. Matching buckets appear first, default bucket always last. On mobile, searchable overlay with confirm button.
- **Payee**: Suggestions from previous transactions. On mobile, fullscreen overlay with text input and suggestion list plus confirm button.
- **Comment**: Optional free-text. Same fullscreen overlay pattern as Payee.
- **Account**: Options color-coded by account. On mobile, fullscreen overlay with colored backgrounds.
- **Transfer Account**: Excludes the source account from options.
- **Save**: Inactive until all required fields are valid.

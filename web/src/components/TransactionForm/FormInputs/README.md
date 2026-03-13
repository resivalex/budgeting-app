# FormInputs

Collection of controlled, stateless presentational input components for the transaction form, all exported from `index.tsx`.

## Accordion Interface

Every component receives `isExpanded` / `onExpand` / `onComplete` / `onCollapse` props:

- **Collapsed** – renders the current value as a summary; clicking calls `onExpand`.
- **Expanded** – renders the full input; selecting a value calls `onComplete` to advance to the next field.
- **Collapse** – on mobile overlay, the back button calls `onCollapse` to dismiss without selecting.

## Mobile Fullscreen Overlay

Dropdown and suggestion fields (Account, PayeeTransferAccount, Category, BudgetName, Payee, Comment) render a fullscreen overlay on mobile (`≤768px` viewport) via `FullscreenOverlay` + `useIsMobile` hook. The overlay replaces the inline dropdown with a full-screen option list, keeping all options visible above the virtual keyboard. On desktop, the existing `react-select` and `SuggestingInput` components are preserved.

The overlay tracks `window.visualViewport` to resize and reposition when the software keyboard opens, so content is never hidden beneath it.

Fields that allow free-text input (Payee, Comment) and fields without auto-close on selection (Category, BudgetName) show a floating circular confirm button (FAB) at the bottom-right corner of the overlay. Tapping it confirms the current value and closes the overlay.

## Components

| Component              | Input type              | Mobile overlay |
| ---------------------- | ----------------------- | -------------- |
| `Type`                 | Button group            | No             |
| `Amount`               | Numeric text field      | No             |
| `Currency`             | Button group            | No             |
| `Account`              | react-select dropdown   | Yes            |
| `PayeeTransferAccount` | react-select dropdown   | Yes            |
| `Category`             | react-select dropdown   | Yes            |
| `BudgetName`           | react-select dropdown   | Yes            |
| `Payee`                | Autocomplete text field | Yes            |
| `Comment`              | Free-text field         | Yes            |
| `Datetime`             | Date-time picker        | No             |
| `SaveButton`           | Submit button           | No             |

## Technology

- `styled-components` for scoped styles including the expand/collapse color transition.
- `react-select` (with `reactSelectSmallStyles` util) for dropdown inputs on desktop.
- `FullscreenOverlay` component with `useIsMobile` hook for mobile-optimized field selection.
- Visual Viewport API (`window.visualViewport`) inside `FullscreenOverlay` for keyboard-safe positioning.

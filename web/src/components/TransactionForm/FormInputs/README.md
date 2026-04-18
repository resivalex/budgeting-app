# FormInputs

Controlled, stateless presentational input components for the transaction form.

## Accordion State Management

Every component receives `isExpanded` / `onExpand` / `onComplete` / `onCollapse` props:

- **Collapsed** – renders the current value as a summary; clicking calls `onExpand`.
- **Expanded** – renders the full input; selecting a value calls `onComplete` to advance to the next field.
- **Collapse** – on mobile overlay, the back button calls `onCollapse` to dismiss without selecting.

## Mobile Fullscreen Overlay

Dropdown and suggestion fields render a fullscreen overlay on mobile (≤768px) via `FullscreenOverlay` + `useIsMobile` hook. The overlay replaces inline dropdowns with a full-screen option list, keeping all options visible above the virtual keyboard.

**Why Visual Viewport API**: The overlay tracks `window.visualViewport` to resize and reposition when the software keyboard opens, so content is never hidden beneath it. Standard CSS viewport units don't account for the keyboard.

**Floating confirm button (FAB)**: Fields that allow free-text input (Payee, Comment) and fields without auto-close on selection (Category, BudgetName) show a floating circular confirm button at the bottom-right corner. Desktop retains inline `react-select` and `SuggestingInput`.

## Technology

- `styled-components` for scoped styles including expand/collapse color transition
- `react-select` (with `reactSelectSmallStyles` util) for dropdown inputs on desktop

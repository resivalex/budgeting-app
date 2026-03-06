# Home

Dashboard component displaying account balances.

## Architecture

Follows the container/presentational pattern:

- **`HomeContainer.tsx`** — fetches colored account data via `useColoredAccounts` hook and maps it to props
- **`Home.tsx`** — stateless presentational component rendering account cards

## Data Flow

`useColoredAccounts` → `HomeContainer` → `Home`

The hook provides each account with `account`, `currency`, `balance`, and `color` fields. The container reshapes this into the `Account` interface expected by the presentational component.

## Rendering

Uses Bulma CSS (`box`, `columns is-mobile`) for layout. Currency codes are converted to symbols via `convertCurrencyCodeToSymbol` and balances formatted via `formatFinancialAmount` from `@/utils`.

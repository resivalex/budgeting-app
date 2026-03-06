# Home

Dashboard component displaying account balances.

## Architecture

Follows the container/presentational pattern:

- **`HomeContainer.tsx`** — fetches colored account data via `useColoredAccounts` hook and maps it to props
- **`Home.tsx`** — stateless presentational component rendering account cards

## Data Flow

`useColoredAccounts` → `HomeContainer` → `Home`

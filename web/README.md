# Budgeting App Web 💰

React frontend for personal budgeting and expense tracking. Built as a PWA for offline use.

## Features 🌟

- Budget management with visual reporting
- Expense tracking
- Responsive UI with Bulma CSS
- Offline mode
- Data import/export (CSV)

## Setup 🚀

### Local Development

```shell
cd web
yarn install
cp .env.example .env
yarn start
```

### Docker Development

```shell
cd web
cp .env.example .env
docker-compose -f docker-compose.dev.yml up
```

## Production 🏗️

```shell
docker-compose up
```

## Development 💻

- React 19 + TypeScript
- Contribution: Create a branch, make changes, and submit a PR

## License 📝

[MIT License](LICENSE)

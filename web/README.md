# Welcome to the Budgeting App! 💰

The Budgeting App is your friendly companion for handling finances. This user-friendly application built with React allows you to manage your budget and track your expenses easily.

## What's Inside? 📦
- [What's this App all About?](#about-)
- [What can this App do?](#features-)
- [How do I Get Started?](#getting-started-)
- [How to Use?](#usage-)
- [Who can Help?](#contribute-)
- [What about the Legal Stuff?](#license-)

## About 🤔

The Budgeting App is all about simplifying your financial management. Built with React 19 and TypeScript, it provides an easy-to-use interface that lets you view and manage your budgets, keep an eye on your spending, and perform various financial operations. The app is designed as a Progressive Web App (PWA), so it works offline and provides a mobile-friendly experience!

## Features 🌟

Here's what the Budgeting App can do for you:

1. **Budget Management**: Organize your income and expenses into customizable budgets with visual reporting.
2. **Expense Tracking**: Add, edit, or remove expenses to track your spending.
3. **Responsive UI**: Built with Bulma CSS framework for a clean, mobile-friendly interface.
4. **Offline Mode**: Continue managing your transactions even without internet connectivity.
5. **Data Import/Export**: Transfer data using CSV files for backup or migration.

## Getting Started 🚀

Follow these simple steps to get the Budgeting App running on your computer:

### Local Development

1. Navigate to the web directory: `cd web`
2. Install what's necessary: `yarn install`
3. Create an `.env` file based on `.env.example`: `cp .env.example .env`

### Docker Development

1. Navigate to the web directory: `cd web`
2. Create an `.env` file based on `.env.example`: `cp .env.example .env`
3. Start the Docker container for development: `docker-compose -f docker-compose.dev.yml up`

## Usage 👨‍💻

### Running Locally

To start the app in development mode, type the following command:

```shell
yarn start
```

This will get the app running in your default browser. If it doesn't open automatically, just click [here](http://localhost:3000).

### Running with Docker

#### Development Mode

```shell
docker-compose -f docker-compose.dev.yml up
```

This will start a development container with hot-reloading enabled.

#### Production Mode

```shell
docker-compose up
```

This will build and serve the production-ready application.

## Contribute 👥

Want to contribute to the Budgeting App frontend? Great! Here's how you can:

1. Clone the monorepo and navigate to the web directory: `cd web`
2. Create a new branch: `git checkout -b my-new-branch`
3. Make your changes and commit them: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-branch`
5. Send a pull request.

Remember to stick to the existing code style and include tests if necessary.

## License 📝

The Budgeting App is free and open-source, thanks to the [MIT License](LICENSE).

---

We hope you enjoy using the Budgeting App! Explore the source code and dive into each component and module to understand more about its functionality. Got questions? Need help? Feel free to ask. Happy budgeting! 💸🎉

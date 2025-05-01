# Budgeting App Monorepo

Personal finance management tool designed to help track income, expenses, and manage budgets with automated backup capabilities.

## Components

This monorepo contains the following core components:

*   **Backend (`backend/`)**: [FastAPI](https://fastapi.tiangolo.com/) (Python) API using [Poetry](https://python-poetry.org/) and [Alembic](https://alembic.sqlalchemy.org/en/latest/) for migrations. Features include:
    * Transaction management and CSV import/export
    * Budget tracking and spending limits
    * Automated daily backups to Google Drive
    * See [`backend/README.md`](backend/README.md) for details.

*   **Database (`db/`)**: [CouchDB](https://couchdb.apache.org/) instance managed via [Docker Compose](https://docs.docker.com/compose/) for transaction data storage. See [`db/README.md`](db/README.md) for configuration.

*   **Frontend (`web/`)**: [React 19](https://reactjs.org/) Progressive Web App (PWA) using [TypeScript](https://www.typescriptlang.org/) and [Yarn](https://yarnpkg.com/). Features include:
    * Responsive UI with Bulma CSS framework
    * Offline mode functionality
    * Budget management and visualization
    * Transaction tracking and filtering
    * See [`web/README.md`](web/README.md) for usage.

## Getting Started

1.  **Prerequisites**: Ensure you have [Git](https://git-scm.com/), [Docker](https://www.docker.com/), [Poetry](https://python-poetry.org/), and [Node.js](https://nodejs.org/) (with [Yarn](https://yarnpkg.com/)) installed.

2.  **Clone the repository:**
    ```bash
    git clone <repository-url> # Replace <repository-url> with the actual URL
    cd budgeting-app
    ```

3.  **Set up & Run Components:** 

    * **Database Setup:**
      ```bash
      cd db
      cp .env.example .env  # Edit with your credentials
      docker-compose up -d
      # Access CouchDB at http://localhost:9002
      cd ..
      ```

    * **Backend Setup:**
      ```bash
      cd backend
      cp .env.example .env  # Configure settings
      poetry install
      poetry run alembic upgrade head
      poetry run uvicorn main:app --reload
      # API docs available at http://localhost:8000/api
      cd ..
      ```

    * **Frontend Setup:**
      ```bash
      cd web
      cp .env.example .env  # Configure settings if needed
      yarn install
      yarn start
      # Access the app at http://localhost:3000
      ```

## Key Features

* **Budget Management**: Create and manage budgets with customizable categories and spending limits
* **Transaction Tracking**: Record and categorize income and expenses
* **Data Visualization**: Monitor spending patterns and budget performance
* **Offline Support**: Continue using the app without internet connectivity
* **Automated Backups**: Daily transaction data backups to Google Drive
* **Data Import/Export**: CSV import and export capabilities

## License

This project is licensed under the [MIT License](LICENSE).

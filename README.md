# Budgeting App Monorepo

Your personal finance companion for tracking income, expenses, and managing budgets, with automated backups! ✨

## Components

This monorepo houses:

*   **⚙️ Backend (`backend/`)**: A [FastAPI](https://fastapi.tiangolo.com/) (Python) API using [Poetry](https://python-poetry.org/) & [Alembic](https://alembic.sqlalchemy.org/en/latest/).
    *   Manages transactions (including CSV import/export).
    *   Tracks budgets and spending limits.
    *   Handles automated daily Google Drive backups.
    *   ➡️ See [`backend/README.md`](backend/README.md) for details.

*   **💾 Database (`db/`)**: A [CouchDB](https://couchdb.apache.org/) instance managed via [Docker Compose](https://docs.docker.com/compose/).
    *   Stores all transaction data.
    *   ➡️ See [`db/README.md`](db/README.md) for configuration.

*   **🖥️ Frontend (`web/`)**: A [React 19](https://reactjs.org/) PWA using [TypeScript](https://www.typescriptlang.org/) & [Yarn](https://yarnpkg.com/).
    *   Responsive UI with Bulma.
    *   Offline mode capable.
    *   Manages budgets, visualization, and transactions.
    *   ➡️ See [`web/README.md`](web/README.md) for usage.

## 🚀 Getting Started

1.  **✅ Prerequisites**: Ensure [Git](https://git-scm.com/), [Docker](https://www.docker.com/), [Poetry](https://python-poetry.org/), and [Node.js](https://nodejs.org/) (with [Yarn](https://yarnpkg.com/)) are installed.

2.  **📥 Clone the repo:**
    ```bash
    git clone <repository-url> # Replace <repository-url> with the actual URL
    cd budgeting-app
    ```

3.  **🛠️ Set up & Run Components:**

    *   **Database (CouchDB):**
        ```bash
        cd db
        cp .env.example .env  # Edit with your credentials
        docker-compose up -d
        # Access CouchDB at http://localhost:9002
        cd ..
        ```

    *   **Backend (FastAPI):**
        ```bash
        cd backend
        cp .env.example .env  # Configure settings
        poetry install
        poetry run alembic upgrade head
        poetry run uvicorn main:app --reload
        # API docs available at http://localhost:8000/api
        cd ..
        ```

    *   **Frontend (React PWA):**
        ```bash
        cd web
        cp .env.example .env  # Configure settings if needed
        yarn install
        yarn start
        # Access the app at http://localhost:3000
        ```

## ✨ Key Features

*   💰 **Budget Management**: Create budgets with custom categories & limits.
*   📊 **Transaction Tracking**: Record and categorize income/expenses.
*   📈 **Data Visualization**: Monitor spending and budget performance.
*   📶 **Offline Support**: Use the app even without internet.
*   💾 **Automated Backups**: Daily Google Drive backups for peace of mind.
*   ↔️ **Data Import/Export**: Easily import/export data via CSV.

## 📜 License

This project is licensed under the [MIT License](LICENSE).

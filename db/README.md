# 📊 Budgeting App Database Setup

Welcome to the database setup for the Budgeting App! Our app is designed to help you manage your finances by keeping track of your expenses and income. This guide will walk you through the process of setting up a CouchDB database using Docker, which our app relies on to store and manage data.

## 📚 Prerequisites

Before we begin, please make sure you have the following software installed:

- [Docker](https://www.docker.com/get-started) - Our app uses Docker to run the database in an isolated environment, ensuring it works the same way on every machine.

## 🚀 Getting Started

Ready to get started? Great! Just follow these steps:

1. Navigate to the database directory of the budgeting app:

   ```shell
   cd db
   ```

2. Create an `.env` file in the project directory by copying the example file:

   ```shell
   cp .env.example .env
   ```

   Then edit the file to customize your settings:

   ```plaintext
   COUCHDB_USER=admin
   COUCHDB_PASSWORD=password
   PORT=9002
   ```

   **Note:** Be sure to replace the values in the example with your own for security!

3. Have a look at the `docker-compose.yml` file. This is the recipe Docker follows to build our app. By default, it uses the `couchdb` image.

4. For development, we use the `docker-compose.dev.yml` file which exposes port `9002`. Time to start the app! Just run:

   ```shell
   docker-compose -f docker-compose.dev.yml up -d
   ```

   This will start the CouchDB service in the background.

5. Once the app is up and running, you can access it at [http://localhost:9002](http://localhost:9002). Give yourself a pat on the back - you did it!

## ⚙️ Configuration

The `docker-compose.yml` file lets you tweak a few things:

- `image`: This is the Docker image we use for the CouchDB service. By default, it's `couchdb`.
- `container_name`: This sets the name for our CouchDB container. By default, it's `budgeting_app_couchdb`.
- `env_file`: This is the path to the `.env` file that holds the settings our app needs.
- `volumes`: This tells Docker to link the `./data` directory in our project to the CouchDB container, giving us persistent data storage.
- `ports`: (In the dev file) This maps the host port `9002` to the CouchDB container port `5984`, making the database accessible at `http://localhost:9002`.

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
   COUCHDB_PASSWORD=your_secure_password
   
   # CORS configuration
   COUCHDB_CORS_ORIGINS=*
   COUCHDB_CORS_CREDENTIALS=true
   COUCHDB_CORS_METHODS=GET,PUT,POST,HEAD,DELETE,OPTIONS
   COUCHDB_CORS_HEADERS=accept,authorization,content-type,origin,referer,x-csrf-token
   PORT=9002
   ```

   **Note:** Be sure to replace the values in the example with your own for security!

3. Have a look at the Docker Compose files:
   - `docker-compose.yml` - For production deployment
   - `docker-compose.dev.yml` - For development, which exposes port `9002`

4. For development, use the development configuration which exposes port `9002`:

   ```shell
   # Start CouchDB with development configuration
   # CORS settings will be applied automatically on startup.
   docker-compose -f docker-compose.dev.yml up -d
   ```
   
   For production:
   
   ```shell
   # Start CouchDB with production configuration
   # CORS settings will be applied automatically on startup.
   docker-compose up -d
   ```

5. Once the app is up and running, you can access it at [http://localhost:9002](http://localhost:9002). Give yourself a pat on the back - you did it!

6. You can manage the container using standard Docker commands:

   ```shell
   # Stop the container
   docker-compose -f docker-compose.dev.yml down
   
   # View container logs (useful for seeing CORS setup messages)
   docker logs budgeting_app_couchdb__dev  # For development environment
   # or
   docker logs budgeting_app_couchdb       # For production environment
   
   # Restart the container (CORS will be reconfigured automatically)
   docker-compose -f docker-compose.dev.yml restart
   ```

## ⚙️ Configuration

We have multiple Docker Compose files that let you configure the database:

- `docker-compose.base.yml` - Contains the base configuration shared by both development and production
- `docker-compose.dev.yml` - Development configuration with port 9002 exposed
- `docker-compose.yml` - Production configuration without exposed ports for better security

The Docker Compose files let you tweak a few things:

- `image`: This is the Docker image we use for the CouchDB service. By default, it's `couchdb`.
- `container_name`: This sets the name for our CouchDB container. For development, it's `budgeting_app_couchdb__dev` and for production, it's `budgeting_app_couchdb`.
- `env_file`: This is the path to the `.env` file that holds the settings our app needs.
- `volumes`: This tells Docker to link the `./data` directory in our project to the CouchDB container, giving us persistent data storage. It also mounts our custom startup script and initialization directory.
- `ports`: (In dev configuration) This maps the host port `9002` to the CouchDB container port `5984`, making the database accessible at `http://localhost:9002`.
- `networks`: Uses an external network called `web` for both development and production environments.

## 🌐 CORS Configuration

Cross-Origin Resource Sharing (CORS) is essential for allowing our web application to communicate with the CouchDB server when they're hosted on different domains or ports.

Our Docker Compose setup automatically configures CORS settings every time the container starts using a custom startup script (`start-and-configure.sh`). It does this by:
1. Starting the main CouchDB process.
2. Waiting until the CouchDB API is responsive.
3. Applying the necessary CORS configuration settings via the CouchDB HTTP API using `curl`.

This ensures that CORS is correctly configured after every startup or restart, using the settings defined in your `.env` file (or defaults if not set).

The CORS settings are configured with these parameters:

- **Origins:** `*` (allows requests from any origin, can be restricted to specific domains)
- **Credentials:** `true` (allows credentials like cookies to be sent with requests)
- **Methods:** `GET,PUT,POST,HEAD,DELETE,OPTIONS` (HTTP methods allowed)
- **Headers:** `accept,authorization,content-type,origin,referer,x-csrf-token` (request headers allowed)

To verify CORS is configured correctly, you can run:

```shell
curl -i -X OPTIONS -H "Origin: http://localhost:3000" http://localhost:9002/
```

You should see `Access-Control-Allow-Origin` and other CORS headers in the response.

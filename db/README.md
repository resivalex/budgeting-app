# 📊 Budgeting App Database Setup

This guide will help you set up the CouchDB database for the Budgeting App using Docker.

## 📚 Prerequisites

- [Docker](https://www.docker.com/get-started)

## 🚀 Getting Started

1. Navigate to the database directory:

   ```shell
   cd db
   ```

2. Create an `.env` file:

   ```shell
   cp .env.example .env
   ```

   Edit with your settings:

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

3. Start the container:

   ```shell
   # Development
   docker-compose -f docker-compose.dev.yml up -d
   
   # Production
   docker-compose up -d
   ```

4. Access CouchDB at [http://localhost:9002](http://localhost:9002)

## ⚙️ Configuration

- `docker-compose.base.yml` - Base configuration
- `docker-compose.dev.yml` - Development config (port 9002 exposed)
- `docker-compose.yml` - Production config (no exposed ports)

## 🌐 CORS Configuration

CORS is configured automatically through the `start-and-configure.sh` script with settings from your `.env` file.

To verify CORS configuration:

```shell
curl -i -X OPTIONS -H "Origin: http://localhost:3000" http://localhost:9002/
```

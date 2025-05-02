#!/bin/sh
set -e

# Start the original CouchDB entrypoint in the background
# Pass any arguments received by this script ($@) to the entrypoint
/docker-entrypoint.sh /opt/couchdb/bin/couchdb "$@" & 

# Capture the Process ID (PID) of the background CouchDB process
PID=$!
echo "CouchDB started in background (PID: $PID)"

# Wait for CouchDB API to become available
echo "Waiting for CouchDB API to be ready..."
until curl -s --head http://localhost:5984/ > /dev/null 2>&1; do
  echo "Waiting for CouchDB..." && sleep 2;
done
echo "CouchDB API ready."

# Configure CORS using environment variables
echo "Configuring CORS via API..."

# Use environment variables provided to the container (no need for $$)
ORIGINS="${COUCHDB_CORS_ORIGINS:-*}"
CREDENTIALS="${COUCHDB_CORS_CREDENTIALS:-true}"
METHODS="${COUCHDB_CORS_METHODS:-GET, PUT, POST, HEAD, DELETE, OPTIONS}"
HEADERS="${COUCHDB_CORS_HEADERS:-accept, authorization, content-type, origin, referer, x-csrf-token}"

# Apply settings using curl
curl -s -X PUT "http://${COUCHDB_USER}:${COUCHDB_PASSWORD}@localhost:5984/_node/nonode@nohost/_config/httpd/enable_cors" -d '"true"' -H "Content-Type: application/json"
curl -s -X PUT "http://${COUCHDB_USER}:${COUCHDB_PASSWORD}@localhost:5984/_node/nonode@nohost/_config/cors/origins" -d "\"${ORIGINS}\"" -H "Content-Type: application/json"
curl -s -X PUT "http://${COUCHDB_USER}:${COUCHDB_PASSWORD}@localhost:5984/_node/nonode@nohost/_config/cors/credentials" -d "\"${CREDENTIALS}\"" -H "Content-Type: application/json"
curl -s -X PUT "http://${COUCHDB_USER}:${COUCHDB_PASSWORD}@localhost:5984/_node/nonode@nohost/_config/cors/methods" -d "\"${METHODS}\"" -H "Content-Type: application/json"
curl -s -X PUT "http://${COUCHDB_USER}:${COUCHDB_PASSWORD}@localhost:5984/_node/nonode@nohost/_config/cors/headers" -d "\"${HEADERS}\"" -H "Content-Type: application/json"

echo "CORS configured successfully via wrapper script!"

# Bring the background CouchDB process back to the foreground
# This makes the script wait for CouchDB to exit, keeping the container running
echo "Waiting for CouchDB process (PID: $PID) to exit..."
wait $PID

#!/bin/bash

export DB_HOST=localhost
export DB_PORT=6000
export DB_USER=test
export DB_NAME=test

# Set the following to enable retries with a delay between them
MAX_RETRIES=10
RETRY_DELAY=5

docker-compose up -d

# Wait for the database to be ready
RETRIES=0
until nc -z "$DB_HOST" "$DB_PORT" || [ $RETRIES -eq $MAX_RETRIES ]; do
  retries=$((retries + 1))
  echo "Waiting for PostgreSQL service to be up..."
  sleep $RETRY_DELAY
done

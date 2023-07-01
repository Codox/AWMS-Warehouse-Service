#!/bin/bash

export DB_HOST=localhost
export DB_PORT=6000
export DB_USER=test
export DB_NAME=test
export DB_PASS=test

# Set the following to enable retries with a delay between them
MAX_RETRIES=10
RETRY_DELAY=5

docker-compose up -d

# Wait for the database to be ready
RETRIES=0
until nc -z "$DB_HOST" "$DB_PORT" || [ $RETRIES -eq $MAX_RETRIES ]; do
  RETRIES=$((RETRIES + 1))
  echo "Waiting for PostgreSQL service to be up..."
  sleep $RETRY_DELAY
done

# Check if the PostgreSQL service is up
if nc -z "$DB_HOST" "$DB_PORT"; then
  echo "PostgreSQL service is running on port $DB_PORT"
else
  echo "PostgreSQL service is not running on port $DB_PORT"
  exit 1
fi

# CD to main code directory
cd ../..

# Run migrations
npm run migrate:run

# Run the tests
./node_modules/.bin/jest --maxWorkers=50% --config jest-e2e.json

# Move back to E2E tests directory
cd test/e2e

# Tear down the containers
docker-compose down

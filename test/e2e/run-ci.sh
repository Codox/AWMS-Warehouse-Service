#!/bin/bash

export DB_HOST=postgres
export DB_PORT=5432
export DB_USER=test
export DB_NAME=test
export DB_PASS=test

# CD to main code directory
cd ../..

# Run migrations
npm run migrate:run

# Run the tests
./node_modules/.bin/jest --maxWorkers=50% --config jest-e2e.json

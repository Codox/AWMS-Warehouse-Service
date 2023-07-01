#!/bin/bash

# CD to main code directory
cd ../..

# Run migrations
npm run migrate:run

# Run the tests
./node_modules/.bin/jest --maxWorkers=50% --config jest-e2e.json

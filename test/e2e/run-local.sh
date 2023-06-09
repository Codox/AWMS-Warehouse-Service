#!/bin/bash
export DB_HOST=localhost
export DB_PORT=6000
export DB_USER=test
export DB_NAME=test
export DB_PASS=test

# Local information for Keycloak as this command will be ran in the container itself
export KEYCLOAK_HOST=localhost
export KEYCLOAK_INTERNAL_PORT=8080
export KEYCLOAK_EXTERNAL_PORT=6080

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

# Function to make an HTTP request and check the response status
check_keycloak_status() {
  RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "http://$KEYCLOAK_HOST:$KEYCLOAK_EXTERNAL_PORT/realms/master")
  if [ "$RESPONSE" = "200" ]; then
    return 0
  else
    return 1
  fi
}

# Wait for Keycloak to be ready
RETRIES=0
until check_keycloak_status || [ $RETRIES -eq $MAX_RETRIES ]; do
  RETRIES=$((RETRIES + 1))
  echo "Waiting for Keycloak service to be up... (Attempt $RETRIES)"
  sleep $RETRY_DELAY
done

if check_keycloak_status; then
  echo "Keycloak is ready"
else
  echo "Keycloak is not ready"
  exit 1
fi

# Setup Keycloak information for E2E testing
KEYCLOAK_CONTAINER_ID=$(docker-compose ps -q keycloak)

docker exec --user keycloak "$KEYCLOAK_CONTAINER_ID" /opt/bitnami/keycloak/bin/kcadm.sh config credentials --config=/opt/bitnami/keycloak/.kcadm.config --server=http://$KEYCLOAK_HOST:$KEYCLOAK_INTERNAL_PORT --realm=master --user=test --password=test
CREATE_CLIENT_RESPONSE=$(docker exec --user keycloak "$KEYCLOAK_CONTAINER_ID" /opt/bitnami/keycloak/bin/kcadm.sh create clients --config /opt/bitnami/keycloak/.kcadm.config --server http://$KEYCLOAK_HOST:$KEYCLOAK_INTERNAL_PORT --realm master -s clientId=test -s enabled=true -s publicClient=false -s directAccessGrantsEnabled=true -s clientAuthenticatorType=client-secret 2>&1)
CLIENT_UUID=$(echo "$CREATE_CLIENT_RESPONSE" | awk -F"'" '{print $2}')

CLIENT_SECRET_RESPONSE=$(docker exec --user keycloak "$KEYCLOAK_CONTAINER_ID" /opt/bitnami/keycloak/bin/kcadm.sh get clients/$CLIENT_UUID/client-secret --config /opt/bitnami/keycloak/.kcadm.config --server http://$KEYCLOAK_HOST:$KEYCLOAK_INTERNAL_PORT --realm master 2>&1)
CLIENT_SECRET=$(echo "$CLIENT_SECRET_RESPONSE" | awk -F'"' '/value/ {print $4}')

GET_USER_RESPONSE=$(docker exec --user keycloak "$KEYCLOAK_CONTAINER_ID" /opt/bitnami/keycloak/bin/kcadm.sh get users --config /opt/bitnami/keycloak/.kcadm.config --server http://$KEYCLOAK_HOST:$KEYCLOAK_INTERNAL_PORT --query "username=test" --fields id 2>&1 --realm master 2>&1)
USER_UUID=$(echo "$GET_USER_RESPONSE" | awk -F'"' '{print $4}')

docker exec --user keycloak "$KEYCLOAK_CONTAINER_ID" /opt/bitnami/keycloak/bin/kcadm.sh create roles --config /opt/bitnami/keycloak/.kcadm.config --server http://$KEYCLOAK_HOST:$KEYCLOAK_INTERNAL_PORT --realm master -s name=super_admin
docker exec --user keycloak "$KEYCLOAK_CONTAINER_ID" /opt/bitnami/keycloak/bin/kcadm.sh add-roles --config /opt/bitnami/keycloak/.kcadm.config --server http://$KEYCLOAK_HOST:$KEYCLOAK_INTERNAL_PORT --realm master --uusername test --rolename super_admin

# cd to main code directory
cd ../..

# Run migrations
npm run migrate:run

# Run the tests
env KEYCLOAK_URL=http://$KEYCLOAK_HOST:$KEYCLOAK_EXTERNAL_PORT KEYCLOAK_REALM=master KEYCLOAK_CLIENT_ID=test KEYCLOAK_CLIENT_SECRET=$CLIENT_SECRET ./node_modules/.bin/jest --maxWorkers=50% --config jest-e2e.json

# Move back to E2E tests directory
cd test/e2e

# Tear down the containers
docker-compose down -v

#!/bin/bash

export DB_HOST="127.0.0.1"
export DB_PORT=5432
export DB_USER=test
export DB_NAME=test
export DB_PASS=test

export KEYCLOAK_HOST="localhost"
export KEYCLOAK_INTERNAL_PORT=8080
export KEYCLOAK_EXTERNAL_PORT=6080

KEYCLOAK_CONTAINER_ID=$(docker ps -q -f name=keycloak)

echo $KEYCLOAK_CONTAINER_ID

docker exec --user keycloak "$KEYCLOAK_CONTAINER_ID" /opt/bitnami/keycloak/bin/kcadm.sh config credentials --config=/opt/bitnami/keycloak/.kcadm.config --server=http://$KEYCLOAK_HOST:$KEYCLOAK_INTERNAL_PORT --realm=master --user=test --password=test
CREATE_CLIENT_RESPONSE=$(docker exec --user keycloak "$KEYCLOAK_CONTAINER_ID" /opt/bitnami/keycloak/bin/kcadm.sh create clients --config /opt/bitnami/keycloak/.kcadm.config --server http://$KEYCLOAK_HOST:$KEYCLOAK_INTERNAL_PORT --realm master -s clientId=test -s enabled=true -s publicClient=false -s directAccessGrantsEnabled=true -s clientAuthenticatorType=client-secret 2>&1)
CLIENT_UUID=$(echo "$CREATE_CLIENT_RESPONSE" | awk -F"'" '{print $2}')

CLIENT_SECRET_RESPONSE=$(docker exec --user keycloak "$KEYCLOAK_CONTAINER_ID" /opt/bitnami/keycloak/bin/kcadm.sh get clients/$CLIENT_UUID/client-secret --config /opt/bitnami/keycloak/.kcadm.config --server http://$KEYCLOAK_HOST:$KEYCLOAK_INTERNAL_PORT --realm master 2>&1)
CLIENT_SECRET=$(echo "$CLIENT_SECRET_RESPONSE" | awk -F'"' '/value/ {print $4}')

GET_USER_RESPONSE=$(docker exec --user keycloak "$KEYCLOAK_CONTAINER_ID" /opt/bitnami/keycloak/bin/kcadm.sh get users --config /opt/bitnami/keycloak/.kcadm.config --server http://$KEYCLOAK_HOST:$KEYCLOAK_INTERNAL_PORT --query "username=test" --fields id 2>&1 --realm master 2>&1)
USER_UUID=$(echo "$GET_USER_RESPONSE" | awk -F'"' '{print $4}')

# CD to main code directory
cd ../..

# Run migrations
npm run migrate:run

# Run the tests
./node_modules/.bin/jest --maxWorkers=50% --config jest-e2e.json

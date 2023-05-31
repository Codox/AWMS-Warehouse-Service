#!/bin/sh

/wait

export PGPASSWORD=$DB_PASS

# Database names
DATABASE_NAMES="awms keycloak"

for DATABASE_NAME in $DATABASE_NAMES
do
    # Check if the database exists
    if psql -U "$DB_USER" -h "$DB_HOST" -p "$DB_PORT" -lqt | cut -d \| -f 1 | grep -qw "$DATABASE_NAME"; then
        echo "Database $DATABASE_NAME already exists."
    else
        # Create the database
        createdb -U "$DB_USER" -h "$DB_HOST" -p "$DB_PORT" "$DATABASE_NAME"
        echo "Database $DATABASE_NAME created."
    fi
done

tail -f /dev/null

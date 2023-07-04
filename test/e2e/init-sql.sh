#!/bin/bash

psql -U test
psql -c "create database test"
psql -c "create database keycloak"

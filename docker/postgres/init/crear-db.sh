#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
  CREATE USER postgres WITH PASSWORD 'maleyuyu';

  CREATE DATABASE desApp;
  GRANT ALL PRIVILEGES ON DATABASE desApp TO unahur_desapp;

  CREATE DATABASE unahur_desapp_test;
  GRANT ALL PRIVILEGES ON DATABASE desApp_test TO unahur_desapp;
EOSQL

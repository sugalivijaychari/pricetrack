#!/bin/sh
echo "Running database migrations..."
npx ts-node -r tsconfig-paths/register ./node_modules/.bin/knex migrate:latest --knexfile=./knexfile.ts

#!/bin/sh
echo "Running database seeds..."
npx ts-node -r tsconfig-paths/register ./node_modules/.bin/knex seed:run --knexfile=./knexfile.ts

#!/bin/sh

echo "Running in NODE_ENV=$NODE_ENV mode"

echo "Waiting for the database to be ready..."
while ! nc -z $DB_HOST $DB_PORT; do
  sleep 1
done

if [ "$NODE_ENV" = "production" ]; then
  echo "Running migrations..."
  npx mikro-orm migration:up
fi

if [ "$NODE_ENV" = "development" ]; then
  echo "Starting in development mode..."
  pnpm dev
elif [ "$NODE_ENV" = "test" ]; then
  echo "Running tests..."
  pnpm test:watch

elif [ "$NODE_ENV" = "production" ]; then
  echo "Starting in production mode..."
  pnpm start
else
  echo "NODE_ENV is not set or unrecognized. Defaulting to development mode."
  pnpm dev
fi

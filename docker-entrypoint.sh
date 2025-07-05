#!/bin/bash

set -e

cp .env.example .env

composer dump-autoload

echo "Generating application key..."
php artisan key:generate --force

echo "Running database migrations..."
php artisan migrate:fresh --force

echo "Running database seeders (if applicable)..."
php artisan db:seed --force || echo "No seeders to run."

echo "Clearing caches..."
php artisan route:clear
php artisan cache:clear
php artisan view:clear
php artisan config:cache

echo "Starting PHP-FPM server..."
php artisan serve --host=0.0.0.0 --port=8094

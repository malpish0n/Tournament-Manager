#!/bin/bash

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
# Go to the project root (one level up from scripts)
PROJECT_ROOT="$SCRIPT_DIR/.."

echo "🚀 Starting Spring Boot 4.0.2 Backend..."
echo ""

cd "$PROJECT_ROOT/backend"

# Check if PostgreSQL is running
if ! pg_isready -q; then
    echo "⚠️  PostgreSQL is not running!"
    echo "Start it with: brew services start postgresql@14"
    echo ""
fi

# Check if database exists
if ! psql -lqt | cut -d \| -f 1 | grep -qw tournamentdb; then
    echo "⚠️  Database 'tournamentdb' does not exist!"
    echo "Create it with: createdb tournamentdb"
    echo ""
fi

echo "Starting Spring Boot..."
mvn spring-boot:run


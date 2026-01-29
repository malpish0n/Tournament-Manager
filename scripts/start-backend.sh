#!/bin/bash

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
# Go to the project root (one level up from scripts)
PROJECT_ROOT="$SCRIPT_DIR/.."

echo "🚀 Starting Spring Boot 4.0.2 Backend..."
echo ""

cd "$PROJECT_ROOT/backend"


echo "Starting Spring Boot..."
mvn spring-boot:run


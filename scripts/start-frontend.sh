#!/bin/bash

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
# Go to the project root (one level up from scripts)
PROJECT_ROOT="$SCRIPT_DIR/.."

echo "🎮 Starting React Frontend..."
echo ""

cd "$PROJECT_ROOT/frontend"

if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

echo "Starting React app..."
npm start


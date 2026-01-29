#!/bin/bash

# Get script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$SCRIPT_DIR/.."

echo "🛠️  Setting up Tournament Manager..."
echo ""

# Backend Setup
echo "🔹 Setting up Backend..."
if command -v mvn &> /dev/null; then
    cd "$PROJECT_ROOT/backend"
    echo "Running 'mvn clean install'..."
    mvn clean install -DskipTests
else
    echo "⚠️  Maven not found! Skipping backend build."
fi
echo ""

# Frontend Setup
echo "🔹 Setting up Frontend..."
if command -v npm &> /dev/null; then
    cd "$PROJECT_ROOT/frontend"
    if [ ! -d "node_modules" ]; then
        echo "Installing npm dependencies..."
        npm install
    else
        echo "Node modules already exist."
    fi
else
    echo "⚠️  npm not found! Skipping frontend setup."
fi
echo ""

echo "✅ Setup complete!"
echo "Run './scripts/start-backend.sh' and './scripts/start-frontend.sh' to start the app."


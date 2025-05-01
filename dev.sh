#!/bin/bash

# Ensure required environment files exist, create from examples if needed
check_env_file() {
  local dir=$1
  local file="$dir/.env"
  local example_file="$dir/.env.example"
  
  if [ ! -f "$file" ] && [ -f "$example_file" ]; then
    echo "Creating $file from example..."
    cp "$example_file" "$file"
    echo "⚠️  Please review and update $file with appropriate values"
  elif [ ! -f "$file" ]; then
    echo "❌ Error: $file doesn't exist and no example file found"
    exit 1
  fi
}

# Setup environment files
check_env_file "db"
check_env_file "backend"
check_env_file "web"

# Start all services in development mode with docker-compose
echo "🚀 Starting all services in development mode..."
docker-compose -f docker-compose.dev.yml up

echo "✅ Budgeting App development environment is starting!"
echo ""
echo "📊 Services available at:"
echo "- Database: http://localhost:9002"
echo "- Backend API: http://localhost:8000/api"
echo "- Frontend: http://localhost:3000"

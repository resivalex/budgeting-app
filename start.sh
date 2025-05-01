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

# Build frontend for production use
echo "📦 Building frontend for production..."
cd web
yarn install
yarn build
cd ..

# Start all services with docker-compose
echo "🚀 Starting all services..."
docker-compose up -d

echo "✅ Budgeting App is starting!"
echo ""
echo "📊 Services available at:"
echo "- Database: http://localhost:9002"
echo "- Backend API: http://localhost:8000/api"
echo "- Frontend: http://localhost:3000"

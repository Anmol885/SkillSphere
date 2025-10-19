#!/bin/bash

# SkillSphere Deployment Script
# This script deploys the application using Docker Compose

set -e

echo "🚀 Starting SkillSphere deployment..."

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
    echo "✅ Environment variables loaded"
else
    echo "❌ .env file not found! Please create one from .env.example"
    exit 1
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "✅ Docker and Docker Compose are installed"

# Pull latest images (if using pre-built images)
echo "📥 Pulling latest Docker images..."
docker-compose pull || true

# Build images
echo "🔨 Building Docker images..."
docker-compose build --no-cache

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose down

# Start containers
echo "▶️  Starting containers..."
docker-compose up -d

# Wait for services to be healthy
echo "⏳ Waiting for services to be healthy..."
sleep 15

# Check service health
echo "🏥 Checking service health..."

if docker-compose ps | grep -q "Up"; then
    echo "✅ Services are running"
else
    echo "❌ Some services failed to start"
    docker-compose logs
    exit 1
fi

# Test backend health
if curl -f http://localhost:5000/health > /dev/null 2>&1; then
    echo "✅ Backend is healthy"
else
    echo "❌ Backend health check failed"
fi

# Test frontend
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Frontend is healthy"
else
    echo "❌ Frontend health check failed"
fi

# Test nginx
if curl -f http://localhost/health > /dev/null 2>&1; then
    echo "✅ Nginx is healthy"
else
    echo "❌ Nginx health check failed"
fi

echo ""
echo "🎉 Deployment completed!"
echo ""
echo "📍 Access points:"
echo "   - Application: http://localhost"
echo "   - Backend API: http://localhost/api/v1"
echo "   - API Docs: http://localhost/api-docs"
echo "   - Grafana: http://localhost/grafana (admin/admin)"
echo "   - Prometheus: http://localhost/prometheus"
echo ""
echo "📊 View logs:"
echo "   docker-compose logs -f"
echo ""
echo "🛑 Stop services:"
echo "   docker-compose down"
echo ""

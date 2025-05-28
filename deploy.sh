#!/bin/bash
# Production deployment script for Nanotech Chemical Industry Limited

# Exit on error
set -e

echo "Starting deployment process..."

# Navigate to frontend directory
cd frontend

# Install dependencies
echo "Installing frontend dependencies..."
npm ci --production

# Build the frontend
echo "Building frontend..."
npm run build

# Move to backend directory
cd ../backend

# Install backend dependencies
echo "Installing backend dependencies..."
npm ci --production

# Start the backend server using PM2 (make sure PM2 is installed)
echo "Starting backend server with PM2..."
pm2 delete api.nanotechchemical.com || true  # Delete existing process if it exists
pm2 start src/index.js --name "api.nanotechchemical.com" --env production

# Save PM2 process list
pm2 save

# Setup PM2 startup script (only needed once)
# pm2 startup

echo "Deployment complete!"
echo "Backend API running at https://api.nanotechchemical.com"
echo "Frontend available at https://www.nanotechchemical.com"

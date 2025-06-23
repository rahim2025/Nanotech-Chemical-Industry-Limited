#!/bin/bash

# Simple one-time setup to move uploads to persistent location
# Run this ONCE on your VPS after deploying the code changes

echo "🔧 Setting up persistent uploads directory..."

# Create the persistent directory
sudo mkdir -p /var/uploads/nanotech-chemical/products
sudo mkdir -p /var/uploads/nanotech-chemical/profiles  
sudo mkdir -p /var/uploads/nanotech-chemical/applications

# If the old uploads directory exists, move files
if [ -d "/var/www/Nanotech-Chemical-Industry-Limited/backend/uploads" ]; then
    echo "📂 Moving existing uploads to persistent location..."
    sudo cp -r /var/www/Nanotech-Chemical-Industry-Limited/backend/uploads/* /var/uploads/nanotech-chemical/ 2>/dev/null || echo "No files to move"
    
    # Create backup before removing
    sudo mkdir -p /var/backups/nanotech-chemical
    sudo cp -r /var/www/Nanotech-Chemical-Industry-Limited/backend/uploads /var/backups/nanotech-chemical/uploads_backup_$(date +%Y%m%d_%H%M%S)
    
    echo "🗑️  Removing old uploads directory..."
    sudo rm -rf /var/www/Nanotech-Chemical-Industry-Limited/backend/uploads
fi

# Set proper permissions
echo "🔐 Setting permissions..."
sudo chown -R www-data:www-data /var/uploads/nanotech-chemical
sudo chmod -R 755 /var/uploads/nanotech-chemical

echo "✅ Setup complete!"
echo "📂 Uploads are now stored at: /var/uploads/nanotech-chemical/"
echo "🛡️  Your uploads will persist through git updates!"

# Verify
if [ -d "/var/uploads/nanotech-chemical/products" ]; then
    FILE_COUNT=$(find /var/uploads/nanotech-chemical/products -type f 2>/dev/null | wc -l)
    echo "📊 Product images: $FILE_COUNT files"
fi

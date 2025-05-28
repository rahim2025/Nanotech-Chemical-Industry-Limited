#!/bin/bash
# Restart the Nanotech Chemical Industry backend server

# Navigate to backend directory
cd "$(dirname "$0")/backend"

# Check if we're using PM2
if command -v pm2 &> /dev/null; then
    echo "Restarting server using PM2..."
    pm2 restart api.nanotechchemical.com || pm2 start src/index.js --name "api.nanotechchemical.com" --env production
else
    # Check if we're using systemd
    if [ -f "/etc/systemd/system/nanotechapi.service" ]; then
        echo "Restarting server using systemd..."
        sudo systemctl restart nanotechapi
    else
        # Otherwise, kill existing node processes and start anew
        echo "Killing existing Node.js process and starting a new one..."
        pkill -f "node src/index.js" || true
        NODE_ENV=production node src/index.js &
        echo "Server started with PID: $!"
    fi
fi

echo "Server restart complete!"
echo "Visit https://api.nanotechchemical.com to verify it's working"

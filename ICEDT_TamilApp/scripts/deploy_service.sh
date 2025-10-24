#!/bin/bash
echo "Running deploy_service.sh for AfterInstall hook..."
# Copy the systemd service file to the appropriate location
cp /var/www/tamilapp/icedt_tamilapp.service /etc/systemd/system/icedt_tamilapp.service
# Reload systemd to recognize the new service file
systemctl daemon-reload
# Enable the service to start on boot
systemctl enable icedt_tamilapp.service
echo "Finished deploy_service.sh."
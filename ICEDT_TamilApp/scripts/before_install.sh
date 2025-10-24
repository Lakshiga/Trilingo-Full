#!/bin/bash
echo "Running BeforeInstall hook..."
# Stop the service if it's running
systemctl stop icedt_tamilapp.service || true
# Clean up previous deployment directory to ensure a fresh install
rm -rf /var/www/tamilapp/*
echo "Finished BeforeInstall hook."
#!/bin/bash

# This script ensures the application user (www-data) owns all necessary files.

# Give ownership of the entire application directory
chown -R www-data:www-data /var/www/tamilapp

# Give ownership of the database directory
# The -p flag creates the directory if it doesn't exist
mkdir -p /var/www/database
chown -R www-data:www-data /var/www/database

echo "Permissions set for /var/www/tamilapp and /var/www/database"
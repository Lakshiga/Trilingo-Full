#!/bin/bash
# Enable the service so it starts on boot
systemctl enable icedt_tamilapp.service
# Restart the service to ensure a clean start
systemctl restart icedt_tamilapp.service
#!/bin/bash

# Travel Log - Double-click launcher for macOS
# This file can be double-clicked in Finder to start the Travel Log

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Change to script directory
cd "$SCRIPT_DIR"

# Run the start script
./start.sh start

# Keep terminal open
echo ""
echo "Press any key to close this window..."
read -n 1
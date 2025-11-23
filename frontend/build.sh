#!/bin/bash
# Render build script for frontend

set -e  # Exit on error

echo "=== Build Script Started ==="
echo "Current directory: $(pwd)"
echo "Listing current directory:"
ls -la

# Ensure we're in the frontend directory
if [ ! -f "package.json" ]; then
    echo "ERROR: package.json not found in current directory!"
    exit 1
fi

# Install dependencies
echo "=== Installing dependencies ==="
npm install

# Set environment variables for React build
export PUBLIC_URL=/
export GENERATE_SOURCEMAP=false

# Build the React app
echo "=== Building React app ==="
npm run build

echo "=== Build completed ==="
echo "Contents of build directory:"
ls -la build/ || echo "Build directory not found!"

echo "=== Build Script Completed Successfully ==="

#!/bin/bash
# Render build script for frontend

echo "Current directory: $(pwd)"
echo "Listing files:"
ls -la

# Install dependencies
npm install

# Build the React app
REACT_APP_API_URL=$REACT_APP_API_URL npm run build

echo "Build completed. Contents of build directory:"
ls -la build/

# The build folder will be served by Render

#!/bin/bash

echo "🏥 Healthcare System Configuration Test"
echo "======================================"

# Start the dev server
echo "Starting development server..."
npm run dev &
DEV_PID=$!

# Wait for server to start
sleep 5

echo ""
echo "🧪 Testing Configuration System:"
echo ""
echo "1. Default (localhost:3000):"
echo "   - Shows ConfigSwitcher for manual testing"
echo "   - Default hospital configuration"
echo ""
echo "2. Domain-based testing:"
echo "   Add to /etc/hosts first:"
echo "   127.0.0.1 clinic.localhost"
echo "   127.0.0.1 enterprise.localhost"
echo ""
echo "   Then visit:"
echo "   - http://clinic.localhost:3000 (Small Clinic)"
echo "   - http://enterprise.localhost:3000 (Big Hospital)"
echo ""
echo "3. Manual testing with ConfigSwitcher:"
echo "   - Visit http://localhost:3000"
echo "   - Use dropdown in top-right corner"
echo ""
echo "Press Ctrl+C to stop the server"

# Keep script running
wait $DEV_PID
#!/bin/bash

# Healthcare Management System - Backend Server Startup Script

echo "🏥 Healthcare Management System - Backend Setup"
echo "=============================================="

# Check if Java is installed
if ! command -v java &> /dev/null; then
    echo "❌ Java is not installed. Please install Java 17 or higher."
    exit 1
fi

# Check Java version
JAVA_VERSION=$(java -version 2>&1 | head -n 1 | cut -d'"' -f2 | cut -d'.' -f1)
if [ "$JAVA_VERSION" -lt 17 ]; then
    echo "❌ Java 17 or higher is required. Current version: $JAVA_VERSION"
    exit 1
fi

echo "✅ Java version check passed"

# Backend server URL
BACKEND_URL="http://localhost:8080"

# Check if backend is already running
if curl -s "$BACKEND_URL/api/health" > /dev/null 2>&1; then
    echo "✅ Backend server is already running at $BACKEND_URL"
    echo "📊 Swagger UI: $BACKEND_URL/swagger-ui/index.html"
    exit 0
fi

echo "🚀 Starting backend server..."
echo "📍 Server will be available at: $BACKEND_URL"
echo "📊 Swagger UI will be available at: $BACKEND_URL/swagger-ui/index.html"
echo ""
echo "Test credentials:"
echo "  Admin: admin@hospital.com / admin123 (hospital_org1)"
echo "  Doctor: dr.smith@hospital.com / admin123 (hospital_org1)"
echo "  Patient: alice.brown@email.com / admin123 (hospital_org1)"
echo ""
echo "⏳ Please start your backend server manually or download it from the provided repository."
echo "   The frontend is configured to connect to $BACKEND_URL/api"
echo ""
echo "💡 Once the backend is running, you can test the connection with:"
echo "   curl -X POST $BACKEND_URL/api/auth/login \\"
echo "     -H \"Content-Type: application/json\" \\"
echo "     -d '{\"email\":\"admin@hospital.com\",\"password\":\"admin123\",\"organizationId\":\"hospital_org1\"}'"
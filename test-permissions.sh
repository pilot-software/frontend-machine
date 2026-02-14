#!/bin/bash

# Permissions System Test Script
# This script tests the permissions API endpoints

BASE_URL="http://localhost:3000"
AUTH_TOKEN="your-auth-token-here"

echo "🔐 Testing Permissions System"
echo "================================"

# Test 1: Get Permission Catalog
echo "📋 Test 1: Getting Permission Catalog..."
curl -s -H "Authorization: Bearer $AUTH_TOKEN" \
     -H "Content-Type: application/json" \
     "$BASE_URL/api/permissions/catalog" | jq '.' || echo "❌ Failed to get permission catalog"

echo ""

# Test 2: Get Organization Permissions
echo "🏥 Test 2: Getting Organization Permissions..."
curl -s -H "Authorization: Bearer $AUTH_TOKEN" \
     -H "Content-Type: application/json" \
     "$BASE_URL/api/permissions/organization/permissions" | jq '.' || echo "❌ Failed to get organization permissions"

echo ""

# Test 3: Get Permission Groups
echo "👥 Test 3: Getting Permission Groups..."
curl -s -H "Authorization: Bearer $AUTH_TOKEN" \
     -H "Content-Type: application/json" \
     "$BASE_URL/api/permissions/groups" | jq '.' || echo "❌ Failed to get permission groups"

echo ""

# Test 4: Create Permission Group
echo "➕ Test 4: Creating Permission Group..."
curl -s -X POST \
     -H "Authorization: Bearer $AUTH_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{
       "groupName": "Test Group",
       "description": "Test permission group",
       "organizationPermissionIds": [1, 2, 3]
     }' \
     "$BASE_URL/api/permissions/groups" | jq '.' || echo "❌ Failed to create permission group"

echo ""

# Test 5: Get User Permissions
echo "👤 Test 5: Getting User Permissions..."
USER_ID="test-user-id"
curl -s -H "Authorization: Bearer $AUTH_TOKEN" \
     -H "Content-Type: application/json" \
     "$BASE_URL/api/permissions/users/$USER_ID" | jq '.' || echo "❌ Failed to get user permissions"

echo ""

echo "✅ Permissions system tests completed!"
echo ""
echo "📝 Next Steps:"
echo "1. Update AUTH_TOKEN with a valid token"
echo "2. Ensure backend permission service is running on port 8080"
echo "3. Start the frontend development server: npm run dev"
echo "4. Navigate to http://localhost:3000/en/permissions"
echo ""
echo "🔗 Available Endpoints:"
echo "- Permission Catalog: $BASE_URL/api/permissions/catalog"
echo "- Organization Permissions: $BASE_URL/api/permissions/organization/permissions"
echo "- Permission Groups: $BASE_URL/api/permissions/groups"
echo "- User Permissions: $BASE_URL/api/permissions/users/{userId}"
echo ""
echo "📖 For detailed documentation, see PERMISSIONS_SYSTEM_GUIDE.md"
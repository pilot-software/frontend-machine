```sh
#!/bin/bash
echo "🏥 Healthcare Management System - Setup"
echo "====================================="

# Check Node.js version
echo "🔍 Checking Node.js version..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    echo "Please install Node.js 20.10.0 or higher from https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d "v" -f 2)
if [ "${NODE_VERSION%%.*}" -lt 20 ]; then
    echo "❌ Node.js 20.10.0 or higher is required"
    echo "Current version: $NODE_VERSION"
    echo "Please upgrade Node.js from https://nodejs.org/"
    exit 1
fi

# Check npm version
echo "🔍 Checking npm version..."
NPM_VERSION=$(npm -v)
echo "   npm version: v$NPM_VERSION"

# Clean install
echo "🧹 Cleaning previous installation..."
rm -rf node_modules package-lock.json .next

# Install dependencies
echo "📦 Installing dependencies..."
npm install

echo ""
echo "✅ Setup completed successfully!"
echo ""
echo "🚀 Available commands:"
echo "   npm run dev     - Start development server"
echo "   npm run build   - Build for production"
echo "   npm run start   - Start production server"
echo ""
echo "🔑 Test credentials:"
echo "   Admin: admin@hospital.com / admin123"
echo "   Doctor: doctor@hospital.com / doctor123"
echo "   Nurse: nurse@hospital.com / nurse123"
echo "   Patient: patient@example.com / patient123"
echo ""
echo "📝 Next steps:"
echo "   1. Run: npm run dev"
echo "   2. Open: http://localhost:3000"
```
#!/bin/bash

# ExoAI Frontend Installation Script
echo "🚀 Installing ExoAI Frontend..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ and try again."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Install dependencies
echo "📦 Installing dependencies..."
if command -v pnpm &> /dev/null; then
    echo "Using pnpm..."
    pnpm install
elif command -v yarn &> /dev/null; then
    echo "Using yarn..."
    yarn install
else
    echo "Using npm..."
    npm install
fi

# Create environment file
if [ ! -f .env.local ]; then
    echo "📝 Creating environment file..."
    echo "NEXT_PUBLIC_BACKEND_URL=http://localhost:8000" > .env.local
    echo "✅ Environment file created"
else
    echo "✅ Environment file already exists"
fi

echo ""
echo "🎉 Installation complete!"
echo ""
echo "To start the development server:"
echo "  npm run dev"
echo "  # or"
echo "  yarn dev"
echo "  # or"
echo "  pnpm dev"
echo ""
echo "Then open http://localhost:3000 in your browser"
echo ""
echo "The app runs in mock mode by default, so you can explore all features"
echo "even without the Python backend running."

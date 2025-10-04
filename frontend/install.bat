@echo off
echo 🚀 Installing ExoAI Frontend...

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ and try again.
    pause
    exit /b 1
)

echo ✅ Node.js detected
node --version

REM Install dependencies
echo 📦 Installing dependencies...
if exist node_modules (
    echo Dependencies already installed
) else (
    npm install
)

REM Create environment file
if not exist .env.local (
    echo 📝 Creating environment file...
    echo NEXT_PUBLIC_BACKEND_URL=http://localhost:8000 > .env.local
    echo ✅ Environment file created
) else (
    echo ✅ Environment file already exists
)

echo.
echo 🎉 Installation complete!
echo.
echo To start the development server:
echo   npm run dev
echo.
echo Then open http://localhost:3000 in your browser
echo.
echo The app runs in mock mode by default, so you can explore all features
echo even without the Python backend running.
pause

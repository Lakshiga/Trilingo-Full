@echo off
REM Trillingo Platform Quick Start Script for Windows
REM This script helps set up the complete Trillingo platform

echo 🚀 Starting Trillingo Platform Setup...

REM Check if required tools are installed
echo [INFO] Checking prerequisites...

REM Check Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed. Please install Node.js v18 or higher.
    pause
    exit /b 1
)

REM Check Angular CLI
ng --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARNING] Angular CLI not found. Installing...
    npm install -g @angular/cli
)

REM Check .NET
dotnet --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] .NET SDK is not installed. Please install .NET 8 SDK.
    pause
    exit /b 1
)

REM Check Expo CLI
expo --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARNING] Expo CLI not found. Installing...
    npm install -g @expo/cli
)

echo [SUCCESS] All prerequisites are installed!

echo.
echo [INFO] Setting up all components...

REM Setup Backend
echo [INFO] Setting up Backend (ASP.NET Web API)...
cd ICEDT_TamilApp\src\ICEDT_TamilApp.Web

echo [INFO] Restoring NuGet packages...
dotnet restore

echo [INFO] Updating database...
dotnet ef database update

echo [SUCCESS] Backend setup completed!
echo [INFO] Backend will run on: http://localhost:5000

REM Setup Angular Admin Panel
echo.
echo [INFO] Setting up Angular Admin Panel...
cd ..\..\..\icedt-admin-angular

echo [INFO] Installing Angular dependencies...
npm install

echo [SUCCESS] Angular Admin Panel setup completed!
echo [INFO] Admin Panel will run on: http://localhost:4200

REM Setup Mobile App
echo.
echo [INFO] Setting up React Native Mobile App...
cd ..\trillingo-mobile

echo [INFO] Installing Mobile App dependencies...
npm install

echo [SUCCESS] Mobile App setup completed!
echo [INFO] Mobile App will run with: npx expo start

echo.
echo [SUCCESS] Setup completed successfully!
echo.

set /p start_services="Do you want to start all services now? (y/n): "
if /i "%start_services%"=="y" (
    echo.
    echo [INFO] Starting all services...
    echo [INFO] Backend: http://localhost:5000
    echo [INFO] Admin Panel: http://localhost:4200
    echo [INFO] Mobile App: Check Expo CLI output for QR code
    echo.
    echo [INFO] Press Ctrl+C to stop all services
    echo.
    
    REM Start Backend
    start "Trillingo Backend" cmd /k "cd ICEDT_TamilApp\src\ICEDT_TamilApp.Web && dotnet run"
    
    REM Wait a moment for backend to start
    timeout /t 5 /nobreak >nul
    
    REM Start Angular Admin Panel
    start "Trillingo Admin Panel" cmd /k "cd icedt-admin-angular && ng serve"
    
    REM Wait a moment for Angular to start
    timeout /t 10 /nobreak >nul
    
    REM Start Mobile App
    start "Trillingo Mobile App" cmd /k "cd trillingo-mobile && npx expo start"
    
    echo [SUCCESS] All services started!
    echo [INFO] Check the opened command windows for service status
    pause
) else (
    echo.
    echo [INFO] Setup complete! You can start services manually:
    echo   Backend: cd ICEDT_TamilApp\src\ICEDT_TamilApp.Web ^&^& dotnet run
    echo   Angular: cd icedt-admin-angular ^&^& ng serve
    echo   Mobile:  cd trillingo-mobile ^&^& npx expo start
    pause
)

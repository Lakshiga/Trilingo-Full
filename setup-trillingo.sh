#!/bin/bash

# Trillingo Platform Quick Start Script
# This script helps set up the complete Trillingo platform

echo "🚀 Starting Trillingo Platform Setup..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js v18 or higher."
        exit 1
    fi
    
    # Check Angular CLI
    if ! command -v ng &> /dev/null; then
        print_warning "Angular CLI not found. Installing..."
        npm install -g @angular/cli
    fi
    
    # Check .NET
    if ! command -v dotnet &> /dev/null; then
        print_error ".NET SDK is not installed. Please install .NET 8 SDK."
        exit 1
    fi
    
    # Check Expo CLI
    if ! command -v expo &> /dev/null; then
        print_warning "Expo CLI not found. Installing..."
        npm install -g @expo/cli
    fi
    
    print_success "All prerequisites are installed!"
}

# Setup Backend
setup_backend() {
    print_status "Setting up Backend (ASP.NET Web API)..."
    
    cd ICEDT_TamilApp/src/ICEDT_TamilApp.Web
    
    # Restore packages
    print_status "Restoring NuGet packages..."
    dotnet restore
    
    # Update database
    print_status "Updating database..."
    dotnet ef database update
    
    print_success "Backend setup completed!"
    print_status "Backend will run on: http://localhost:5000"
}

# Setup Angular Admin Panel
setup_angular() {
    print_status "Setting up Angular Admin Panel..."
    
    cd ../../icedt-admin-angular
    
    # Install dependencies
    print_status "Installing Angular dependencies..."
    npm install
    
    print_success "Angular Admin Panel setup completed!"
    print_status "Admin Panel will run on: http://localhost:4200"
}

# Setup Mobile App
setup_mobile() {
    print_status "Setting up React Native Mobile App..."
    
    cd ../trillingo-mobile
    
    # Install dependencies
    print_status "Installing Mobile App dependencies..."
    npm install
    
    print_success "Mobile App setup completed!"
    print_status "Mobile App will run with: npx expo start"
}

# Start all services
start_services() {
    print_status "Starting all services..."
    
    # Start Backend
    print_status "Starting Backend..."
    cd ICEDT_TamilApp/src/ICEDT_TamilApp.Web
    dotnet run &
    BACKEND_PID=$!
    
    # Wait a moment for backend to start
    sleep 5
    
    # Start Angular Admin Panel
    print_status "Starting Angular Admin Panel..."
    cd ../../icedt-admin-angular
    ng serve &
    ANGULAR_PID=$!
    
    # Wait a moment for Angular to start
    sleep 10
    
    # Start Mobile App
    print_status "Starting Mobile App..."
    cd ../trillingo-mobile
    npx expo start &
    MOBILE_PID=$!
    
    print_success "All services started!"
    print_status "Backend: http://localhost:5000"
    print_status "Admin Panel: http://localhost:4200"
    print_status "Mobile App: Check Expo CLI output for QR code"
    
    # Keep script running
    print_status "Press Ctrl+C to stop all services"
    
    # Function to cleanup on exit
    cleanup() {
        print_status "Stopping all services..."
        kill $BACKEND_PID 2>/dev/null
        kill $ANGULAR_PID 2>/dev/null
        kill $MOBILE_PID 2>/dev/null
        print_success "All services stopped!"
        exit 0
    }
    
    # Set up signal handlers
    trap cleanup SIGINT SIGTERM
    
    # Wait for user to stop
    wait
}

# Main execution
main() {
    echo "🎯 Trillingo Platform Setup"
    echo "=========================="
    
    check_prerequisites
    
    echo ""
    print_status "Setting up all components..."
    
    setup_backend
    echo ""
    
    setup_angular
    echo ""
    
    setup_mobile
    echo ""
    
    print_success "Setup completed successfully!"
    echo ""
    
    read -p "Do you want to start all services now? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        start_services
    else
        print_status "Setup complete! You can start services manually:"
        echo "  Backend: cd ICEDT_TamilApp/src/ICEDT_TamilApp.Web && dotnet run"
        echo "  Angular: cd icedt-admin-angular && ng serve"
        echo "  Mobile:  cd trillingo-mobile && npx expo start"
    fi
}

# Run main function
main

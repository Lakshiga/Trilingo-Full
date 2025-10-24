# ICEDT Learning App - Complete Setup Guide

## Overview
This project consists of three main components:
1. **TES_Learning_App_Backend** - .NET Core Web API backend
2. **icedt-admin-angular** - Angular admin panel for content management
3. **trillingo-mobile** - React Native mobile app for learners

## Prerequisites
- .NET 8.0 SDK
- Node.js 18+ and npm
- SQL Server (LocalDB or full instance)
- Android Studio (for mobile development)
- Visual Studio or VS Code

## Backend Setup (TES_Learning_App_Backend)

### 1. Database Setup
```bash
cd TES_Learning_App_Backend
# Update connection string in appsettings.json if needed
# Default uses LocalDB: Server=(localdb)\\mssqllocaldb;Database=TES_Learning_Db;Trusted_Connection=True;
```

### 2. Run Backend
```bash
cd TES_Learning_App_Backend/TES_Learning_App.API
dotnet restore
dotnet build
dotnet run
```
Backend will be available at: `http://localhost:5069`

### 3. API Endpoints
- **Authentication**: `/api/auth/login`, `/api/auth/register`
- **Levels**: `/api/levels` (GET, POST, PUT, DELETE)
- **Languages**: `/api/languages` (GET, POST, PUT, DELETE)
- **Activities**: `/api/activities` (GET, POST, PUT, DELETE)
- **Activity Types**: `/api/activitytypes` (GET, POST, PUT, DELETE)
- **Main Activities**: `/api/mainactivities` (GET, POST, PUT, DELETE)

## Angular Admin Panel Setup (icedt-admin-angular)

### 1. Install Dependencies
```bash
cd icedt-admin-angular
npm install
```

### 2. Run Development Server
```bash
npm start
# or
ng serve
```
Admin panel will be available at: `http://localhost:4200`

### 3. Features
- **Authentication**: Login/Register with JWT tokens
- **Level Management**: CRUD operations for learning levels
- **Activity Management**: Create and manage learning activities
- **Multilingual Support**: Tamil, English, Sinhala
- **Content Editor**: Rich text editor for activity content

## Mobile App Setup (trillingo-mobile)

### 1. Install Dependencies
```bash
cd trillingo-mobile
npm install
```

### 2. Run on Android
```bash
npx react-native run-android
```

### 3. Run on iOS (macOS only)
```bash
npx react-native run-ios
```

### 4. Features
- **User Authentication**: Login/Register
- **Learning Levels**: Browse and access learning content
- **Progress Tracking**: Track learning progress
- **Multilingual Support**: Switch between languages
- **Offline Support**: Download content for offline learning

## Configuration

### Backend Configuration
- **CORS**: Configured to allow all origins for development
- **JWT**: Secret key configured in appsettings.json
- **Database**: SQL Server with Entity Framework Core

### Frontend Configuration
- **API URL**: `http://localhost:5069/api` (configured in environment files)
- **Authentication**: JWT token stored in localStorage
- **Language Support**: Tamil, English, Sinhala

### Mobile Configuration
- **API URL**: `http://localhost:5069/api` (configured in services)
- **Authentication**: JWT token management
- **Platform Support**: Android and iOS

## Development Workflow

### 1. Start Backend
```bash
cd TES_Learning_App_Backend/TES_Learning_App.API
dotnet run
```

### 2. Start Angular Admin
```bash
cd icedt-admin-angular
npm start
```

### 3. Start Mobile App
```bash
cd trillingo-mobile
npx react-native run-android
```

## API Integration

### Authentication Flow
1. User logs in via `/api/auth/login`
2. Backend returns JWT token
3. Frontend stores token in localStorage
4. All subsequent requests include `Authorization: Bearer <token>` header

### CRUD Operations
All entities support full CRUD operations:
- **Create**: POST to `/api/{entity}`
- **Read**: GET from `/api/{entity}` or `/api/{entity}/{id}`
- **Update**: PUT to `/api/{entity}/{id}`
- **Delete**: DELETE to `/api/{entity}/{id}`

### Data Models
- **Levels**: Learning levels with multilingual names
- **Languages**: Supported languages (Tamil, English, Sinhala)
- **Activities**: Learning activities with content and metadata
- **Activity Types**: Categories of activities
- **Main Activities**: Primary activity groupings

## Troubleshooting

### Common Issues
1. **CORS Errors**: Ensure backend CORS is properly configured
2. **Authentication Errors**: Check JWT token validity and expiration
3. **Database Connection**: Verify SQL Server is running and connection string is correct
4. **Mobile Build Issues**: Ensure Android Studio is properly configured

### Logs
- **Backend**: Check console output for API logs
- **Angular**: Check browser console for frontend errors
- **Mobile**: Check Metro bundler and device logs

## Production Deployment

### Backend
1. Update connection string for production database
2. Configure CORS for production domains
3. Set up proper JWT secrets
4. Deploy to Azure/AWS/your preferred hosting

### Angular
1. Build for production: `ng build --prod`
2. Deploy to web server (nginx, Apache, etc.)
3. Update API URLs for production

### Mobile
1. Build release APK: `npx react-native build-android --mode=release`
2. Sign and distribute through app stores
3. Update API URLs for production

## Support
For issues or questions, check the individual project README files or contact the development team.

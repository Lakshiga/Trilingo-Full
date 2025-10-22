# Trillingo - Multilingual Learning Platform Setup Guide

## Overview
Trillingo is a comprehensive multilingual learning platform that supports Tamil, English, and Sinhala languages. The platform consists of three main components:

1. **Angular Admin Panel** - For managing content and activities
2. **ASP.NET Web API Backend** - For data management and API services
3. **React Native Mobile App** - For student learning experience

## Project Structure
```
ICEDT_Admin_App/
├── ICEDT_TamilApp/                 # Backend API (ASP.NET)
├── icedt-admin-angular/           # Admin Panel (Angular)
├── trillingo-mobile/              # Mobile App (React Native)
└── ICEDT_ADMIN_APP/               # Original React Admin (Reference)
```

## Prerequisites

### Required Software
- **Node.js** (v18 or higher)
- **Angular CLI** (v17 or higher)
- **.NET 8 SDK**
- **Visual Studio 2022** or **Visual Studio Code**
- **Expo CLI** (for mobile development)
- **Git**

### Database
- **SQL Server** (LocalDB, Express, or Full version)
- **Entity Framework Core**

## Setup Instructions

### 1. Backend Setup (ASP.NET Web API)

#### Step 1: Navigate to Backend Directory
```bash
cd ICEDT_TamilApp/src/ICEDT_TamilApp.Web
```

#### Step 2: Update Connection String
Edit `appsettings.json` and `appsettings.Development.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=TrillingoDb;Trusted_Connection=true;MultipleActiveResultSets=true"
  }
}
```

#### Step 3: Install Dependencies
```bash
dotnet restore
```

#### Step 4: Run Database Migrations
```bash
dotnet ef database update
```

#### Step 5: Start the Backend
```bash
dotnet run
```
The API will be available at `https://localhost:5001` or `http://localhost:5000`

### 2. Angular Admin Panel Setup

#### Step 1: Navigate to Angular Directory
```bash
cd icedt-admin-angular
```

#### Step 2: Install Dependencies
```bash
npm install
```

#### Step 3: Update Environment Configuration
Edit `src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000/api', // Backend API URL
  appName: 'Trillingo Admin Panel',
  supportedLanguages: ['ta', 'en', 'si'],
  defaultLanguage: 'en'
};
```

#### Step 4: Start the Admin Panel
```bash
ng serve
```
The admin panel will be available at `http://localhost:4200`

### 3. Mobile App Setup (React Native)

#### Step 1: Navigate to Mobile Directory
```bash
cd trillingo-mobile
```

#### Step 2: Install Dependencies
```bash
npm install
```

#### Step 3: Install Expo CLI (if not already installed)
```bash
npm install -g @expo/cli
```

#### Step 4: Update API Configuration
Edit `src/services/AuthService.ts` and `src/services/ActivityService.ts`:
```typescript
const API_BASE_URL = 'http://localhost:5000/api'; // Update with your backend URL
```

#### Step 5: Start the Mobile App
```bash
npx expo start
```

## Features Overview

### Multilingual Support
- **Tamil (ta)**: தமிழ்
- **English (en)**: English  
- **Sinhala (si)**: සිංහල

### Learning Stages
1. **Letters Stage**: Basic letter recognition and pronunciation
2. **Words Stage**: Vocabulary building and word formation
3. **Sentences Stage**: Sentence construction and grammar

### Admin Panel Features
- ✅ Multilingual content management
- ✅ Activity creation and editing
- ✅ User management
- ✅ Progress tracking
- ✅ Language switching
- ✅ JSON-based content templates

### Mobile App Features
- ✅ User registration with language preferences
- ✅ Three-stage learning system
- ✅ Multilingual interface
- ✅ Progress tracking
- ✅ Offline capability (planned)
- ✅ Audio support
- ✅ Interactive activities

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user

### Activities
- `GET /api/activities` - Get all activities
- `GET /api/activities/{id}` - Get activity by ID
- `POST /api/activities` - Create new activity
- `PUT /api/activities/{id}` - Update activity
- `DELETE /api/activities/{id}` - Delete activity

### Levels and Lessons
- `GET /api/levels` - Get all levels
- `GET /api/levels/{id}/lessons` - Get lessons by level
- `GET /api/lessons/{id}/activities` - Get activities by lesson

### User Progress
- `GET /api/users/{id}/progress` - Get user progress
- `POST /api/user-progress` - Update user progress
- `POST /api/activities/{id}/complete` - Mark activity as complete

## Database Schema

### Key Tables
- **Users**: User accounts with language preferences
- **Activities**: Learning activities with multilingual content
- **Levels**: Learning levels (Letters, Words, Sentences)
- **Lessons**: Lessons within levels
- **UserProgress**: User learning progress tracking
- **ActivityTypes**: Types of activities (MCQ, Drag&Drop, etc.)
- **MainActivities**: Main activity categories

### Multilingual Content Structure
```json
{
  "title": {
    "ta": "தமிழ் தலைப்பு",
    "en": "English Title",
    "si": "සිංහල මාතෘකාව"
  },
  "content": {
    "ta": "தமிழ் உள்ளடக்கம்",
    "en": "English Content",
    "si": "සිංහල අන්තර්ගතය"
  }
}
```

## Development Workflow

### Adding New Activities
1. **Admin Panel**: Create activity using multilingual input forms
2. **Backend**: Activity is stored with multilingual JSON structure
3. **Mobile App**: Activity appears automatically for students
4. **Real-time Sync**: Changes reflect immediately across platforms

### Language Management
1. **User Registration**: Select native and target languages
2. **Settings**: Change target language anytime
3. **Content Display**: All content adapts to selected language
4. **Instructions**: Always shown in user's native language

## Testing

### Backend Testing
```bash
cd ICEDT_TamilApp/src/ICEDT_TamilApp.Web
dotnet test
```

### Angular Testing
```bash
cd icedt-admin-angular
ng test
```

### Mobile App Testing
```bash
cd trillingo-mobile
npm test
```

## Deployment

### Backend Deployment
1. Update connection strings for production database
2. Configure CORS for production domains
3. Deploy to Azure/AWS/your preferred hosting
4. Update API URLs in frontend applications

### Angular Admin Panel Deployment
```bash
ng build --configuration production
# Deploy dist/ folder to your web server
```

### Mobile App Deployment
```bash
# For Android
npx expo build:android

# For iOS
npx expo build:ios
```

## Troubleshooting

### Common Issues

#### CORS Errors
- Ensure backend CORS policy includes your frontend URLs
- Check that API URLs are correct in environment files

#### Database Connection Issues
- Verify SQL Server is running
- Check connection string format
- Ensure database exists and migrations are applied

#### Mobile App Connection Issues
- Use your computer's IP address instead of localhost
- Ensure backend is accessible from mobile device
- Check firewall settings

#### Authentication Issues
- Verify JWT secret is configured
- Check token expiration settings
- Ensure proper headers are sent with requests

## Support and Maintenance

### Logging
- Backend logs are available in console and can be configured for file logging
- Frontend errors are logged to browser console
- Mobile app errors are logged to Expo/React Native debugger

### Monitoring
- API response times and error rates
- User activity and progress tracking
- Content usage analytics

### Updates
- Regular updates to activity templates
- New language support additions
- Performance optimizations
- Security updates

## Next Steps

1. **Complete Activity Renderers**: Implement all 51 activity types
2. **Offline Support**: Add offline capability to mobile app
3. **Analytics**: Implement detailed learning analytics
4. **Gamification**: Add points, badges, and achievements
5. **Social Features**: Add user interactions and sharing
6. **Advanced AI**: Implement personalized learning paths

## Contact and Support

For technical support or questions about the Trillingo platform, please refer to the development team or create an issue in the project repository.

---

**Trillingo Team**  
*Multilingual Learning Platform*

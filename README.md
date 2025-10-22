# 🎓 ICEDT Multilingual Learning Platform

A comprehensive multilingual learning platform consisting of three interconnected applications for Tamil language education.

## 📋 Project Overview

This repository contains three main projects that work together to provide a complete Tamil language learning ecosystem:

Currently, the icedt-admin-angular project is connected to the icedt-TamilApp backend. So now, when I add a level or activity from the admin panel, it should be stored in the database, fetched back into the admin panel, and also displayed in the mobile app.

The flow that exists in the ICEDT_Admin_App project should also work the same way in the icedt-admin-angular project.

Please help me complete and fully integrate the icedt-admin-angular project so that all the components I have created will function properly and the entire project will be fully operational.1. **icedt-admin-angular** - Admin dashboard for content management
2. **ICEDT_TamilApp** - Backend API and services
3. **trillingo-mobile** - Mobile learning application

---

## 🅰️ **1. icedt-admin-angular** (Frontend Admin Dashboard)

### **Purpose**
Web-based admin dashboard for managing learning content, users, and platform administration.

### **Core Technologies**
- **Framework**: Angular 19.0.0 (Latest version)
- **Language**: TypeScript 5.6.0
- **Styling**: SCSS (Sass)
- **UI Framework**: Angular Material 19.0.0

### **Key Dependencies**
```json
{
  "@angular/core": "^19.0.0",
  "@angular/material": "^19.0.0",
  "@angular/cdk": "^19.0.0",
  "rxjs": "~7.8.0",
  "zone.js": "~0.14.0"
}
```

### **Features**
- Material Design UI components
- Responsive design
- Component-based architecture
- TypeScript for type safety
- SCSS for styling

### **Development Commands**
```bash
cd icedt-admin-angular
npm install
ng serve          # Development server
ng build          # Production build
ng test           # Run tests
```

---

## 🔧 **2. ICEDT_TamilApp** (Backend API)

### **Purpose**
RESTful API backend providing data services, authentication, and business logic for the learning platform.

### **Core Technologies**
- **Framework**: ASP.NET Core 8.0
- **Language**: C# 12.0
- **Architecture**: Clean Architecture Pattern
- **Database**: Entity Framework Core 8.0.7 with SQLite
- **Authentication**: JWT Bearer tokens

### **Project Structure**
```
ICEDT_TamilApp/
├── Domain/           # Business entities and interfaces
├── Application/      # Use cases and business logic
├── Infrastructure/    # Data access and external services
└── Web/             # API controllers and configuration
```

### **Key Dependencies**
```xml
<PackageReference Include="Microsoft.EntityFrameworkCore.Sqlite" Version="8.0.7" />
<PackageReference Include="Microsoft.AspNetCore.Authentication.JwtBearer" Version="8.0.7" />
<PackageReference Include="AWSSDK.S3" Version="4.0.4.1" />
<PackageReference Include="BCrypt.Net-Next" Version="4.0.3" />
<PackageReference Include="Swashbuckle.AspNetCore" Version="9.0.3" />
```

### **Features**
- RESTful API endpoints
- JWT authentication
- Entity Framework Core with SQLite
- AWS S3 integration for media storage
- Swagger API documentation
- Clean Architecture implementation

### **Development Commands**
```bash
cd ICEDT_TamilApp
dotnet restore
dotnet build
dotnet run --project src/ICEDT_TamilApp.Web
```

---

## 📱 **3. trillingo-mobile** (Mobile Application)

### **Purpose**
Cross-platform mobile application for Tamil language learning with kid-friendly interface and interactive features.

### **Core Technologies**
- **Framework**: React Native 0.81.4
- **Language**: TypeScript 5.1.3
- **Platform**: Expo SDK 54.0.0
- **Runtime**: React 19.1.0

### **Key Dependencies**
```json
{
  "expo": "~54.0.0",
  "react": "19.1.0",
  "react-native": "0.81.4",
  "@react-navigation/native": "^6.1.7",
  "react-native-paper": "^5.10.6",
  "react-native-reanimated": "~4.1.1",
  "expo-linear-gradient": "~15.0.7"
}
```

### **Features**
- Cross-platform (iOS & Android)
- Kid-friendly animated UI
- Tamil language learning modules
- Progress tracking
- Interactive learning activities
- Beautiful gradient designs
- Native animations

### **Development Commands**
```bash
cd trillingo-mobile
npm install
npx expo start          # Development server
npx expo start --android # Android emulator
npx expo start --ios     # iOS simulator
```

---

## 🏗️ **Architecture Overview**

### **System Architecture**
```
┌─────────────────┐    ┌─────────────────┐
│   Mobile App    │    │  Admin Dashboard│
│ (React Native)  │    │    (Angular)    │
└─────────┬───────┘    └─────────┬───────┘
          │                      │
          └──────────┬───────────┘
                     │
          ┌─────────▼───────┐
          │   Backend API   │
          │ (ASP.NET Core)  │
          └─────────┬───────┘
                    │
          ┌─────────▼───────┐
          │    Database    │
          │   (SQLite)     │
          └────────────────┘
```

### **Data Flow**
1. **Mobile App** ↔ **REST API** ↔ **Database**
2. **Admin Dashboard** ↔ **REST API** ↔ **Database**
3. **Backend** ↔ **AWS S3** (Media Storage)

---

## 🚀 **Getting Started**

### **Prerequisites**
- Node.js 18+ (for Angular and React Native)
- .NET 8.0 SDK (for backend)
- Expo CLI (for mobile development)
- SQLite (included with .NET)

### **Installation Steps**

#### **1. Clone Repository**
```bash
git clone <repository-url>
cd ICEDT_Admin_App
```

#### **2. Setup Backend (ICEDT_TamilApp)**
```bash
cd ICEDT_TamilApp
dotnet restore
dotnet build
dotnet run --project src/ICEDT_TamilApp.Web
```

#### **3. Setup Admin Dashboard (icedt-admin-angular)**
```bash
cd icedt-admin-angular
npm install
ng serve
```

#### **4. Setup Mobile App (trillingo-mobile)**
```bash
cd trillingo-mobile
npm install
npx expo start
```

---

## 📊 **Technology Stack Summary**

| Project | Language | Framework | Database | UI | Platform |
|---------|----------|-----------|----------|----|---------| 
| **icedt-admin-angular** | TypeScript | Angular 19 | N/A | Material Design | Web |
| **ICEDT_TamilApp** | C# | ASP.NET Core 8 | SQLite + AWS S3 | N/A | Server |
| **trillingo-mobile** | TypeScript | React Native | N/A | React Native Paper | Mobile |

---

## 🔧 **Development Tools**

### **Frontend (Angular)**
- Angular CLI 19.0.0
- Angular Material 19.0.0
- SCSS for styling
- Jasmine + Karma for testing

### **Backend (ASP.NET Core)**
- .NET 8.0 SDK
- Entity Framework Core
- Swagger for API documentation
- JWT for authentication

### **Mobile (React Native)**
- Expo SDK 54.0.0
- React Native 0.81.4
- TypeScript 5.1.3
- React Native Paper for UI

---

## 🌐 **API Endpoints**

The backend provides RESTful APIs for:
- User authentication and management
- Learning content management
- Progress tracking
- Media file handling
- Admin operations

**API Documentation**: Available via Swagger UI when running the backend

---

## 📱 **Mobile App Features**

### **Learning Modules**
- Tamil letters learning
- Word building exercises
- Sentence construction
- Progress tracking
- Achievement system

### **UI/UX Features**
- Kid-friendly animated interface
- Beautiful gradient designs
- Interactive learning activities
- Multilingual support (Tamil, English, Sinhala)
- Responsive design

---

## 🔐 **Security Features**

- JWT token authentication
- Password hashing with BCrypt
- Secure API endpoints
- CORS configuration
- Input validation

---

## 📈 **Deployment**

### **Production Deployment**
- **Angular**: Static web hosting (Netlify, Vercel, etc.)
- **ASP.NET Core**: Cloud server (Azure, AWS, etc.)
- **React Native**: Mobile app stores (iOS App Store, Google Play)

### **Environment Configuration**
Each project includes environment-specific configuration files for development, staging, and production environments.

---

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

## 📄 **License**

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 📞 **Support**

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation for each project

---

## 🎯 **Future Enhancements**

- [ ] Advanced analytics dashboard
- [ ] Offline learning capabilities
- [ ] Gamification features
- [ ] Social learning features
- [ ] AI-powered learning recommendations
- [ ] Multi-language expansion

---

*Built with ❤️ for Tamil language education*
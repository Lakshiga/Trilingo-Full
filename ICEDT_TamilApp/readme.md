# ICEDT Tamil Learning App - Backend API

This repository contains the backend source code for the ICEDT Tamil Learning App. It is a modern ASP.NET Core application built using Clean Architecture principles, designed to serve a Flutter-based mobile application and a Razor Pages-based admin panel.

## 1. Project Summary

The primary goal of this project is to provide a robust, scalable, and maintainable backend for a comprehensive Tamil language learning platform. The application is designed to guide users through a structured curriculum, from preschool to Grade 5, tracking their progress and managing all educational content.

### Core Features
- **Clean Architecture:** The solution is separated into `Domain`, `Application`, `Infrastructure`, and `Web` layers for maximum maintainability and testability.
- **RESTful API:** Provides a complete set of endpoints for managing users, content (levels, lessons, activities), and tracking user progress.
- **Admin Panel:** Includes a web-based admin UI built with Razor Pages and modern JavaScript (AJAX) for dynamic, inline management of all application content.
- **Authentication:** A custom JWT-based authentication system for secure user registration and login.
- **Sequential Learning Flow:** The core business logic ensures that users must complete lessons in a predefined order, guiding them through the curriculum effectively.
- **Database Management:** Uses Entity Framework Core for data access, with a complete migration and data seeding workflow.

### Technology Stack
- **Framework:** ASP.NET Core 8
- **Architecture:** Clean Architecture
- **Database:** Entity Framework Core with a SQLite provider (for development) and a MySQL provider (for production).
- **Authentication:** JSON Web Tokens (JWT)
- **Admin UI:** Razor Pages with vanilla JavaScript (AJAX)

---

## 2. Prerequisites

Before you begin, ensure you have the following installed on your development machine:
- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Visual Studio Code](https://code.visualstudio.com/) (or Visual Studio 2022)
- [Git](https://git-scm.com/)

---

## 3. Getting Started & Setup

### Clone the Repository
```bash
git clone https://github.com/UnicomTIC-Jerobert/ICEDT_TamilApp.git
cd ICEDT_TamilApp
```

### Restore Dependencies
The first time you open the project, you need to restore all the NuGet packages.
```bash
dotnet restore
```

---

## 4. Common Development Commands

All commands should be run from the **root directory** of the repository (the one containing `ICEDT_TamilApp.sln`).

### Clean and Build the Project

It's good practice to clean the solution before building to remove any old artifacts.

**To clean the solution:**
```bash
dotnet clean
```

**To build the solution and check for compile-time errors:**
```bash
dotnet build
```
If the build succeeds, your code is syntactically correct and all dependencies are resolved.

### Database Migrations with Entity Framework Core

This project uses EF Core Migrations to manage the database schema.

**To create a new migration:**
After making changes to your entity classes in the `Domain` project or configurations in the `Infrastructure` project, create a new migration.

```bash
# Replace 'YourMigrationName' with a descriptive name (e.g., AddUserAvatarUrl)
dotnet ef migrations add YourMigrationName --project src/ICEDT_TamilApp.Infrastructure --startup-project src/ICEDT_TamilApp.Web
```

**To apply migrations and update your database:**
This command will create the database if it doesn't exist and apply any pending migrations to bring the schema up-to-date.

```bash
dotnet ef database update --startup-project src/ICEDT_TamilApp.Web
```

**To remove the last migration (if you made a mistake):**
```bash
dotnet ef migrations remove --project src/ICEDT_TamilApp.Infrastructure --startup-project src/ICEDT_TamilApp.Web
```

---

## 5. How to Run the Project

Once the project is built and the database is updated, you can run the application.

```bash
dotnet run --project src/ICEDT_TamilApp.Web
```

This command will start the Kestrel web server. The terminal will output the URLs the application is listening on (e.g., `https://localhost:7123` and `http://localhost:5123`).

### Accessing the Application
- **API Documentation (Swagger):** Navigate to `https://localhost:<port>/swagger` in your browser to view and test all the available API endpoints.
- **Admin Panel:** Navigate to `https://localhost:<port>/Admin/Levels` (or other admin pages) to access the web-based management UI.

---

## 6. Project Structure Overview

The solution follows Clean Architecture principles to ensure separation of concerns.

-   **`src/ICEDT_TamilApp.Domain`**: Contains the core business entities and repository interfaces. It has no external dependencies.
-   **`src/ICEDT_TamilApp.Application`**: Contains the application's business logic, services, DTOs, and custom exceptions. It depends only on the `Domain` layer.
-   **`src/ICEDT_TamilApp.Infrastructure`**: Contains the implementation details for external concerns, such as the database context (EF Core), repository implementations, and data seeding. It depends on the `Application` layer.
-   **`src/ICEDT_TamilApp.Web`**: The entry point of the application. It contains the API Controllers, Razor Pages for the admin panel, middleware, and DI configuration. It depends on all other layers.
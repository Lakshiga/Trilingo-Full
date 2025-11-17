# 🚀 Complete AWS Deployment Guide - Trilingo Learning App

## 📋 Table of Contents

1. [Overview](#overview)
2. [Architecture Diagram](#architecture-diagram)
3. [AWS Services Used](#aws-services-used)
4. [Complete Setup Flow](#complete-setup-flow)
5. [Service-by-Service Setup](#service-by-service-setup)
6. [How Everything Connects](#how-everything-connects)
7. [Data Flow](#data-flow)
8. [Configuration Details](#configuration-details)
9. [Deployment Process](#deployment-process)
10. [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

**Trilingo Learning App** is a full-stack application deployed on AWS with the following architecture:

- **Frontend (Angular)**: Hosted on S3, served via CloudFront CDN
- **Backend (ASP.NET Core)**: Running on EC2 instance
- **Database (SQL Server)**: AWS RDS SQL Server
- **File Storage**: S3 bucket for profile images and static assets
- **CDN**: CloudFront for fast global content delivery

**Production URL**: `https://d3v81eez8ecmto.cloudfront.net`

---

## 🏗️ Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         INTERNET USERS                          │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ HTTPS
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    CLOUDFRONT CDN (d3v81eez8ecmto.cloudfront.net)│
│  • Global Edge Locations                                        │
│  • SSL/TLS Termination                                          │
│  • Caching & Compression                                        │
└────────────┬───────────────────────────────┬────────────────────┘
             │                               │
             │                               │
    ┌────────▼────────┐            ┌────────▼────────┐
    │   S3 BUCKET     │            │   EC2 INSTANCE  │
    │  (Frontend)     │            │   (Backend API) │
    │                 │            │                 │
    │ • index.html    │            │ • ASP.NET Core  │
    │ • JS/CSS files  │            │ • Port 5166     │
    │ • Assets        │            │ • PM2 Process   │
    └─────────────────┘            └────────┬────────┘
                                            │
                                            │ SQL Connection
                                            │ (Port 1433)
                                            ▼
                                  ┌─────────────────┐
                                  │   RDS SQL SERVER│
                                  │                 │
                                  │ • Database      │
                                  │ • User Data     │
                                  │ • App Data      │
                                  └─────────────────┘
```

---

## 🔧 AWS Services Used

### 1. **Amazon S3 (Simple Storage Service)**
**Purpose**: 
- Store Angular frontend build files (HTML, CSS, JS)
- Store user profile images and static assets
- Act as origin for CloudFront distribution

**Why S3?**
- ✅ Highly scalable and durable storage
- ✅ Low cost for static website hosting
- ✅ Integrates seamlessly with CloudFront
- ✅ Supports versioning and lifecycle policies

**Configuration:**
- **Bucket Name**: `my-project-data-us-east-1-easyapps-trilingo-2026`
- **Region**: `ap-southeast-1` (Singapore)
- **Public Access**: Enabled for static website hosting
- **CORS**: Configured to allow CloudFront access

---

### 2. **Amazon CloudFront (CDN)**
**Purpose**:
- Serve frontend files from edge locations globally
- Provide HTTPS/SSL certificate
- Cache static content for faster loading
- Route API requests to EC2 backend

**Why CloudFront?**
- ✅ Global content delivery (low latency)
- ✅ Free SSL certificate (HTTPS)
- ✅ DDoS protection
- ✅ Custom domain support
- ✅ Origin failover capabilities

**Configuration:**
- **Distribution ID**: `d3v81eez8ecmto`
- **Domain**: `d3v81eez8ecmto.cloudfront.net`
- **Origins**:
  - **Origin 1**: S3 bucket (for frontend files)
  - **Origin 2**: EC2 instance (for API requests)
- **Behaviors**:
  - `/api/*` → Routes to EC2 backend
  - `/*` → Routes to S3 bucket (frontend)

---

### 3. **Amazon EC2 (Elastic Compute Cloud)**
**Purpose**:
- Host ASP.NET Core backend API
- Process business logic
- Handle authentication (JWT)
- Serve API endpoints

**Why EC2?**
- ✅ Full control over server environment
- ✅ Supports .NET Core runtime
- ✅ Can install custom software
- ✅ Cost-effective for small to medium traffic
- ✅ Easy to scale vertically

**Configuration:**
- **Instance Type**: t2.micro or t3.small
- **OS**: Amazon Linux 2
- **Region**: `ap-southeast-1`
- **Public IP**: `13.250.26.7`
- **Port**: `5166` (HTTP)
- **Process Manager**: PM2
- **Runtime**: .NET 9.0

---

### 4. **Amazon RDS (Relational Database Service)**
**Purpose**:
- Store application data (users, activities, exercises)
- Manage database with automated backups
- Provide high availability

**Why RDS?**
- ✅ Managed database service (no server management)
- ✅ Automated backups and patching
- ✅ High availability options
- ✅ Security groups for network isolation
- ✅ Point-in-time recovery

**Configuration:**
- **Engine**: SQL Server Express/Standard
- **Endpoint**: `trilingo-database.cxss80scuxgx.ap-southeast-1.rds.amazonaws.com`
- **Port**: `1433`
- **Database Name**: `Trilingo_Learning_Db`
- **Region**: `ap-southeast-1`
- **Security Group**: Allows port 1433 from EC2 security group

---

## 📝 Complete Setup Flow

### Phase 1: AWS Account & Prerequisites

1. **Create AWS Account**
   - Sign up at https://aws.amazon.com
   - Set up billing alerts
   - Create IAM user with programmatic access

2. **Install AWS CLI**
   ```bash
   # Windows (PowerShell)
   winget install Amazon.AWSCLI
   
   # Linux/Mac
   curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
   unzip awscliv2.zip
   sudo ./aws/install
   ```

3. **Configure AWS Credentials**
   ```bash
   aws configure
   # Enter Access Key ID
   # Enter Secret Access Key
   # Enter region: ap-southeast-1
   # Enter output format: json
   ```

---

### Phase 2: RDS Database Setup

#### Step 1: Create RDS SQL Server Instance

1. **Go to AWS Console** → **RDS** → **Databases** → **Create database**

2. **Database Configuration:**
   - **Engine**: Microsoft SQL Server
   - **Edition**: SQL Server Express (Free tier) or Standard
   - **Version**: Latest available
   - **Template**: Free tier or Production

3. **Settings:**
   - **DB Instance Identifier**: `trilingo-database`
   - **Master Username**: `admin`
   - **Master Password**: `Lachchu_16` (or your secure password)

4. **Instance Configuration:**
   - **Instance Class**: `db.t3.micro` (Free tier) or `db.t3.small`
   - **Storage**: 20 GB (General Purpose SSD)

5. **Connectivity:**
   - **VPC**: Default VPC or your custom VPC
   - **Public Access**: `No` (for security) or `Yes` (if needed)
   - **VPC Security Group**: Create new or use existing
   - **Availability Zone**: `ap-southeast-1a` (or any)

6. **Database Authentication:**
   - **Database Authentication**: SQL Server Authentication

7. **Additional Configuration:**
   - **Initial Database Name**: `Trilingo_Learning_Db`
   - **Backup Retention**: 7 days
   - **Enable Encryption**: Yes (recommended)

8. **Click "Create database"**
   - Wait 10-15 minutes for database to be available

#### Step 2: Configure Security Group

1. **Go to RDS Console** → Select your database → **Connectivity & security** tab

2. **Click on Security Group** (e.g., `rds-ec2-1`)

3. **Edit Inbound Rules:**
   - **Type**: `MSSQL`
   - **Port**: `1433`
   - **Source**: 
     - Option A: Your EC2 security group ID (recommended)
     - Option B: `0.0.0.0/0` (for testing only - less secure)

4. **Save Rules**

#### Step 3: Get Database Endpoint

After database is created, note the endpoint:
```
trilingo-database.cxss80scuxgx.ap-southeast-1.rds.amazonaws.com
```

---

### Phase 3: EC2 Instance Setup

#### Step 1: Launch EC2 Instance

1. **Go to AWS Console** → **EC2** → **Instances** → **Launch Instance**

2. **Name**: `trilingo-backend-server`

3. **AMI (Amazon Machine Image):**
   - **Amazon Linux 2023** or **Amazon Linux 2**
   - Architecture: 64-bit (x86)

4. **Instance Type:**
   - **t2.micro** (Free tier eligible)
   - **t3.small** (for better performance)

5. **Key Pair:**
   - Create new key pair: `backend-key`
   - Download `.pem` file
   - Save securely (e.g., `C:\Users\ASUS\Downloads\backend-key.pem`)

6. **Network Settings:**
   - **VPC**: Default VPC
   - **Subnet**: Any public subnet
   - **Auto-assign Public IP**: Enable
   - **Security Group**: Create new
     - **Name**: `trilingo-backend-sg`
     - **Inbound Rules**:
       - **SSH (22)**: Your IP or `0.0.0.0/0` (for testing)
       - **HTTP (5166)**: `0.0.0.0/0` (for API access)
       - **HTTPS (443)**: `0.0.0.0/0` (optional)

7. **Storage**: 8 GB (gp3)

8. **Click "Launch Instance"**

#### Step 2: Connect to EC2 Instance

**Windows (PowerShell):**
```powershell
# Fix PEM file permissions
icacls "C:\Users\ASUS\Downloads\backend-key.pem" /inheritance:r
icacls "C:\Users\ASUS\Downloads\backend-key.pem" /grant:r "$env:USERNAME:R"

# SSH to EC2
ssh -i "C:\Users\ASUS\Downloads\backend-key.pem" ec2-user@13.250.26.7
```

**Linux/Mac:**
```bash
# Fix PEM file permissions
chmod 400 backend-key.pem

# SSH to EC2
ssh -i backend-key.pem ec2-user@13.250.26.7
```

#### Step 3: Install Required Software on EC2

```bash
# Update system
sudo yum update -y

# Install .NET 9.0 SDK
sudo rpm --import https://packages.microsoft.com/keys/microsoft.asc
sudo dnf install -y https://packages.microsoft.com/config/amazonlinux/2023/packages-microsoft-prod.rpm
sudo dnf install -y dotnet-sdk-9.0

# Install Node.js and PM2 (for process management)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 20
nvm use 20
npm install -g pm2

# Verify installations
dotnet --version
node --version
pm2 --version
```

#### Step 4: Upload Backend Code to EC2

**Option A: Using SCP (from local machine)**
```powershell
# Windows PowerShell
scp -i "C:\Users\ASUS\Downloads\backend-key.pem" -r Trilingo_Learning_App_Backend ec2-user@13.250.26.7:/home/ec2-user/
```

**Option B: Using Git (on EC2)**
```bash
# On EC2
cd ~
git clone <your-repo-url>
cd Trilingo_Learning_App_Backend
```

#### Step 5: Build and Run Backend on EC2

```bash
# Navigate to API project
cd ~/Trilingo_Learning_App_Backend/TES_Learning_App.API

# Build the project
dotnet build -c Release

# Publish the application
dotnet publish -c Release -o ~/Trilingo_Learning_App_Backend/publish

# Set database connection string
export DATABASE_CONNECTION_STRING="Server=trilingo-database.cxss80scuxgx.ap-southeast-1.rds.amazonaws.com,1433;Database=Trilingo_Learning_Db;User Id=admin;Password=Lachchu_16;Encrypt=true;TrustServerCertificate=true;Connection Timeout=30;MultipleActiveResultSets=true;"

# Make it permanent
echo "export DATABASE_CONNECTION_STRING=\"$DATABASE_CONNECTION_STRING\"" >> ~/.bashrc
source ~/.bashrc

# Start with PM2
cd ~/Trilingo_Learning_App_Backend/publish
pm2 start "dotnet TES_Learning_App.API.dll --urls http://0.0.0.0:5166" --name trilingo-backend
pm2 save
pm2 startup  # Follow instructions to enable auto-start on reboot

# Check status
pm2 status
pm2 logs trilingo-backend
```

#### Step 6: Test Backend API

```bash
# Test from EC2
curl http://localhost:5166/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"identifier":"admin","password":"Admin123!"}'

# Test from local machine
curl http://13.250.26.7:5166/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"identifier":"admin","password":"Admin123!"}'
```

---

### Phase 4: S3 Bucket Setup

#### Step 1: Create S3 Bucket

1. **Go to AWS Console** → **S3** → **Create bucket**

2. **Bucket Configuration:**
   - **Bucket Name**: `my-project-data-us-east-1-easyapps-trilingo-2026`
   - **Region**: `ap-southeast-1` (Singapore)
   - **Object Ownership**: ACLs disabled (recommended)

3. **Block Public Access:**
   - **Uncheck** "Block all public access" (needed for static website hosting)
   - Acknowledge the warning

4. **Bucket Versioning**: Disabled (optional)

5. **Default Encryption**: Enabled (SSE-S3)

6. **Click "Create bucket"**

#### Step 2: Configure Bucket for Static Website Hosting

1. **Select your bucket** → **Properties** tab

2. **Scroll to "Static website hosting"** → **Edit**

3. **Enable static website hosting:**
   - **Hosting type**: Enable
   - **Index document**: `index.html`
   - **Error document**: `index.html` (for Angular routing)

4. **Save changes**

#### Step 3: Configure Bucket Policy (Public Read Access)

1. **Select your bucket** → **Permissions** tab → **Bucket policy** → **Edit**

2. **Add this policy:**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::my-project-data-us-east-1-easyapps-trilingo-2026/*"
    }
  ]
}
```

3. **Save changes**

#### Step 4: Configure CORS (if needed)

1. **Select your bucket** → **Permissions** tab → **Cross-origin resource sharing (CORS)** → **Edit**

2. **Add CORS configuration:**
```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "HEAD"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": []
  }
]
```

3. **Save changes**

---

### Phase 5: CloudFront Distribution Setup

#### Step 1: Create CloudFront Distribution

1. **Go to AWS Console** → **CloudFront** → **Create Distribution**

2. **Origin Settings:**

   **Origin 1 - S3 Bucket (Frontend):**
   - **Origin Domain**: Select your S3 bucket
     - `my-project-data-us-east-1-easyapps-trilingo-2026.s3.ap-southeast-1.amazonaws.com`
   - **Origin Path**: Leave empty (files are in root)
   - **Name**: `S3-Trilingo-Frontend`
   - **Origin Access**: 
     - **Origin Access Control**: Create new OAC
       - **Name**: `trilingo-s3-oac`
       - **Signing behavior**: Sign requests
       - **Origin type**: S3
   - **Origin Shield**: Disabled

   **Origin 2 - EC2 Backend (API):**
   - **Origin Domain**: `13.250.26.7` (EC2 public IP)
   - **Origin Path**: Leave empty
   - **Name**: `EC2-Trilingo-Backend`
   - **Protocol**: HTTP only
   - **HTTP Port**: `5166`
   - **Origin Shield**: Disabled

3. **Default Cache Behavior:**
   - **Path Pattern**: `*` (default)
   - **Origin**: `S3-Trilingo-Frontend`
   - **Viewer Protocol Policy**: `Redirect HTTP to HTTPS`
   - **Allowed HTTP Methods**: `GET, HEAD, OPTIONS`
   - **Cache Policy**: `CachingOptimized`
   - **Origin Request Policy**: None
   - **Response Headers Policy**: None

4. **Additional Behaviors:**

   **Create Behavior for API:**
   - **Path Pattern**: `/api/*`
   - **Origin**: `EC2-Trilingo-Backend`
   - **Viewer Protocol Policy**: `Redirect HTTP to HTTPS`
   - **Allowed HTTP Methods**: `GET, HEAD, OPTIONS, PUT, POST, PATCH, DELETE`
   - **Cache Policy**: `CachingDisabled` (API should not be cached)
   - **Origin Request Policy**: None
   - **Response Headers Policy**: None

5. **Distribution Settings:**
   - **Price Class**: `Use all edge locations` (or `Use only North America and Europe` for cost savings)
   - **Alternate Domain Names (CNAMEs)**: Leave empty (or add custom domain)
   - **SSL Certificate**: `Default CloudFront Certificate`
   - **Default Root Object**: `index.html`
   - **Custom Error Responses**: 
     - **HTTP Error Code**: `403`
     - **Response Page Path**: `/index.html`
     - **HTTP Response Code**: `200`
     - **Error Caching Minimum TTL**: `10`
   - **Comment**: `Trilingo Learning App Distribution`

6. **Click "Create Distribution"**
   - Wait 15-20 minutes for distribution to deploy
   - Note the **Distribution Domain Name**: `d3v81eez8ecmto.cloudfront.net`

#### Step 2: Update S3 Bucket Policy for OAC

After creating CloudFront distribution with OAC:

1. **Go to CloudFront** → Select your distribution → **Origins** tab
2. **Click on S3 origin** → Note the **Origin Access Control ID**
3. **Go to S3** → Select your bucket → **Permissions** → **Bucket policy** → **Edit**
4. **Update policy to include OAC:**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowCloudFrontServicePrincipal",
      "Effect": "Allow",
      "Principal": {
        "Service": "cloudfront.amazonaws.com"
      },
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::my-project-data-us-east-1-easyapps-trilingo-2026/*",
      "Condition": {
        "StringEquals": {
          "AWS:SourceArn": "arn:aws:cloudfront::YOUR_ACCOUNT_ID:distribution/YOUR_DISTRIBUTION_ID"
        }
      }
    }
  ]
}
```
Replace `YOUR_ACCOUNT_ID` and `YOUR_DISTRIBUTION_ID` with actual values.

---

### Phase 6: Frontend Deployment

#### Step 1: Build Angular Application

```bash
# Navigate to Angular project
cd trilingo-admin-angular

# Install dependencies
npm install

# Build for production with CloudFront configuration
npm run build:cloudfront
```

**Build Output**: `dist/trilingo-admin-angular/`

#### Step 2: Upload to S3

**Option A: Using AWS CLI**
```bash
# From Angular project directory
aws s3 sync dist/trilingo-admin-angular/ s3://my-project-data-us-east-1-easyapps-trilingo-2026/ --delete --region ap-southeast-1
```

**Option B: Using PowerShell Script**
```powershell
# Run from Angular project directory
.\deploy-to-s3.ps1
```

**Option C: Manual Upload**
1. Go to S3 Console → Select your bucket
2. Click "Upload"
3. Upload all files from `dist/trilingo-admin-angular/`
4. Make sure files are in bucket **root** (not in subfolder)

#### Step 3: Invalidate CloudFront Cache

```bash
# Create invalidation to clear cache
aws cloudfront create-invalidation \
  --distribution-id d3v81eez8ecmto \
  --paths "/*"
```

Or via AWS Console:
1. Go to CloudFront → Select your distribution
2. **Invalidations** tab → **Create invalidation**
3. **Object paths**: `/*`
4. **Create invalidation**

Wait 5-10 minutes for invalidation to complete.

#### Step 4: Test Frontend

Open browser: `https://d3v81eez8ecmto.cloudfront.net`

---

## 🔗 How Everything Connects

### Connection Flow

1. **User Request Flow:**
   ```
   User Browser
   → CloudFront (d3v81eez8ecmto.cloudfront.net)
   → Routes based on path:
      - /api/* → EC2 Backend (13.250.26.7:5166)
      - /* → S3 Bucket (Frontend files)
   ```

2. **API Request Flow:**
   ```
   Frontend (Angular)
   → HTTP Request to /api/auth/login
   → CloudFront (routes /api/* to EC2)
   → EC2 Backend (processes request)
   → RDS Database (queries user data)
   → EC2 Backend (returns response)
   → CloudFront (returns to frontend)
   → Frontend (displays result)
   ```

3. **File Upload Flow:**
   ```
   Frontend (user uploads image)
   → API Request to /api/upload
   → EC2 Backend (receives file)
   → S3 Service (uploads to S3 bucket)
   → Returns CloudFront URL
   → Frontend (displays image)
   ```

### Network Architecture

```
Internet
  │
  ├─ CloudFront Distribution (d3v81eez8ecmto.cloudfront.net)
  │   │
  │   ├─ Origin 1: S3 Bucket (Frontend)
  │   │   └─ Static files (HTML, CSS, JS)
  │   │
  │   └─ Origin 2: EC2 Instance (Backend API)
  │       └─ Port 5166 (HTTP)
  │           │
  │           └─ RDS Database (Port 1433)
  │               └─ SQL Server
  │
  └─ Direct Access (Optional)
      └─ EC2 Public IP: 13.250.26.7:5166
```

---

## 📊 Data Flow

### 1. **User Login Flow**

```
1. User enters credentials on login page
   ↓
2. Angular sends POST to /api/auth/login
   ↓
3. CloudFront routes /api/* to EC2 backend
   ↓
4. EC2 backend validates credentials against RDS
   ↓
5. RDS returns user data
   ↓
6. EC2 generates JWT token
   ↓
7. Response sent back through CloudFront
   ↓
8. Angular stores token and redirects to dashboard
```

### 2. **Static File Serving Flow**

```
1. User requests https://d3v81eez8ecmto.cloudfront.net/
   ↓
2. CloudFront checks cache
   ↓
3. If cached: Return from edge location (fast)
   ↓
4. If not cached: Fetch from S3 bucket
   ↓
5. Cache file at edge location
   ↓
6. Return to user
```

### 3. **File Upload Flow**

```
1. User selects image file
   ↓
2. Angular sends file to /api/upload
   ↓
3. EC2 backend receives file
   ↓
4. Backend uses S3Service to upload to S3
   ↓
5. S3 returns file URL
   ↓
6. Backend returns CloudFront URL to frontend
   ↓
7. Frontend displays uploaded image
```

---

## ⚙️ Configuration Details

### Backend Configuration

**File**: `appsettings.Aws.json`
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=trilingo-database.cxss80scuxgx.ap-southeast-1.rds.amazonaws.com,1433;Database=Trilingo_Learning_Db;User Id=admin;Password=Lachchu_16;Encrypt=true;TrustServerCertificate=true;Connection Timeout=30;MultipleActiveResultSets=true;"
  },
  "AWS": {
    "Region": "ap-southeast-1",
    "BucketName": "my-project-data-us-east-1-easyapps-trilingo-2026",
    "CloudFrontUrl": "https://d3v81eez8ecmto.cloudfront.net"
  }
}
```

**Environment Variable on EC2:**
```bash
export DATABASE_CONNECTION_STRING="Server=trilingo-database.cxss80scuxgx.ap-southeast-1.rds.amazonaws.com,1433;Database=Trilingo_Learning_Db;User Id=admin;Password=Lachchu_16;Encrypt=true;TrustServerCertificate=true;Connection Timeout=30;MultipleActiveResultSets=true;"
```

### Frontend Configuration

**File**: `src/environments/environment.prod.ts`
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://d3v81eez8ecmto.cloudfront.net/api',
  awsBaseUrl: 'https://d3v81eez8ecmto.cloudfront.net',
  appName: 'Trillingo Admin Panel'
};
```

### CORS Configuration (Backend)

**File**: `Program.cs`
```csharp
// Production: Allow only CloudFront
options.AddPolicy("AllowCloudFront", policy =>
{
    policy.WithOrigins("https://d3v81eez8ecmto.cloudfront.net")
          .AllowAnyHeader()
          .AllowAnyMethod()
          .AllowCredentials();
});
```

---

## 🚀 Deployment Process

### Initial Deployment

1. **Setup RDS Database** (One-time)
2. **Setup EC2 Instance** (One-time)
3. **Setup S3 Bucket** (One-time)
4. **Setup CloudFront Distribution** (One-time)
5. **Deploy Backend to EC2** (One-time)
6. **Deploy Frontend to S3** (Initial deployment)

### Regular Updates

#### Updating Frontend:

```bash
# 1. Build Angular app
cd trilingo-admin-angular
npm run build:cloudfront

# 2. Upload to S3
aws s3 sync dist/trilingo-admin-angular/ s3://my-project-data-us-east-1-easyapps-trilingo-2026/ --delete --region ap-southeast-1

# 3. Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id d3v81eez8ecmto --paths "/*"
```

#### Updating Backend:

```bash
# 1. Build backend locally
cd Trilingo_Learning_App_Backend/TES_Learning_App.API
dotnet publish -c Release -o publish

# 2. Upload to EC2
scp -i backend-key.pem -r publish/* ec2-user@13.250.26.7:/home/ec2-user/Trilingo_Learning_App_Backend/publish/

# 3. SSH to EC2 and restart
ssh -i backend-key.pem ec2-user@13.250.26.7
pm2 restart trilingo-backend
```

---

## 🔍 Troubleshooting

### Common Issues

#### 1. **403 Forbidden Error on CloudFront**

**Problem**: CloudFront returns 403 when accessing frontend

**Solution**:
- Check S3 bucket policy allows CloudFront OAC
- Verify CloudFront origin path is correct (should be empty for root)
- Check custom error responses (403 → 200 with index.html)

#### 2. **Database Connection Error**

**Problem**: Backend cannot connect to RDS

**Solution**:
- Verify RDS security group allows port 1433 from EC2 security group
- Check connection string is correct
- Ensure `TrustServerCertificate=true` in connection string
- Verify RDS instance is in "Available" status

#### 3. **CORS Error**

**Problem**: Frontend cannot call API

**Solution**:
- Verify CORS policy in backend allows CloudFront origin
- Check CloudFront behavior routes `/api/*` to EC2
- Ensure credentials are included in requests

#### 4. **API Returns 502 Bad Gateway**

**Problem**: CloudFront cannot reach EC2 backend

**Solution**:
- Verify EC2 instance is running
- Check EC2 security group allows port 5166 from CloudFront
- Test direct access: `curl http://13.250.26.7:5166/api/health`
- Check PM2 logs: `pm2 logs trilingo-backend`

#### 5. **Files Not Updating After Deployment**

**Problem**: Changes not visible after uploading to S3

**Solution**:
- Create CloudFront invalidation for `/*`
- Wait 5-10 minutes for cache to clear
- Check browser cache (hard refresh: Ctrl+Shift+R)

---

## 📋 Summary

### Services Summary

| Service | Purpose | Cost | Region |
|---------|---------|------|--------|
| **S3** | Frontend hosting, file storage | ~$0.023/GB/month | ap-southeast-1 |
| **CloudFront** | CDN, SSL, routing | ~$0.085/GB transfer | Global |
| **EC2** | Backend API server | ~$10-15/month (t3.small) | ap-southeast-1 |
| **RDS** | SQL Server database | ~$15-30/month (db.t3.small) | ap-southeast-1 |

### Key URLs

- **Frontend**: `https://d3v81eez8ecmto.cloudfront.net`
- **Backend API**: `https://d3v81eez8ecmto.cloudfront.net/api`
- **Direct Backend**: `http://13.250.26.7:5166/api`
- **RDS Endpoint**: `trilingo-database.cxss80scuxgx.ap-southeast-1.rds.amazonaws.com`

### Security Best Practices

1. ✅ Use security groups to restrict access
2. ✅ Enable encryption at rest (RDS, S3)
3. ✅ Use HTTPS (CloudFront SSL)
4. ✅ Store secrets in environment variables
5. ✅ Regular backups (RDS automated backups)
6. ✅ Keep software updated
7. ✅ Use IAM roles instead of access keys when possible

---

## ✅ Checklist

- [ ] AWS account created and configured
- [ ] RDS SQL Server instance created and accessible
- [ ] EC2 instance launched and configured
- [ ] Backend deployed and running on EC2
- [ ] S3 bucket created and configured for static hosting
- [ ] CloudFront distribution created with both origins
- [ ] Frontend built and deployed to S3
- [ ] CloudFront cache invalidated
- [ ] All services tested and working
- [ ] Security groups properly configured
- [ ] Monitoring and alerts set up

---

**🎉 Congratulations! Your Trilingo Learning App is now fully deployed on AWS!**

For questions or issues, refer to the troubleshooting section or AWS documentation.

# AWS Deployment Guide

This guide explains how to deploy the Trilingo Learning App backend to AWS.

## Prerequisites

1. AWS Account
2. AWS RDS SQL Server instance
3. AWS Elastic Beanstalk application (optional)
4. AWS CLI configured

## Database Setup

### 1. Create RDS SQL Server Instance

1. Go to AWS RDS Console
2. Create a new SQL Server instance
3. Configure the following settings:
   - Engine: SQL Server Express Edition
   - Version: Latest available
   - DB Instance Identifier: trilingo-learning-db
   - Master Username: your-username
   - Master Password: your-strong-password
   - DB Instance Class: db.t3.micro (for development)
   - Allocated Storage: 20GB
   - Public Access: Yes (for development, No for production)
   - VPC Security Group: Create new or use existing

### 2. Configure Database Connection

Update the connection string in your deployment:

```
Server=your-rds-endpoint.region.rds.amazonaws.com,1433;Database=Trilingo_Learning_Db;User Id=your-username;Password=your-password;Encrypt=true;TrustServerCertificate=false;
```

Replace:
- `your-rds-endpoint.region.rds.amazonaws.com` with your actual RDS endpoint
- `your-username` with your database username
- `your-password` with your database password

## Environment Variables

Set the following environment variable in your AWS environment:

```
DATABASE_CONNECTION_STRING=Server=your-rds-endpoint.region.rds.amazonaws.com,1433;Database=Trilingo_Learning_Db;User Id=your-username;Password=your-password;Encrypt=true;TrustServerCertificate=false;
```

## Deployment Options

### Option 1: AWS Elastic Beanstalk

1. Create a new Elastic Beanstalk application
2. Choose .NET Core platform
3. Upload your compiled backend application
4. Set environment variables in the EB console
5. Deploy the application

### Option 2: AWS EC2

1. Launch a Windows Server EC2 instance
2. Install .NET 9 SDK
3. Install IIS
4. Deploy the application to IIS
5. Configure environment variables
6. Set up reverse proxy if needed

### Option 3: AWS ECS/Fargate

1. Containerize the application using Docker
2. Push the image to Amazon ECR
3. Create ECS task definition
4. Deploy to ECS cluster

## Security Considerations

1. Never hardcode credentials in the source code
2. Use AWS Secrets Manager or Parameter Store for sensitive data
3. Restrict database access using security groups
4. Use IAM roles for EC2/ECS instances
5. Enable encryption at rest and in transit

## Monitoring

1. Enable CloudWatch logging
2. Set up CloudWatch alarms for critical metrics
3. Use AWS X-Ray for distributed tracing

## Troubleshooting

### Connection Issues

1. Verify the RDS instance is in a public subnet (for development)
2. Check security group rules allow inbound connections on port 1433
3. Ensure the database is not paused (for serverless instances)
4. Verify the connection string format

### Database Migration Issues

1. Run database migrations manually if automatic migration fails
2. Check if the database user has sufficient permissions
3. Verify the database exists and is accessible

## Sample Connection String

For production use:

```
Server=trilingo-learning-db.cluster-xxxxxxxxxxxx.region.rds.amazonaws.com,1433;Database=Trilingo_Learning_Db;User Id=admin;Password=YourSecurePassword123!;Encrypt=true;TrustServerCertificate=false;Connection Timeout=30;
```
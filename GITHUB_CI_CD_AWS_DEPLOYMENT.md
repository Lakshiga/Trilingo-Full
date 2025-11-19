# Complete GitHub to AWS CI/CD Deployment Guide

This guide will help you set up automatic deployment from GitHub to AWS using GitHub Actions. When you push code to GitHub, it will automatically deploy to your AWS infrastructure (EC2, S3, CloudFront).

## 📋 Prerequisites

1. **GitHub Repository**: Your code should be in a GitHub repository
2. **AWS Account**: With EC2, S3, CloudFront, and IAM access
3. **EC2 Instance**: Running your backend (currently at `13.250.26.7`)
4. **S3 Bucket**: For storing frontend/admin panel files
5. **CloudFront Distribution**: For CDN (currently `d3v81eez8ecmto.cloudfront.net`)

## 🔐 Step 1: Create AWS IAM User for CI/CD

1. **Go to AWS IAM Console**:
   - Navigate to: https://console.aws.amazon.com/iam/
   - Click "Users" → "Add users"

2. **Create User**:
   - Username: `github-actions-deployer`
   - Access type: "Programmatic access"
   - Click "Next"

3. **Attach Policies**:
   - Click "Attach policies directly"
   - Select these policies:
     - `AmazonS3FullAccess` (or create custom policy for your bucket only)
     - `CloudFrontFullAccess` (or create custom policy)
     - `AmazonEC2FullAccess` (or create custom policy for your instance only)
   - Click "Next" → "Create user"

4. **Save Credentials**:
   - **Access Key ID**: Copy this
   - **Secret Access Key**: Copy this (you won't see it again!)
   - ⚠️ **IMPORTANT**: Save these securely - you'll need them for GitHub Secrets

## 🔑 Step 2: Add GitHub Secrets

1. **Go to Your GitHub Repository**:
   - Navigate to: `https://github.com/YOUR_USERNAME/YOUR_REPO`

2. **Open Settings**:
   - Click "Settings" tab
   - Click "Secrets and variables" → "Actions"

3. **Add Repository Secrets**:
   Click "New repository secret" and add these:

   ```
   Name: AWS_ACCESS_KEY_ID
   Value: [Your Access Key ID from Step 1]
   ```

   ```
   Name: AWS_SECRET_ACCESS_KEY
   Value: [Your Secret Access Key from Step 1]
   ```

   ```
   Name: AWS_REGION
   Value: ap-southeast-1
   ```

   ```
   Name: EC2_HOST
   Value: 13.250.26.7
   ```

   ```
   Name: EC2_USER
   Value: ec2-user
   ```

   ```
   Name: EC2_SSH_KEY
   Value: [Your EC2 private key content - see below]
   ```

   ```
   Name: S3_BUCKET_NAME
   Value: [Your S3 bucket name, e.g., trilingo-admin-panel]
   ```

   ```
   Name: CLOUDFRONT_DISTRIBUTION_ID
   Value: [Your CloudFront Distribution ID]
   ```

   ```
   Name: EC2_BACKEND_PATH
   Value: /home/ec2-user/Trilingo_Learning_App_Backend
   ```

### Getting EC2 SSH Key:

1. **If you have the `.pem` file**:
   - Open it in a text editor
   - Copy the entire content (including `-----BEGIN RSA PRIVATE KEY-----` and `-----END RSA PRIVATE KEY-----`)
   - Paste it as the value for `EC2_SSH_KEY`

2. **If you don't have the key**:
   - You'll need to create a new key pair in EC2
   - Or use an existing key pair that has access to your EC2 instance

## 📁 Step 3: Create GitHub Actions Workflow Files

Create these workflow files in your repository:

### 3.1 Backend Deployment Workflow

Create: `.github/workflows/deploy-backend.yml`

```yaml
name: Deploy Backend to EC2

on:
  push:
    branches:
      - main
      - master
    paths:
      - 'Trilingo_Learning_App_Backend/**'
      - '.github/workflows/deploy-backend.yml'
  workflow_dispatch: # Allows manual trigger

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup .NET
        uses: actions/setup-dotnet@v4
        with:
          dotnet-version: '9.0.x'

      - name: Setup SSH
        run: |
          mkdir -p ~/.ssh
          echo "${{ secrets.EC2_SSH_KEY }}" > ~/.ssh/ec2_key.pem
          chmod 600 ~/.ssh/ec2_key.pem
          ssh-keyscan -H ${{ secrets.EC2_HOST }} >> ~/.ssh/known_hosts

      - name: Build Backend
        run: |
          cd Trilingo_Learning_App_Backend/TES_Learning_App.API
          dotnet restore
          dotnet build --configuration Release

      - name: Deploy to EC2
        env:
          EC2_HOST: ${{ secrets.EC2_HOST }}
          EC2_USER: ${{ secrets.EC2_USER }}
          EC2_BACKEND_PATH: ${{ secrets.EC2_BACKEND_PATH }}
        run: |
          # Create deployment script
          cat > deploy.sh << 'EOF'
          #!/bin/bash
          set -e
          
          cd $EC2_BACKEND_PATH
          
          # Pull latest code (if using git on EC2)
          # git pull origin main
          
          # Or copy files from GitHub Actions
          # Files will be copied in next step
          
          # Restore and build
          cd TES_Learning_App.API
          dotnet restore
          dotnet build --configuration Release
          
          # Restart backend service
          pm2 restart trilingo-backend --update-env || pm2 start "dotnet run --configuration Release" --name trilingo-backend
          
          echo "Backend deployed successfully!"
          EOF
          
          # Copy files to EC2
          scp -i ~/.ssh/ec2_key.pem -r Trilingo_Learning_App_Backend/* $EC2_USER@$EC2_HOST:$EC2_BACKEND_PATH/
          
          # Execute deployment script on EC2
          ssh -i ~/.ssh/ec2_key.pem $EC2_USER@$EC2_HOST 'bash -s' < deploy.sh

      - name: Cleanup
        if: always()
        run: |
          rm -f ~/.ssh/ec2_key.pem
```

### 3.2 Frontend/Admin Panel Deployment Workflow

Create: `.github/workflows/deploy-frontend.yml`

```yaml
name: Deploy Frontend to S3 and CloudFront

on:
  push:
    branches:
      - main
      - master
    paths:
      - 'trilingo-admin-angular/**'
      - '.github/workflows/deploy-frontend.yml'
  workflow_dispatch: # Allows manual trigger

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20.x'

      - name: Install dependencies
        run: |
          cd trilingo-admin-angular
          npm ci

      - name: Build for CloudFront
        run: |
          cd trilingo-admin-angular
          npm run build:cloudfront

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ secrets.AWS_REGION }}

      - name: Deploy to S3
        run: |
          aws s3 sync trilingo-admin-angular/dist/trilingo-admin-angular/browser/ \
            s3://${{ secrets.S3_BUCKET_NAME }} \
            --delete \
            --cache-control "public, max-age=31536000, immutable" \
            --exclude "*.html" \
            --exclude "*.json"
          
          aws s3 sync trilingo-admin-angular/dist/trilingo-admin-angular/browser/ \
            s3://${{ secrets.S3_BUCKET_NAME }} \
            --delete \
            --cache-control "public, max-age=0, must-revalidate" \
            --include "*.html" \
            --include "*.json"

      - name: Invalidate CloudFront cache
        run: |
          aws cloudfront create-invalidation \
            --distribution-id ${{ secrets.CLOUDFRONT_DISTRIBUTION_ID }} \
            --paths "/*"
```

### 3.3 Mobile App Build Workflow (Optional)

Create: `.github/workflows/build-mobile.yml`

```yaml
name: Build Mobile App

on:
  push:
    branches:
      - main
      - master
    paths:
      - 'trilingo--mobile-/**'
      - '.github/workflows/build-mobile.yml'
  workflow_dispatch:

jobs:
  build-mobile:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20.x'

      - name: Setup Expo
        uses: expo/expo-github-action@v8
        with:
          expo-version: latest
          token: ${{ secrets.EXPO_TOKEN }}

      - name: Install dependencies
        run: |
          cd trilingo--mobile-
          npm ci

      - name: Build Android APK
        run: |
          cd trilingo--mobile-
          eas build --platform android --profile production --non-interactive
        env:
          EXPO_TOKEN: ${{ secrets.EXPO_TOKEN }}

      - name: Upload build artifact
        uses: actions/upload-artifact@v4
        with:
          name: android-apk
          path: trilingo--mobile-/*.apk
          retention-days: 30
```

## 🔧 Step 4: Prepare EC2 Instance

SSH into your EC2 instance and run these commands:

```bash
# Install .NET SDK if not already installed
sudo yum update -y
sudo yum install -y dotnet-sdk-9.0

# Install PM2 if not already installed
npm install -g pm2

# Create directory structure
mkdir -p /home/ec2-user/Trilingo_Learning_App_Backend

# Set up PM2 startup script
pm2 startup
# Follow the instructions it provides

# Ensure backend is running
cd /home/ec2-user/Trilingo_Learning_App_Backend/TES_Learning_App.API
pm2 start "dotnet run --configuration Release" --name trilingo-backend
pm2 save
```

## 📝 Step 5: Update package.json Scripts

### For Admin Panel (`trilingo-admin-angular/package.json`):

Add this script:

```json
{
  "scripts": {
    "build:cloudfront": "ng build --configuration production --base-href /"
  }
}
```

## 🚀 Step 6: Test the Deployment

1. **Make a small change** to your code (e.g., update a comment)

2. **Commit and push**:
   ```bash
   git add .
   git commit -m "Test CI/CD deployment"
   git push origin main
   ```

3. **Check GitHub Actions**:
   - Go to your repository on GitHub
   - Click "Actions" tab
   - You should see the workflow running
   - Click on it to see the progress

4. **Verify Deployment**:
   - **Backend**: Check if backend is running on EC2
   - **Frontend**: Check if changes are visible on CloudFront URL

## 🔍 Step 7: Monitoring and Troubleshooting

### View Logs:

**GitHub Actions Logs**:
- Go to repository → Actions → Click on workflow run → Click on job → View logs

**EC2 Backend Logs**:
```bash
ssh ec2-user@13.250.26.7
pm2 logs trilingo-backend
```

**CloudFront Logs**:
- AWS Console → CloudFront → Your Distribution → Monitoring tab

### Common Issues:

1. **SSH Connection Failed**:
   - Check EC2 security group allows SSH from GitHub Actions IPs
   - Verify SSH key is correct in GitHub Secrets
   - Ensure EC2 instance is running

2. **S3 Upload Failed**:
   - Verify AWS credentials in GitHub Secrets
   - Check S3 bucket name is correct
   - Ensure IAM user has S3 permissions

3. **CloudFront Invalidation Failed**:
   - Verify Distribution ID in GitHub Secrets
   - Check IAM user has CloudFront permissions

4. **Backend Build Failed**:
   - Check .NET SDK version matches
   - Verify all dependencies are restored
   - Check EC2 has enough disk space

## 🔐 Step 8: Security Best Practices

1. **Use Least Privilege IAM Policy**:
   Instead of full access, create custom policies:

   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": [
           "s3:PutObject",
           "s3:GetObject",
           "s3:DeleteObject",
           "s3:ListBucket"
         ],
         "Resource": [
           "arn:aws:s3:::YOUR_BUCKET_NAME/*",
           "arn:aws:s3:::YOUR_BUCKET_NAME"
         ]
       },
       {
         "Effect": "Allow",
         "Action": [
           "cloudfront:CreateInvalidation"
         ],
         "Resource": "*"
       }
     ]
   }
   ```

2. **Rotate Credentials Regularly**:
   - Update GitHub Secrets every 90 days
   - Use AWS IAM Access Key rotation

3. **Enable Branch Protection**:
   - GitHub → Settings → Branches → Add rule
   - Require pull request reviews
   - Require status checks to pass

## 📊 Step 9: Advanced Features

### Deploy Only on Tags:

Update workflow triggers:

```yaml
on:
  push:
    tags:
      - 'v*'
```

### Deploy to Different Environments:

Create separate workflows for staging and production:

```yaml
# .github/workflows/deploy-staging.yml
on:
  push:
    branches:
      - develop

# .github/workflows/deploy-production.yml
on:
  push:
    branches:
      - main
    tags:
      - 'v*'
```

### Notifications:

Add Slack/Discord notifications:

```yaml
- name: Notify on Success
  if: success()
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    text: 'Deployment successful!'
  env:
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
```

## ✅ Checklist

- [ ] AWS IAM user created with necessary permissions
- [ ] GitHub Secrets configured
- [ ] Workflow files created in `.github/workflows/`
- [ ] EC2 instance prepared with .NET SDK and PM2
- [ ] S3 bucket configured
- [ ] CloudFront distribution ID noted
- [ ] Test deployment successful
- [ ] Monitoring set up
- [ ] Security best practices implemented

## 🎉 You're Done!

Now whenever you push code to GitHub:
1. GitHub Actions will automatically trigger
2. Backend will be built and deployed to EC2
3. Frontend will be built and deployed to S3
4. CloudFront cache will be invalidated
5. Your changes will be live!

## 📞 Support

If you encounter issues:
1. Check GitHub Actions logs
2. Check EC2 logs: `pm2 logs trilingo-backend`
3. Verify all secrets are correct
4. Check AWS CloudWatch for errors

---

**Note**: Replace all placeholder values (YOUR_USERNAME, YOUR_REPO, YOUR_BUCKET_NAME, etc.) with your actual values.


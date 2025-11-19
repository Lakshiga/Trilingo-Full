# 📋 Deploy Workflow - Detailed Explanation

## 🎯 Overview

When you **push to `master` branch** or **merge to `master`**, this workflow automatically:
1. Builds your Angular app
2. Uploads files to S3 bucket
3. Protects `level-01/` folder from deletion
4. Invalidates CloudFront cache

---

## 📝 Step-by-Step Breakdown

### **Step 1: Checkout Source** (Line 13-14)
```yaml
- name: Checkout source
  uses: actions/checkout@v3
```

**What happens:**
- GitHub Actions downloads your repository code
- Makes it available in the workflow runner
- **Result**: All your code files are now accessible

---

### **Step 2: Setup Node** (Line 16-19)
```yaml
- name: Setup Node
  uses: actions/setup-node@v3
  with:
    node-version: 20
```

**What happens:**
- Installs Node.js version 20
- Makes `npm` and `node` commands available
- **Result**: Ready to run npm commands

---

### **Step 3: Install Dependencies** (Line 21-22)
```yaml
- name: Install dependencies
  run: npm ci
```

**What happens:**
- Runs `npm ci` (clean install)
- Installs all packages from `package.json`
- Uses exact versions from `package-lock.json`
- **Result**: All dependencies installed (Angular, TypeScript, etc.)

---

### **Step 4: Build Angular** (Line 24-25)
```yaml
- name: Build Angular
  run: npm run build:cloudfront
```

**What happens:**
- Runs Angular build command
- Compiles TypeScript to JavaScript
- Bundles all files
- Creates production build in `dist/trilingo-admin-angular/`
- **Result**: Built files ready:
  - `index.html`
  - `main.xxxxx.js` (hashed filename)
  - `polyfills.xxxxx.js`
  - `runtime.xxxxx.js`
  - `styles.xxxxx.css`
  - `assets/` folder
  - Other chunk files

---

### **Step 5: Configure AWS Credentials** (Line 27-32)
```yaml
- name: Configure AWS credentials
  uses: aws-actions/configure-aws-credentials@v4
  with:
    aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY }}
    aws-secret-access-key: ${{ secrets.AWS_SECRET }}
    aws-region: ${{ secrets.AWS_REGION }}
```

**What happens:**
- Gets AWS credentials from GitHub Secrets
- Configures AWS CLI to use these credentials
- Sets up authentication for S3 and CloudFront
- **Result**: Can now run AWS CLI commands

**Required GitHub Secrets:**
- `AWS_ACCESS_KEY` - Your AWS access key
- `AWS_SECRET` - Your AWS secret key
- `AWS_REGION` - Region (e.g., `ap-southeast-1`)

---

### **Step 6: Sync Files to S3** (Line 34-72) ⭐ **MOST IMPORTANT**

This step has **TWO parts**:

#### **Part A: Sync JS/CSS Files** (Line 40-53)
```bash
aws s3 sync dist/trilingo-admin-angular/ \
  s3://${{ secrets.AWS_BUCKET }}/ \
  --delete \
  --exclude "level-01/*" \
  --exclude "level-01/**" \
  ...
  --cache-control "public, max-age=31536000, immutable" \
  --exclude "*.html" \
  --exclude "*.json"
```

**What happens:**
1. **Syncs** all files from `dist/trilingo-admin-angular/` to S3 bucket root
2. **Deletes** old files in S3 that don't exist in new build
3. **Excludes** `level-01/`, `level-02/`, `level-03/` folders from deletion (PROTECTS THEM!)
4. **Excludes** HTML and JSON files (handled in Part B)
5. **Sets cache** to 1 year (31536000 seconds) for JS/CSS files
6. **Result**: 
   - ✅ New JS/CSS files uploaded
   - ✅ Old JS/CSS files deleted
   - ✅ `level-01/` folder **NOT TOUCHED** (protected!)

**Files synced:**
- `main.xxxxx.js`
- `polyfills.xxxxx.js`
- `runtime.xxxxx.js`
- `styles.xxxxx.css`
- All chunk files (`123.xxxxx.js`, etc.)
- `assets/` folder contents
- `3rdpartylicenses.txt`

**Files NOT synced (excluded):**
- `*.html` files (handled in Part B)
- `*.json` files (handled in Part B)
- `level-01/` folder (protected!)
- `level-02/` folder (protected!)
- `level-03/` folder (protected!)

---

#### **Part B: Sync HTML/JSON Files** (Line 56-69)
```bash
aws s3 sync dist/trilingo-admin-angular/ \
  s3://${{ secrets.AWS_BUCKET }}/ \
  --delete \
  --exclude "level-01/*" \
  ...
  --cache-control "public, max-age=0, must-revalidate" \
  --include "*.html" \
  --include "*.json"
```

**What happens:**
1. **Syncs** only HTML and JSON files
2. **Deletes** old HTML/JSON files not in new build
3. **Excludes** level folders (still protected!)
4. **Sets cache** to 0 (no cache) - important for `index.html`
5. **Result**:
   - ✅ `index.html` updated (no cache = always fresh)
   - ✅ Old HTML files deleted
   - ✅ `level-01/` folder **STILL PROTECTED**

**Why separate sync?**
- HTML files need **no cache** (users should get latest version)
- JS/CSS files need **long cache** (better performance)
- Can't set different cache headers in one sync command

---

### **Step 7: Invalidate CloudFront Cache** (Line 74-81)
```yaml
- name: Invalidate CloudFront Cache
  uses: chetan/invalidate-cloudfront-action@v2
  env:
    DISTRIBUTION: ${{ secrets.CLOUDFRONT_ID }}
    PATHS: "/*"
    ...
```

**What happens:**
1. Creates CloudFront invalidation
2. Invalidates **all paths** (`/*`)
3. Forces CloudFront to fetch fresh files from S3
4. **Result**: Users get latest version immediately (not cached)

**Why needed?**
- CloudFront caches files at edge locations
- Without invalidation, users might see old cached version
- Invalidation forces CloudFront to get new files

**Time taken:** Usually 1-5 minutes

---

## 🔒 Protection Mechanism

### How `level-01/` Folder is Protected

The `--exclude` patterns work like this:

```bash
--exclude "level-01/*"   # Excludes level-01/ folder from sync
--exclude "level-01/**"  # Excludes all subfolders recursively
```

**What this means:**
- ✅ Files in `level-01/` are **NOT synced** (they're not in Angular build anyway)
- ✅ Files in `level-01/` are **NOT deleted** (excluded from `--delete`)
- ✅ Your image/audio data stays safe!

**Protected folders:**
- `level-01/img/numbers/` ✅
- `level-01/en/` ✅
- `level-01/ta/` ✅
- `level-01/si/` ✅
- `level-02/` ✅
- `level-03/` ✅

---

## 📊 Complete Flow Diagram

```
Git Push to Master
    ↓
[1] Checkout Code
    ↓
[2] Setup Node.js 20
    ↓
[3] Install Dependencies (npm ci)
    ↓
[4] Build Angular (npm run build:cloudfront)
    ↓
    Creates: dist/trilingo-admin-angular/
    ├── index.html
    ├── main.xxxxx.js
    ├── styles.xxxxx.css
    └── assets/
    ↓
[5] Configure AWS Credentials
    ↓
[6] Sync to S3
    ├── Upload JS/CSS (long cache)
    ├── Upload HTML/JSON (no cache)
    └── Delete old files (except level-01/)
    ↓
[7] Invalidate CloudFront Cache
    ↓
✅ Deployment Complete!
```

---

## ⚠️ Important Notes

### What Gets Deleted
- ✅ Old Angular build files (not in new build)
- ✅ Old `main.xxxxx.js` files (replaced with new hash)
- ✅ Old `styles.xxxxx.css` files

### What Does NOT Get Deleted
- ✅ `level-01/` folder and all contents
- ✅ `level-02/` folder and all contents
- ✅ `level-03/` folder and all contents
- ✅ Any other folders not in Angular build

### What Gets Updated
- ✅ All Angular build files in root
- ✅ `index.html`
- ✅ All JS/CSS files with new hashes

---

## 🎯 Final Result

After deployment:
1. ✅ New Angular app is live on CloudFront
2. ✅ `level-01/` folder is safe (not deleted)
3. ✅ Old build files are cleaned up
4. ✅ CloudFront cache is invalidated
5. ✅ Users see latest version

**URL**: `https://d3v81eez8ecmto.cloudfront.net`

---

## 🔍 How to Verify

1. **Check S3 Console:**
   - Go to S3 bucket
   - Verify `level-01/img/numbers/` files are still there
   - Check root has new Angular files

2. **Check CloudFront:**
   - Visit `https://d3v81eez8ecmto.cloudfront.net`
   - Should see latest version
   - Check browser console for new file hashes

3. **Check GitHub Actions:**
   - Go to Actions tab
   - See deployment logs
   - Verify all steps completed successfully

---

## 🚨 Troubleshooting

### If `level-01/` Still Gets Deleted
- Check `--exclude` patterns are correct
- Verify folder names match exactly
- Check AWS CLI version supports `--exclude` with `--delete`

### If Files Not Updating
- Check CloudFront invalidation completed
- Wait 5-10 minutes for cache to clear
- Hard refresh browser (Ctrl+F5)

### If Build Fails
- Check `package.json` has `build:cloudfront` script
- Verify all dependencies installed
- Check Node.js version compatibility

---

## ✅ Summary

**This workflow:**
1. ✅ Builds Angular app
2. ✅ Uploads to S3
3. ✅ **Protects `level-01/` folder**
4. ✅ Cleans up old files
5. ✅ Invalidates CloudFront cache
6. ✅ Makes app live!

**Your data is safe!** 🛡️


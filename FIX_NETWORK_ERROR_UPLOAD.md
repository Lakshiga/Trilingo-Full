# 🔧 Fix Network Error on Image Upload

## ❌ Problem

**Error:**
```
Network Error
Cannot connect to backend
```

**Cause:** The mobile app cannot reach the backend API endpoint for file uploads.

---

## ✅ Solutions

### Solution 1: Check API URL Configuration

The mobile app is using CloudFront URL. Verify it's correct:

**File:** `trilingo--mobile-/src/config/apiConfig.ts`

**Current Setting:**
```typescript
PRODUCTION: 'https://d3v81eez8ecmto.cloudfront.net/api'
```

**Verify:**
1. Check if CloudFront is routing `/api/*` to EC2 backend
2. Test the endpoint directly:
   ```bash
   curl https://d3v81eez8ecmto.cloudfront.net/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"identifier":"admin","password":"Admin123!"}'
   ```

### Solution 2: Use Direct EC2 URL (For Testing)

If CloudFront routing is not working, use EC2 directly:

**Update `apiConfig.ts`:**
```typescript
// For testing - use EC2 directly
PRODUCTION: 'http://13.250.26.7:5166/api'
```

**Note:** This is HTTP (not HTTPS), which should work for testing.

### Solution 3: Check CloudFront Behavior

Ensure CloudFront has a behavior for `/api/*` that routes to EC2:

1. **Go to AWS Console** → **CloudFront** → Your distribution
2. **Behaviors** tab
3. **Check for `/api/*` behavior:**
   - Path Pattern: `/api/*`
   - Origin: EC2 instance (13.250.26.7:5166)
   - Cache Policy: `CachingDisabled`
   - Allowed Methods: `GET, HEAD, OPTIONS, PUT, POST, PATCH, DELETE`

### Solution 4: Check Backend CORS

Ensure backend allows mobile app requests:

**File:** `Program.cs`

**Verify CORS policy allows:**
- CloudFront origin
- Mobile app origins
- FormData requests

### Solution 5: Test Connection First

Add a connection test before upload:

```typescript
// Test connection
const testConnection = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/check-admin`);
    console.log('Connection test:', response.status);
    return response.ok;
  } catch (error) {
    console.error('Connection test failed:', error);
    return false;
  }
};
```

---

## 🔍 Debugging Steps

### Step 1: Check What URL is Being Used

The code now logs the API URL. Check console for:
```
API Base URL: https://d3v81eez8ecmto.cloudfront.net/api
Full URL: https://d3v81eez8ecmto.cloudfront.net/api/auth/upload-profile-image
```

### Step 2: Test Backend Directly

```bash
# Test from command line
curl -X POST http://13.250.26.7:5166/api/auth/upload-profile-image \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@test.jpg"
```

### Step 3: Check Network Connectivity

In mobile app, test if backend is reachable:

```typescript
// Add this test function
const testBackendConnection = async () => {
  try {
    const response = await fetch('https://d3v81eez8ecmto.cloudfront.net/api/auth/check-admin');
    console.log('Backend reachable:', response.ok);
    return response.ok;
  } catch (error) {
    console.error('Backend not reachable:', error);
    return false;
  }
};
```

### Step 4: Check Backend Logs

On EC2:
```bash
pm2 logs trilingo-backend

# Look for:
# - Incoming requests
# - CORS errors
# - Upload endpoint hits
```

---

## 🚀 Quick Fix: Use EC2 Direct URL

If CloudFront is not working, temporarily use EC2 directly:

**Update `apiConfig.ts`:**
```typescript
export const getApiBaseUrl = (): string => {
  // Temporarily use EC2 directly for testing
  return 'http://13.250.26.7:5166/api';
  
  // Original:
  // return API_CONFIG.PRODUCTION;
};
```

**Restart mobile app** and try upload again.

---

## 📋 Checklist

- [ ] Verify API URL is correct
- [ ] Test backend endpoint directly
- [ ] Check CloudFront behavior for `/api/*`
- [ ] Verify backend CORS allows mobile app
- [ ] Check backend is running on EC2
- [ ] Test network connectivity from mobile device
- [ ] Check backend logs for errors

---

## 🎯 Most Likely Issues

1. **CloudFront not routing `/api/*` to EC2**
   - Fix: Add behavior in CloudFront

2. **Backend not accessible from mobile device**
   - Fix: Use EC2 direct URL for testing

3. **CORS blocking the request**
   - Fix: Update CORS in `Program.cs`

4. **Backend not running**
   - Fix: Restart backend on EC2

---

**Try the quick fix first (use EC2 direct URL), then check CloudFront configuration!**



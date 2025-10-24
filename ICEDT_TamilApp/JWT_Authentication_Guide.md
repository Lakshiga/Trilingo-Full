# JWT Authentication Guide for React Native Integration

## Overview

This document provides comprehensive documentation for integrating the ICEDT TamilApp JWT authentication system with React Native mobile applications. The backend API is built with ASP.NET Core and includes complete user registration, login, and token refresh functionality.

## System Architecture

- **Backend:** ASP.NET Core Web API
- **Authentication:** JWT (JSON Web Tokens) with refresh token rotation
- **Password Security:** BCrypt hashing with salt
- **Token Storage:** Secure storage recommendations for mobile apps
- **CORS:** Pre-configured for mobile app integration

## API Endpoints

### Base URL
```
https://your-api-domain.com/api
```

### 1. User Registration

**Endpoint:** `POST /api/auth/register`

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "username": "string (3-50 characters, required)",
  "email": "string (valid email format, required)",
  "password": "string (6-100 characters, required)"
}
```

**Success Response (200):**
```json
{
  "isSuccess": true,
  "message": "User registered successfully."
}
```

**Error Response (400):**
```json
{
  "isSuccess": false,
  "message": "Username or Email already exists."
}
```

### 2. User Login

**Endpoint:** `POST /api/auth/login`

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "username": "string (required)",
  "password": "string (required)"
}
```

**Success Response (200):**
```json
{
  "isSuccess": true,
  "message": "Login successful.",
  "token": "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "base64-encoded-refresh-token"
}
```

**Error Response (401):**
```json
{
  "isSuccess": false,
  "message": "Invalid username or password."
}
```

### 3. Token Refresh

**Endpoint:** `POST /api/auth/refresh`

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "refreshToken": "string (required)"
}
```

**Success Response (200):**
```json
{
  "isSuccess": true,
  "message": "Token refreshed successfully.",
  "token": "new-jwt-access-token",
  "refreshToken": "new-refresh-token"
}
```

**Error Response (401):**
```json
{
  "isSuccess": false,
  "message": "Invalid or expired refresh token."
}
```

## Token Configuration

| Property | Value | Description |
|----------|-------|-------------|
| **Access Token Expiry** | 15 minutes | Short-lived for security |
| **Refresh Token Expiry** | 7 days | Longer-lived for user convenience |
| **Algorithm** | HMAC SHA-512 | Cryptographic signing algorithm |
| **Token Rotation** | Yes | New refresh token issued on each refresh |
| **Role Assignment** | "Student" | Default role for new users |

## React Native Integration

### Required Dependencies

```bash
npm install @react-native-async-storage/async-storage
npm install react-native-keychain
```

### Authentication Service Implementation

Create `services/AuthService.js`:

```javascript
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Keychain from 'react-native-keychain';

const API_BASE_URL = 'https://your-api-domain.com/api';

class AuthService {
  /**
   * Store tokens securely
   * Access token in Keychain (more secure)
   * Refresh token in AsyncStorage (acceptable for this use case)
   */
  async storeTokens(accessToken, refreshToken) {
    try {
      await Keychain.setInternetCredentials(
        'auth_tokens',
        'access_token',
        accessToken
      );
      await AsyncStorage.setItem('refresh_token', refreshToken);
    } catch (error) {
      console.error('Error storing tokens:', error);
      throw error;
    }
  }

  /**
   * Retrieve stored tokens
   */
  async getTokens() {
    try {
      const credentials = await Keychain.getInternetCredentials('auth_tokens');
      const refreshToken = await AsyncStorage.getItem('refresh_token');
      
      return {
        accessToken: credentials ? credentials.password : null,
        refreshToken: refreshToken
      };
    } catch (error) {
      console.error('Error retrieving tokens:', error);
      return { accessToken: null, refreshToken: null };
    }
  }

  /**
   * Register new user
   */
  async register(username, email, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  /**
   * Login user and store tokens
   */
  async login(username, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      
      if (data.isSuccess && data.token) {
        await this.storeTokens(data.token, data.refreshToken);
      }
      
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshToken() {
    try {
      const { refreshToken } = await this.getTokens();
      
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      const data = await response.json();
      
      if (data.isSuccess && data.token) {
        await this.storeTokens(data.token, data.refreshToken);
      }
      
      return data;
    } catch (error) {
      console.error('Token refresh error:', error);
      throw error;
    }
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated() {
    const { accessToken, refreshToken } = await this.getTokens();
    return !!(accessToken && refreshToken);
  }

  /**
   * Logout user and clear tokens
   */
  async logout() {
    try {
      await Keychain.resetInternetCredentials('auth_tokens');
      await AsyncStorage.removeItem('refresh_token');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }
}

export default new AuthService();
```

### HTTP Client with Auto Token Refresh

Create `services/ApiClient.js`:

```javascript
import AuthService from './AuthService';

class ApiClient {
  constructor() {
    this.baseURL = 'https://your-api-domain.com/api';
  }

  /**
   * Make authenticated API request with automatic token refresh
   */
  async makeRequest(endpoint, options = {}) {
    const { accessToken } = await AuthService.getTokens();
    
    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        ...options.headers,
      },
    };

    let response = await fetch(`${this.baseURL}${endpoint}`, config);

    // If token expired (401), try to refresh
    if (response.status === 401) {
      try {
        const refreshResult = await AuthService.refreshToken();
        
        if (refreshResult.isSuccess) {
          const { accessToken: newToken } = await AuthService.getTokens();
          
          // Retry request with new token
          config.headers.Authorization = `Bearer ${newToken}`;
          response = await fetch(`${this.baseURL}${endpoint}`, config);
        } else {
          throw new Error('Token refresh failed');
        }
      } catch (error) {
        // Refresh failed, user needs to login again
        await AuthService.logout();
        throw new Error('Session expired. Please login again.');
      }
    }

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  // Convenience methods
  async get(endpoint) {
    return this.makeRequest(endpoint, { method: 'GET' });
  }

  async post(endpoint, data) {
    return this.makeRequest(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put(endpoint, data) {
    return this.makeRequest(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint) {
    return this.makeRequest(endpoint, { method: 'DELETE' });
  }
}

export default new ApiClient();
```

### React Native Component Examples

#### Login Screen

```javascript
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import AuthService from '../services/AuthService';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const result = await AuthService.login(username.trim(), password);
      
      if (result.isSuccess) {
        navigation.replace('Home');
      } else {
        Alert.alert('Login Failed', result.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Network error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        autoCorrect={false}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      
      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Login</Text>
        )}
      </TouchableOpacity>
      
      <TouchableOpacity
        onPress={() => navigation.navigate('Register')}
        style={styles.linkButton}
      >
        <Text style={styles.linkText}>Don't have an account? Register</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  linkText: {
    color: '#007bff',
    fontSize: 14,
  },
});

export default LoginScreen;
```

#### Registration Screen

```javascript
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import AuthService from '../services/AuthService';

const RegisterScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    if (!username.trim() || username.length < 3) {
      Alert.alert('Error', 'Username must be at least 3 characters');
      return false;
    }
    
    if (!email.trim() || !email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }
    
    if (!password.trim() || password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return false;
    }
    
    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const result = await AuthService.register(
        username.trim(),
        email.trim(),
        password
      );
      
      if (result.isSuccess) {
        Alert.alert(
          'Success',
          'Registration successful! You can now login.',
          [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
        );
      } else {
        Alert.alert('Registration Failed', result.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Network error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Username (3-50 characters)"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        autoCorrect={false}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Password (6-100 characters)"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      
      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleRegister}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Register</Text>
        )}
      </TouchableOpacity>
      
      <TouchableOpacity
        onPress={() => navigation.navigate('Login')}
        style={styles.linkButton}
      >
        <Text style={styles.linkText}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
};

// Use same styles as LoginScreen
const styles = StyleSheet.create({
  // ... same styles as LoginScreen
});

export default RegisterScreen;
```

## Authentication Flow

### 1. Registration Flow
```
User fills form → Validate input → POST /api/auth/register → Success/Error response
```

### 2. Login Flow
```
User enters credentials → POST /api/auth/login → Receive tokens → Store securely → Navigate to app
```

### 3. Authenticated Requests Flow
```
Make API request → Include Bearer token → Success OR 401 → Auto refresh → Retry request
```

### 4. Token Refresh Flow
```
Access token expires → API returns 401 → Use refresh token → Get new tokens → Retry original request
```

### 5. Logout Flow
```
User logs out → Clear stored tokens → Navigate to login screen
```

## Security Best Practices

### Token Storage
- **Access Token:** Store in Keychain (iOS) / Keystore (Android) for maximum security
- **Refresh Token:** AsyncStorage is acceptable due to shorter lifespan and rotation

### Network Security
- Always use HTTPS in production
- Implement certificate pinning for additional security
- Validate SSL certificates

### Error Handling
- Never log sensitive information (tokens, passwords)
- Implement proper error boundaries
- Provide user-friendly error messages

### Token Management
- Implement automatic token refresh
- Handle network failures gracefully
- Clear tokens on logout or app uninstall

## Common HTTP Status Codes

| Code | Description | Action |
|------|-------------|--------|
| 200 | Success | Process response data |
| 400 | Bad Request | Show validation errors |
| 401 | Unauthorized | Refresh token or redirect to login |
| 500 | Server Error | Show generic error message |

## Testing

### Test Scenarios
1. **Registration:** Valid/invalid inputs, duplicate users
2. **Login:** Valid/invalid credentials, network failures
3. **Token Refresh:** Expired tokens, invalid refresh tokens
4. **Logout:** Token cleanup, navigation
5. **Network Issues:** Offline scenarios, timeout handling

### Example Test Cases

```javascript
// Test login with valid credentials
test('should login successfully with valid credentials', async () => {
  const result = await AuthService.login('testuser', 'password123');
  expect(result.isSuccess).toBe(true);
  expect(result.token).toBeDefined();
});

// Test token refresh
test('should refresh token successfully', async () => {
  // Assume user is logged in
  const result = await AuthService.refreshToken();
  expect(result.isSuccess).toBe(true);
  expect(result.token).toBeDefined();
});
```

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure your mobile app domain is added to CORS policy
   - Check network configuration

2. **Token Expiry**
   - Implement proper token refresh logic
   - Handle refresh token expiry

3. **Storage Issues**
   - Check device permissions
   - Handle storage failures gracefully

4. **Network Connectivity**
   - Implement retry mechanisms
   - Show appropriate offline messages

### Debug Tips
- Use network debugging tools (Flipper, Reactotron)
- Log API responses (without sensitive data)
- Test on different devices and network conditions

## Production Checklist

- [ ] Update API base URL to production endpoint
- [ ] Implement certificate pinning
- [ ] Add proper error tracking (Sentry, Bugsnag)
- [ ] Test on various devices and OS versions
- [ ] Implement proper logging (without sensitive data)
- [ ] Add biometric authentication option
- [ ] Implement session timeout warnings
- [ ] Add proper loading states and error boundaries

## Support

For technical issues or questions about the authentication system, please refer to:
- API Documentation: `/swagger` endpoint
- Backend Repository: [Your repository URL]
- Mobile App Repository: [Your mobile app repository URL]

---

**Last Updated:** September 2025  
**API Version:** v1  
**Compatible React Native Version:** 0.70+

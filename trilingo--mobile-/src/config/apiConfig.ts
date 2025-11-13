// API Configuration for different environments
export const API_CONFIG = {
  // Update these URLs based on your development setup
  
  // For Android Emulator (most common)
  ANDROID_EMULATOR: 'http://10.0.2.2:5166/api',
  
  // For iOS Simulator
  IOS_SIMULATOR: 'http://localhost:5166/api',
  
  // For Physical Device (use your computer's IP address)
  PHYSICAL_DEVICE: 'http://172.22.126.148:5166/api',
  
  // For Web/Expo Go
  WEB: 'http://localhost:5166/api',
  
  // Production URL (update when deploying)
  PRODUCTION: 'https://your-backend-url.com/api',
};

// Auto-detect environment and return appropriate URL
export const getApiBaseUrl = (): string => {
  // For Expo Go, use your computer's IP address
  // Expo Go cannot connect to localhost or 10.0.2.2
  
  return API_CONFIG.PHYSICAL_DEVICE; // http://172.22.126.148:5166/api
};

// Fallback URLs for testing
export const FALLBACK_URLS = [
  'http://172.22.126.148:5166/api', // Your computer IP (for Expo Go)
  'http://10.0.2.2:5166/api',      // Android emulator
  'http://localhost:5166/api',     // Local testing
];

// Current API base URL
export const API_BASE_URL = getApiBaseUrl();
export const API_TIMEOUT = 10000; // 10 seconds

// Instructions for updating the URL:
/*
1. Android Emulator: Use API_CONFIG.ANDROID_EMULATOR (http://10.0.2.2:5166/api)
2. iOS Simulator: Use API_CONFIG.IOS_SIMULATOR (http://localhost:5166/api)
3. Physical Device: 
   - Find your computer's IP address (run: ipconfig or ifconfig)
   - Update API_CONFIG.PHYSICAL_DEVICE with your IP (e.g., http://192.168.1.100:5166/api)
   - Use API_CONFIG.PHYSICAL_DEVICE
4. Expo Go: Usually works with physical device URL
5. Web: Use API_CONFIG.WEB (http://localhost:5166/api)

To change the environment, modify the return statement in getApiBaseUrl()
*/

/**
 * VynceAI Extension - Configuration
 * Centralized configuration for API endpoints
 */

// Environment Configuration
const ENV = {
  // Set to 'production' to use deployed backend, 'development' for local
  MODE: 'production', // Change to 'development' for local testing
  
  // API Base URLs
  PRODUCTION_URL: 'https://vynceai.onrender.com',
  DEVELOPMENT_URL: 'http://127.0.0.1:8000',
};

// Get current API base URL based on environment
export const API_BASE_URL = ENV.MODE === 'production' 
  ? ENV.PRODUCTION_URL 
  : ENV.DEVELOPMENT_URL;

// API Endpoints
export const API_ENDPOINTS = {
  chat: '/api/v1/ai/chat',
  query: '/api/v1/ai/query',
  models: '/api/v1/ai/models',
  health: '/api/v1/utils/health',
  status: '/api/v1/utils/status'
};

// Timeout settings
export const TIMEOUTS = {
  DEFAULT: 60000, // 60 seconds
  HEALTH_CHECK: 5000 // 5 seconds for health checks
};

console.log(`VynceAI Config: Using ${ENV.MODE} mode - ${API_BASE_URL}`);

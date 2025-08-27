require('dotenv').config();

const config = {
  // Server Configuration
  PORT: process.env.PORT || 5310,
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // Base URL Configuration
  BASE_URL: process.env.BASE_URL || 'https://linkiin.in',
  LIVE_API_URL: process.env.LIVE_API_URL || 'https://linkiin.in/api',
  
  // Cross-Origin Configuration
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['http://localhost:3000', 'https://linkiin.in'],
  
  // Database Configuration
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: process.env.DB_PORT || 3306,
  DB_NAME: process.env.DB_NAME || 'shopzeo_db',
  DB_USER: process.env.DB_USER || 'root',
  DB_PASSWORD: process.env.DB_PASSWORD || '',
  
  // JWT Configuration
  JWT_SECRET: process.env.JWT_SECRET || 'your-super-secret-jwt-key-here',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  
  // File Upload Configuration
  UPLOAD_PATH: process.env.UPLOAD_PATH || './uploads',
  MAX_FILE_SIZE: process.env.MAX_FILE_SIZE || 5242880,
  
  // Helper function to get full image URL
  getImageUrl: (imagePath) => {
    if (!imagePath) return null;
    
    // If already a full URL, return as is
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    // Ensure path starts with /
    const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
    
    // Return full URL
    return `${config.BASE_URL}${cleanPath}`;
  },
  
  // Helper function to get relative path from full URL
  getRelativePath: (imageUrl) => {
    if (!imageUrl) return null;
    
    // If it's already a relative path, return as is
    if (!imageUrl.startsWith('http')) {
      return imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
    }
    
    // Extract relative path from full URL
    const url = new URL(imageUrl);
    return url.pathname;
  }
};

module.exports = config;

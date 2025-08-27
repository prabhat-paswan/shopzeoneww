const axios = require('axios');
const config = require('../config/app');

class LiveServerSync {
  constructor() {
    this.liveApiUrl = config.LIVE_API_URL;
    this.apiKey = process.env.LIVE_API_KEY;
    this.authToken = process.env.LIVE_AUTH_TOKEN;
  }

  // Get headers for live server requests
  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };

    if (this.apiKey) {
      headers['X-API-Key'] = this.apiKey;
    }

    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }

    return headers;
  }

  // Test connection to live server
  async testConnection() {
    try {
      const response = await axios.get(`${this.liveApiUrl}/health`, {
        headers: this.getHeaders(),
        timeout: 10000
      });
      
      console.log('✅ Live server connection successful:', response.data);
      return true;
    } catch (error) {
      console.error('❌ Live server connection failed:', error.message);
      return false;
    }
  }

  // Sync category to live server
  async syncCategory(categoryData) {
    try {
      const response = await axios.post(`${this.liveApiUrl}/categories`, categoryData, {
        headers: this.getHeaders(),
        timeout: 15000
      });
      
      console.log('✅ Category synced to live server:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Category sync failed:', error.message);
      throw error;
    }
  }

  // Sync brand to live server
  async syncBrand(brandData) {
    try {
      const response = await axios.post(`${this.liveApiUrl}/brands`, brandData, {
        headers: this.getHeaders(),
        timeout: 15000
      });
      
      console.log('✅ Brand synced to live server:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Brand sync failed:', error.message);
      throw error;
    }
  }

  // Sync banner to live server
  async syncBanner(bannerData) {
    try {
      const response = await axios.post(`${this.liveApiUrl}/banners`, bannerData, {
        headers: this.getHeaders(),
        timeout: 15000
      });
      
      console.log('✅ Banner synced to live server:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Banner sync failed:', error.message);
      throw error;
    }
  }

  // Sync product to live server
  async syncProduct(productData) {
    try {
      const response = await axios.post(`${this.liveApiUrl}/products`, productData, {
        headers: this.getHeaders(),
        timeout: 15000
      });
      
      console.log('✅ Product synced to live server:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Product sync failed:', error.message);
      throw error;
    }
  }

  // Get data from live server
  async getFromLive(endpoint, params = {}) {
    try {
      const response = await axios.get(`${this.liveApiUrl}/${endpoint}`, {
        headers: this.getHeaders(),
        params,
        timeout: 10000
      });
      
      return response.data;
    } catch (error) {
      console.error(`❌ Failed to get data from live server (${endpoint}):`, error.message);
      throw error;
    }
  }

  // Update data on live server
  async updateOnLive(endpoint, id, updateData) {
    try {
      const response = await axios.put(`${this.liveApiUrl}/${endpoint}/${id}`, updateData, {
        headers: this.getHeaders(),
        timeout: 15000
      });
      
      console.log(`✅ Data updated on live server (${endpoint}):`, response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ Failed to update data on live server (${endpoint}):`, error.message);
      throw error;
    }
  }

  // Delete data from live server
  async deleteFromLive(endpoint, id) {
    try {
      const response = await axios.delete(`${this.liveApiUrl}/${endpoint}/${id}`, {
        headers: this.getHeaders(),
        timeout: 10000
      });
      
      console.log(`✅ Data deleted from live server (${endpoint}):`, response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ Failed to delete data from live server (${endpoint}):`, error.message);
      throw error;
    }
  }
}

module.exports = new LiveServerSync();

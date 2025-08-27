const express = require('express');
const path = require('path');

const app = express();

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));

// Test route
app.get('/test', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Image Test</title>
    </head>
    <body>
      <h1>Brand Logo Test</h1>
      <h2>Samsung Logo:</h2>
      <img src="/uploads/brands/brand-1755882682399-606248210.jpeg" alt="Samsung" style="width: 100px; height: 100px; border: 1px solid #ccc;">
      
      <h2>LG Logo:</h2>
      <img src="/uploads/brands/brand-1755883618471-749353359.jpg" alt="LG" style="width: 100px; height: 100px; border: 1px solid #ccc;">
      
      <h2>Apple Logo:</h2>
      <img src="/uploads/brands/brand-1756002068669-187553850.png" alt="Apple" style="width: 100px; height: 100px; border: 1px solid #ccc;">
      
      <script>
        console.log('Testing images...');
        document.querySelectorAll('img').forEach((img, index) => {
          img.onload = () => console.log('Image ' + (index + 1) + ' loaded successfully');
          img.onerror = () => console.log('Image ' + (index + 1) + ' failed to load');
        });
      </script>
    </body>
    </html>
  `);
});

const PORT = 5001;
app.listen(PORT, () => {
  console.log('🚀 Test server running on port ' + PORT);
  console.log('📱 Test page: http://localhost:' + PORT + '/test');
});

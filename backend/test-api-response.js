const axios = require('axios');

console.log('🧪 Testing API Response Directly...\n');

async function testAPIResponse() {
  try {
    // Test the categories API directly
    console.log('1️⃣ Testing categories API...');
    const response = await axios.get('http://localhost:5000/api/categories');
    
    console.log('✅ API Response Status:', response.status);
    console.log('✅ Total Categories:', response.data.data.categories.length);
    
    // Show first few categories with their image URLs
    console.log('\n📸 First 3 Categories with Images:');
    const categoriesWithImages = response.data.data.categories.filter(cat => cat.image).slice(0, 3);
    
    categoriesWithImages.forEach((cat, index) => {
      console.log(`\n   Category ${index + 1}:`);
      console.log(`      ID: ${cat.id}`);
      console.log(`      Name: ${cat.name}`);
      console.log(`      Image URL: ${cat.image}`);
      console.log(`      URL Length: ${cat.image ? cat.image.length : 0}`);
      
      // Check if URL has double domain
      if (cat.image && cat.image.includes('https://linkiin.inhttps://linkiin.in')) {
        console.log(`      ❌ DOUBLE DOMAIN DETECTED!`);
      } else if (cat.image && cat.image.startsWith('https://linkiin.in')) {
        console.log(`      ✅ Single domain (correct)`);
      } else if (cat.image && cat.image.startsWith('http://localhost')) {
        console.log(`      ⚠️ Localhost domain`);
      } else {
        console.log(`      ❓ Unknown format`);
      }
    });
    
    // Check for your specific category
    console.log('\n🎯 Looking for your specific category...');
    const specificCategory = response.data.data.categories.find(cat => 
      cat.image && cat.image.includes('category-1756245353209-465480849.jpg')
    );
    
    if (specificCategory) {
      console.log('✅ Found your category:');
      console.log(`   ID: ${specificCategory.id}`);
      console.log(`   Name: ${specificCategory.name}`);
      console.log(`   Image: ${specificCategory.image}`);
    } else {
      console.log('❌ Your specific category not found in API response');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run the test
testAPIResponse();

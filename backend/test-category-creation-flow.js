const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

console.log('🧪 Testing Category Creation Flow with Live Server Sync...\n');

console.log('📍 Configuration:');
console.log('   Local Server: http://localhost:5000');
console.log('   Live Server: https://linkiin.in/api');
console.log('   Test Image: Will create a test image\n');

async function testCategoryCreationFlow() {
  try {
    // Step 1: Check if local server is running
    console.log('1️⃣ Checking Local Server Status...');
    try {
      const healthResponse = await axios.get('http://localhost:5000/health');
      console.log('✅ Local server is running:', healthResponse.data.message);
    } catch (error) {
      console.log('❌ Local server not accessible:', error.message);
      return;
    }

    // Step 2: Check current categories count on both servers
    console.log('\n2️⃣ Checking Current Categories Count...');
    
    // Local server categories
    let localCategoriesCount = 0;
    try {
      const localResponse = await axios.get('http://localhost:5000/api/categories');
      localCategoriesCount = localResponse.data.data.categories.length;
      console.log(`   Local Server: ${localCategoriesCount} categories`);
    } catch (error) {
      console.log('   ❌ Failed to get local categories:', error.message);
      return;
    }
    
    // Live server categories
    let liveCategoriesCount = 0;
    try {
      const liveResponse = await axios.get('https://linkiin.in/api/categories');
      liveCategoriesCount = liveResponse.data.data.categories.length;
      console.log(`   Live Server: ${liveCategoriesCount} categories`);
    } catch (error) {
      console.log('   ❌ Failed to get live categories:', error.message);
      return;
    }

    // Step 3: Create a test image file
    console.log('\n3️⃣ Creating Test Image File...');
    const testImagePath = path.join(__dirname, 'test-category-image.jpg');
    const testImageContent = 'This is a test image file for category creation';
    
    try {
      fs.writeFileSync(testImagePath, testImageContent);
      console.log('   ✅ Test image created:', testImagePath);
    } catch (error) {
      console.log('   ❌ Failed to create test image:', error.message);
      return;
    }

    // Step 4: Create a new category via API
    console.log('\n4️⃣ Creating New Category via API...');
    
    const formData = new FormData();
    formData.append('name', 'Postman Test Category 2');
    formData.append('description', 'Testing category creation and live server sync');
    formData.append('priority', '1');
    formData.append('isActive', 'true');
    formData.append('logo', fs.createReadStream(testImagePath));
    
    let newCategoryId = null;
    try {
      const createResponse = await axios.post('http://localhost:5000/api/categories', formData, {
        headers: {
          ...formData.getHeaders(),
        },
        timeout: 30000
      });
      
      if (createResponse.data.success) {
        newCategoryId = createResponse.data.data.id;
        console.log('   ✅ Category created successfully!');
        console.log(`   Category ID: ${newCategoryId}`);
        console.log(`   Name: ${createResponse.data.data.name}`);
        console.log(`   Image: ${createResponse.data.data.image}`);
        
        // Check if image URL is correct
        if (createResponse.data.data.image && createResponse.data.data.image.includes('https://linkiin.in')) {
          console.log('   ✅ Image URL uses correct live domain');
        } else {
          console.log('   ⚠️ Image URL may not be correct');
        }
      } else {
        console.log('   ❌ Category creation failed:', createResponse.data.message);
        return;
      }
    } catch (error) {
      console.log('   ❌ Category creation error:', error.message);
      if (error.response) {
        console.log('   Response data:', error.response.data);
      }
      return;
    }

    // Step 5: Wait a moment for sync to complete
    console.log('\n5️⃣ Waiting for Live Server Sync...');
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Step 6: Check if category appears on live server
    console.log('\n6️⃣ Checking Live Server for New Category...');
    try {
      const updatedLiveResponse = await axios.get('https://linkiin.in/api/categories');
      const updatedLiveCategories = updatedLiveResponse.data.data.categories;
      const newLiveCategory = updatedLiveCategories.find(cat => cat.name === 'Postman Test Category 2');
      
      if (newLiveCategory) {
        console.log('   ✅ New category found on live server!');
        console.log(`   Live Server ID: ${newLiveCategory.id}`);
        console.log(`   Live Server Name: ${newLiveCategory.name}`);
        console.log(`   Live Server Image: ${newLiveCategory.image || 'No Image'}`);
        
        // Check if image is accessible on live server
        if (newLiveCategory.image) {
          try {
            const imageResponse = await axios.get(newLiveCategory.image, {
              timeout: 10000,
              validateStatus: function (status) {
                return status < 500; // Accept 404 as valid response
              }
            });
            
            if (imageResponse.status === 200) {
              console.log('   ✅ Image accessible on live server');
            } else if (imageResponse.status === 404) {
              console.log('   ⚠️ Image NOT found on live server (404)');
              console.log('   💡 Image file needs to be uploaded to live server');
            }
          } catch (imageError) {
            console.log('   ⚠️ Image access test failed:', imageError.message);
          }
        }
      } else {
        console.log('   ❌ New category NOT found on live server');
        console.log('   💡 This means live server sync is not working');
      }
    } catch (error) {
      console.log('   ❌ Failed to check live server:', error.message);
    }

    // Step 7: Check local server categories count
    console.log('\n7️⃣ Checking Updated Local Server Count...');
    try {
      const updatedLocalResponse = await axios.get('http://localhost:5000/api/categories');
      const updatedLocalCount = updatedLocalResponse.data.data.categories.length;
      console.log(`   Updated Local Count: ${updatedLocalCount}`);
      console.log(`   Previous Local Count: ${localCategoriesCount}`);
      console.log(`   Difference: ${updatedLocalCount - localCategoriesCount}`);
      
      if (updatedLocalCount > localCategoriesCount) {
        console.log('   ✅ Local server count increased - category created successfully');
      } else {
        console.log('   ⚠️ Local server count unchanged');
      }
    } catch (error) {
      console.log('   ❌ Failed to check updated local count:', error.message);
    }

    // Step 8: Summary
    console.log('\n🎯 Test Summary:');
    console.log('   ✅ Local server: Working');
    console.log('   ✅ Live server API: Working');
    console.log('   ✅ Category creation: Working');
    console.log('   ⚠️ Live server sync: Needs verification');
    console.log('   ⚠️ Image upload: May need manual upload to live server');
    
    console.log('\n🚀 Next Steps:');
    console.log('   1. Check if SYNC_TO_LIVE=true in .env file');
    console.log('   2. Verify live server sync is working');
    console.log('   3. Upload image files to live server if needed');
    
    // Cleanup test image
    try {
      fs.unlinkSync(testImagePath);
      console.log('\n🧹 Cleanup: Test image file removed');
    } catch (error) {
      console.log('\n🧹 Cleanup: Failed to remove test image');
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testCategoryCreationFlow();

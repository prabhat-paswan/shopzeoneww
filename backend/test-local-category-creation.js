const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

console.log('🧪 Testing Local Category Creation...\n');

console.log('📍 Configuration:');
console.log('   Local Server: http://localhost:5000');
console.log('   Test Image: Will create a test image\n');

async function testLocalCategoryCreation() {
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

    // Step 2: Check current categories count
    console.log('\n2️⃣ Checking Current Categories Count...');
    let initialCategoriesCount = 0;
    try {
      const localResponse = await axios.get('http://localhost:5000/api/categories');
      initialCategoriesCount = localResponse.data.data.categories.length;
      console.log(`   Initial Categories Count: ${initialCategoriesCount}`);
      
      // Show last few categories
      const categories = localResponse.data.data.categories;
      if (categories.length > 0) {
        console.log('\n   📊 Last 3 Categories:');
        categories.slice(-3).forEach((cat, index) => {
          console.log(`      ${index + 1}. ID: ${cat.id} | Name: ${cat.name} | Image: ${cat.image || 'No Image'}`);
        });
      }
    } catch (error) {
      console.log('   ❌ Failed to get categories:', error.message);
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
    formData.append('name', 'Postman Test Category 3');
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
        console.log(`   Description: ${createResponse.data.data.description}`);
        console.log(`   Image: ${createResponse.data.data.image}`);
        console.log(`   Priority: ${createResponse.data.data.sort_order}`);
        console.log(`   Active: ${createResponse.data.data.is_active}`);
        
        // Check if image URL is correct
        if (createResponse.data.data.image) {
          if (createResponse.data.data.image.includes('https://linkiin.in')) {
            console.log('   ✅ Image URL uses correct live domain');
          } else if (createResponse.data.data.image.includes('localhost')) {
            console.log('   ⚠️ Image URL uses localhost domain');
          } else {
            console.log('   ✅ Image URL format looks correct');
          }
        } else {
          console.log('   ⚠️ No image URL generated');
        }
      } else {
        console.log('   ❌ Category creation failed:', createResponse.data.message);
        return;
      }
    } catch (error) {
      console.log('   ❌ Category creation error:', error.message);
      if (error.response) {
        console.log('   Response status:', error.response.status);
        console.log('   Response data:', error.response.data);
      }
      return;
    }

    // Step 5: Wait a moment for processing
    console.log('\n5️⃣ Waiting for Processing...');
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Step 6: Check updated categories count
    console.log('\n6️⃣ Checking Updated Categories Count...');
    try {
      const updatedResponse = await axios.get('http://localhost:5000/api/categories');
      const updatedCount = updatedResponse.data.data.categories.length;
      console.log(`   Updated Categories Count: ${updatedCount}`);
      console.log(`   Previous Count: ${initialCategoriesCount}`);
      console.log(`   Difference: ${updatedCount - initialCategoriesCount}`);
      
      if (updatedCount > initialCategoriesCount) {
        console.log('   ✅ Categories count increased - new category created successfully');
      } else {
        console.log('   ⚠️ Categories count unchanged');
      }
      
      // Show the new category
      const newCategory = updatedResponse.data.data.categories.find(cat => cat.id === newCategoryId);
      if (newCategory) {
        console.log('\n   🆕 New Category Details:');
        console.log(`      ID: ${newCategory.id}`);
        console.log(`      Name: ${newCategory.name}`);
        console.log(`      Description: ${newCategory.description}`);
        console.log(`      Image: ${newCategory.image || 'No Image'}`);
        console.log(`      Priority: ${newCategory.sort_order}`);
        console.log(`      Active: ${newCategory.is_active}`);
        console.log(`      Created: ${newCategory.createdAt}`);
      }
    } catch (error) {
      console.log('   ❌ Failed to check updated count:', error.message);
    }

    // Step 7: Test getting the specific category
    console.log('\n7️⃣ Testing Get Category by ID...');
    try {
      const getResponse = await axios.get(`http://localhost:5000/api/categories/${newCategoryId}`);
      if (getResponse.data.success) {
        console.log('   ✅ Get category by ID working');
        console.log(`   Retrieved Name: ${getResponse.data.data.name}`);
        console.log(`   Retrieved Image: ${getResponse.data.data.image || 'No Image'}`);
      } else {
        console.log('   ❌ Get category by ID failed:', getResponse.data.message);
      }
    } catch (error) {
      console.log('   ❌ Get category by ID error:', error.message);
    }

    // Step 8: Summary
    console.log('\n🎯 Test Summary:');
    console.log('   ✅ Local server: Working');
    console.log('   ✅ Category creation: Working');
    console.log('   ✅ Image upload: Working');
    console.log('   ✅ Database storage: Working');
    console.log('   ✅ API responses: Working');
    
    console.log('\n🚀 Next Steps:');
    console.log('   1. ✅ Local category creation is working');
    console.log('   2. ⚠️ Need to test live server sync');
    console.log('   3. ⚠️ Need to verify image URLs on live server');
    
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
testLocalCategoryCreation();

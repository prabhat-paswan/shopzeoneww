const axios = require('axios');

console.log('🔍 Checking Categories in Database...\n');

async function checkCategories() {
  try {
    // Get categories from local API
    const response = await axios.get('http://localhost:5000/api/categories');
    const categories = response.data.data.categories;
    
    console.log(`📊 Total Categories: ${categories.length}\n`);
    
    // Show all categories with details
    categories.forEach((cat, index) => {
      console.log(`${index + 1}. ID: ${cat.id} | Name: ${cat.name} | Image: ${cat.image || 'No Image'}`);
    });
    
    // Find categories with images
    const categoriesWithImages = categories.filter(cat => cat.image);
    console.log(`\n🖼️ Categories with Images: ${categoriesWithImages.length}`);
    
    if (categoriesWithImages.length > 0) {
      console.log('\n📸 Categories with Images:');
      categoriesWithImages.forEach((cat, index) => {
        console.log(`${index + 1}. ID: ${cat.id} | Name: ${cat.name}`);
        console.log(`   Image Path: ${cat.image}`);
        console.log(`   Full URL: https://linkiin.in${cat.image}`);
        console.log('');
      });
    }
    
    // Check for the specific image path you mentioned
    const specificImagePath = '/uploads/categories/category-1756245353209-465480849.jpg';
    const categoryWithSpecificImage = categories.find(cat => cat.image === specificImagePath);
    
    if (categoryWithSpecificImage) {
      console.log('🎯 Found Category with Specific Image:');
      console.log(`   ID: ${categoryWithSpecificImage.id}`);
      console.log(`   Name: ${categoryWithSpecificImage.name}`);
      console.log(`   Image: ${categoryWithSpecificImage.image}`);
    } else {
      console.log('❌ Category with specific image path not found in API response');
      console.log('   This might mean:');
      console.log('   1. Category was created after API call');
      console.log('   2. Category is in database but not in API response');
      console.log('   3. Image path is different');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run the check
checkCategories();

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testCategoriesAPI() {
  try {
    console.log('Testing Categories API...');
    
    // Test GET categories
    console.log('\n1. Testing GET /api/categories');
    const getResponse = await fetch('http://localhost:5000/api/categories');
    const getData = await getResponse.json();
    console.log('Status:', getResponse.status);
    console.log('Response:', JSON.stringify(getData, null, 2));
    
    // Test POST category
    console.log('\n2. Testing POST /api/categories');
    const postData = {
      name: 'Test Category',
      description: 'This is a test category',
      priority: 1,
      isActive: true,
      metaTitle: 'Test Category',
      metaDescription: 'Test category description',
      metaKeywords: 'test, category'
    };
    
    const postResponse = await fetch('http://localhost:5000/api/categories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(postData)
    });
    
    const postResult = await postResponse.json();
    console.log('Status:', postResponse.status);
    console.log('Response:', JSON.stringify(postResult, null, 2));
    
  } catch (error) {
    console.error('Error testing API:', error.message);
  }
}

testCategoriesAPI();

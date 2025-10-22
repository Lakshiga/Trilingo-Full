const axios = require('axios');

async function testIntegration() {
  const baseUrl = 'http://localhost:5069/api';
  
  console.log('🧪 Testing ICEDT-TamilApp Backend Integration...\n');
  
  try {
    // Test 1: Check if backend is running by testing a simple endpoint
    console.log('1. Testing backend connectivity...');
    const testResponse = await axios.get(`${baseUrl}/levels`, { timeout: 5000 });
    console.log('✅ Backend is running');
  } catch (error) {
    console.log('❌ Backend is not running or not accessible');
    console.log('   Please start the backend server first');
    console.log('   Error:', error.message);
    return;
  }
  
  try {
    // Test 2: Test multilingual levels endpoint
    console.log('\n2. Testing multilingual levels endpoint...');
    const levelsResponse = await axios.get(`${baseUrl}/multilingual/levels`, { timeout: 5000 });
    console.log('✅ Multilingual levels endpoint is working');
    console.log(`   Found ${levelsResponse.data.length} levels`);
  } catch (error) {
    console.log('❌ Multilingual levels endpoint failed');
    console.log('   Error:', error.response?.data || error.message);
  }
  
  try {
    // Test 3: Test multilingual activities endpoint
    console.log('\n3. Testing multilingual activities endpoint...');
    const activitiesResponse = await axios.get(`${baseUrl}/multilingual/activities`, { timeout: 5000 });
    console.log('✅ Multilingual activities endpoint is working');
    console.log(`   Found ${activitiesResponse.data.length} activities`);
  } catch (error) {
    console.log('❌ Multilingual activities endpoint failed');
    console.log('   Error:', error.response?.data || error.message);
  }
  
  try {
    // Test 4: Test creating a multilingual level
    console.log('\n4. Testing multilingual level creation...');
    const testLevel = {
      levelName: {
        ta: 'சோதனை நிலை',
        en: 'Test Level',
        si: 'පරීක්ෂණ මට්ටම'
      },
      slug: 'test-level',
      sequenceOrder: 999,
      barcode: 'TEST123456',
      coverImageUrl: null
    };
    
    const createResponse = await axios.post(`${baseUrl}/multilingual/levels`, testLevel, { timeout: 5000 });
    console.log('✅ Multilingual level creation is working');
    console.log(`   Created level with ID: ${createResponse.data.levelId}`);
    
    // Clean up - delete the test level
    await axios.delete(`${baseUrl}/multilingual/levels/${createResponse.data.levelId}`, { timeout: 5000 });
    console.log('   Test level cleaned up');
  } catch (error) {
    console.log('❌ Multilingual level creation failed');
    console.log('   Error:', error.response?.data || error.message);
  }
  
  console.log('\n🎉 Integration test completed!');
  console.log('\nNext steps:');
  console.log('1. Start the Angular development server: cd icedt-admin-angular && npm start');
  console.log('2. Open http://localhost:4200 in your browser');
  console.log('3. Test the multilingual functionality in the admin panel');
}

testIntegration().catch(console.error);

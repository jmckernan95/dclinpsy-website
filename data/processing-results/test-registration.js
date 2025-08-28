/**
 * Test script to verify registration functionality
 * Run with: node test-registration.js
 */

// Mock localStorage for Node.js environment
global.localStorage = {
  data: {},
  getItem: function(key) {
    return this.data[key] || null;
  },
  setItem: function(key, value) {
    this.data[key] = value;
  },
  removeItem: function(key) {
    delete this.data[key];
  },
  clear: function() {
    this.data = {};
  }
};

// Mock crypto for Node.js environment
global.crypto = {
  getRandomValues: function(arr) {
    for (let i = 0; i < arr.length; i++) {
      arr[i] = Math.floor(Math.random() * 256);
    }
    return arr;
  },
  subtle: null // This will trigger fallback methods
};

// Mock btoa/atob
global.btoa = function(str) {
  return Buffer.from(str, 'binary').toString('base64');
};

global.atob = function(str) {
  return Buffer.from(str, 'base64').toString('binary');
};

// Import the authentication functions
const { registerUser } = require('./src/utils/auth.js');

async function testRegistration() {
  console.log('🧪 Testing Registration Functionality');
  console.log('=====================================');
  
  const testUser = {
    username: 'testuser123',
    email: 'test@example.com',
    dateOfBirth: '1990-01-01',
    password: 'TestPassword123!',
    confirmPassword: 'TestPassword123!',
    consentGiven: true,
    researchDataConsent: false
  };
  
  try {
    console.log('📝 Attempting to register user...');
    console.log('User data:', {
      username: testUser.username,
      email: testUser.email,
      dateOfBirth: testUser.dateOfBirth,
      consentGiven: testUser.consentGiven,
      researchDataConsent: testUser.researchDataConsent
    });
    
    const result = await registerUser(testUser);
    
    console.log('📊 Registration result:', result);
    
    if (result.success) {
      console.log('✅ Registration successful!');
      console.log('👤 User created:', result.user);
    } else {
      console.log('❌ Registration failed');
      console.log('🔍 Errors:', result.errors);
    }
    
  } catch (error) {
    console.error('💥 Registration error:', error.message);
    console.error('📋 Stack trace:', error.stack);
  }
  
  console.log('\n🔍 LocalStorage contents:', JSON.stringify(global.localStorage.data, null, 2));
}

// Run the test
testRegistration();
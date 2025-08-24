/**
 * Authentication utilities for DClinPsy SJT Practice App
 * Handles user registration, login, session management using localStorage
 */

import { hashPassword, verifyPassword, encryptData, decryptData, validateEmail, calculateAge, sanitizeInput } from './encryption.js';

const USERS_STORAGE_KEY = 'dclinpsy-sjt-users';
const CURRENT_USER_KEY = 'dclinpsy-sjt-current-user';
const SESSION_TIMEOUT = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

/**
 * Gets all registered users from localStorage
 * @returns {Array} - Array of user objects (without passwords)
 */
const getUsers = () => {
  try {
    const users = localStorage.getItem(USERS_STORAGE_KEY);
    return users ? JSON.parse(users) : [];
  } catch (error) {
    console.error('Error reading users from localStorage:', error);
    return [];
  }
};

/**
 * Saves users array to localStorage
 * @param {Array} users - Users array to save
 * @returns {boolean} - Success status
 */
const saveUsers = (users) => {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    return true;
  } catch (error) {
    console.error('Error saving users to localStorage:', error);
    return false;
  }
};

/**
 * Generates a unique user ID
 * @returns {string} - Unique ID
 */
const generateUserId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
};

/**
 * Validates registration data
 * @param {Object} userData - User data to validate
 * @returns {Object} - Validation result
 */
export const validateRegistrationData = (userData) => {
  const errors = [];
  
  // Username validation
  if (!userData.username || userData.username.trim().length < 2) {
    errors.push('Username must be at least 2 characters long');
  } else if (userData.username.trim().length > 30) {
    errors.push('Username must be no more than 30 characters long');
  }
  
  // Email validation
  if (!userData.email || !validateEmail(userData.email)) {
    errors.push('Please enter a valid email address');
  }
  
  // Date of birth validation
  if (!userData.dateOfBirth) {
    errors.push('Date of birth is required');
  } else {
    const age = calculateAge(userData.dateOfBirth);
    if (age < 18) {
      errors.push('You must be 18 or older to use this application');
    } else if (age > 100) {
      errors.push('Please enter a valid date of birth');
    }
  }
  
  // Password validation (basic - more detailed validation in encryption.js)
  if (!userData.password || userData.password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  // Password confirmation
  if (userData.password !== userData.confirmPassword) {
    errors.push('Passwords do not match');
  }
  
  // Consent validation
  if (!userData.consentGiven) {
    errors.push('You must agree to the terms and data processing to continue');
  }
  
  // Check for existing users
  const existingUsers = getUsers();
  const existingUsernames = existingUsers.map(u => u.username.toLowerCase());
  const existingEmails = existingUsers.map(u => u.email.toLowerCase());
  
  if (existingUsernames.includes(userData.username.toLowerCase().trim())) {
    errors.push('Username is already taken');
  }
  
  if (existingEmails.includes(userData.email.toLowerCase().trim())) {
    errors.push('Email is already registered');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Registers a new user
 * @param {Object} userData - User registration data
 * @returns {Promise<Object>} - Registration result
 */
export const registerUser = async (userData) => {
  try {
    // Validate data
    const validation = validateRegistrationData(userData);
    if (!validation.isValid) {
      return {
        success: false,
        errors: validation.errors
      };
    }
    
    // Hash password
    const { hash, salt } = await hashPassword(userData.password);
    
    // Encrypt sensitive data (DOB)
    const encryptedDob = await encryptData(userData.dateOfBirth, userData.password);
    
    // Create user object
    const newUser = {
      id: generateUserId(),
      username: sanitizeInput(userData.username.trim()),
      email: userData.email.toLowerCase().trim(),
      encryptedDob: encryptedDob,
      passwordHash: hash,
      passwordSalt: salt,
      registrationDate: new Date().toISOString(),
      lastLoginDate: null,
      consentGiven: true,
      consentDate: new Date().toISOString(),
      researchDataConsent: userData.researchDataConsent || false,
      profileData: {
        // Will be populated during research questionnaire if consented
        education: null,
        demographics: null,
        applicationStatus: null
      },
      settings: {
        emailNotifications: false,
        dataRetention: true
      }
    };
    
    // Save user
    const users = getUsers();
    users.push(newUser);
    
    if (saveUsers(users)) {
      return {
        success: true,
        user: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          registrationDate: newUser.registrationDate,
          researchDataConsent: newUser.researchDataConsent
        }
      };
    } else {
      return {
        success: false,
        errors: ['Failed to save user data. Please try again.']
      };
    }
    
  } catch (error) {
    console.error('Error registering user:', error);
    return {
      success: false,
      errors: ['An unexpected error occurred. Please try again.']
    };
  }
};

/**
 * Authenticates a user login
 * @param {string} usernameOrEmail - Username or email
 * @param {string} password - Password
 * @returns {Promise<Object>} - Login result
 */
export const loginUser = async (usernameOrEmail, password) => {
  try {
    const users = getUsers();
    const identifier = usernameOrEmail.toLowerCase().trim();
    
    // Find user by username or email
    const user = users.find(u => 
      u.username.toLowerCase() === identifier || 
      u.email.toLowerCase() === identifier
    );
    
    if (!user) {
      return {
        success: false,
        error: 'Invalid username/email or password'
      };
    }
    
    // Verify password
    const isValidPassword = await verifyPassword(password, user.passwordHash, user.passwordSalt);
    
    if (!isValidPassword) {
      return {
        success: false,
        error: 'Invalid username/email or password'
      };
    }
    
    // Update last login date
    user.lastLoginDate = new Date().toISOString();
    saveUsers(users);
    
    // Create session
    const session = {
      userId: user.id,
      username: user.username,
      email: user.email,
      loginTime: new Date().toISOString(),
      expiresAt: new Date(Date.now() + SESSION_TIMEOUT).toISOString(),
      researchDataConsent: user.researchDataConsent
    };
    
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(session));
    
    return {
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        lastLoginDate: user.lastLoginDate,
        registrationDate: user.registrationDate,
        researchDataConsent: user.researchDataConsent
      }
    };
    
  } catch (error) {
    console.error('Error logging in user:', error);
    return {
      success: false,
      error: 'An unexpected error occurred. Please try again.'
    };
  }
};

/**
 * Gets current logged-in user session
 * @returns {Object|null} - Current user session or null
 */
export const getCurrentUser = () => {
  try {
    const session = localStorage.getItem(CURRENT_USER_KEY);
    if (!session) return null;
    
    const sessionData = JSON.parse(session);
    
    // Check if session is expired
    const now = new Date();
    const expiresAt = new Date(sessionData.expiresAt);
    
    if (now > expiresAt) {
      localStorage.removeItem(CURRENT_USER_KEY);
      return null;
    }
    
    return sessionData;
  } catch (error) {
    console.error('Error getting current user:', error);
    localStorage.removeItem(CURRENT_USER_KEY);
    return null;
  }
};

/**
 * Logs out the current user
 * @returns {boolean} - Success status
 */
export const logoutUser = () => {
  try {
    localStorage.removeItem(CURRENT_USER_KEY);
    return true;
  } catch (error) {
    console.error('Error logging out user:', error);
    return false;
  }
};

/**
 * Updates user research data (from questionnaire)
 * @param {string} userId - User ID
 * @param {Object} researchData - Research data to save
 * @returns {boolean} - Success status
 */
export const updateUserResearchData = (userId, researchData) => {
  try {
    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) return false;
    
    // Sanitize and save research data
    users[userIndex].profileData = {
      education: researchData.education ? {
        undergraduateDegree: sanitizeInput(researchData.undergraduateDegree || ''),
        university: sanitizeInput(researchData.university || ''),
        degreeClassification: sanitizeInput(researchData.degreeClassification || ''),
        graduationYear: parseInt(researchData.graduationYear) || null
      } : null,
      demographics: researchData.demographics ? {
        gender: sanitizeInput(researchData.gender || ''),
        ethnicity: sanitizeInput(researchData.ethnicity || ''),
        firstLanguage: sanitizeInput(researchData.firstLanguage || ''),
        disabilityStatus: sanitizeInput(researchData.disabilityStatus || '')
      } : null,
      applicationStatus: researchData.applicationStatus ? {
        universitiesApplied: researchData.universitiesApplied || [],
        applicationYear: parseInt(researchData.applicationYear) || null,
        interviewInvitations: researchData.interviewInvitations || [],
        offersReceived: researchData.offersReceived || []
      } : null
    };
    
    users[userIndex].profileData.completedAt = new Date().toISOString();
    
    return saveUsers(users);
  } catch (error) {
    console.error('Error updating user research data:', error);
    return false;
  }
};

/**
 * Gets user profile data including decrypted sensitive information
 * @param {string} userId - User ID
 * @param {string} password - User's password (for decryption)
 * @returns {Promise<Object|null>} - User profile data or null
 */
export const getUserProfile = async (userId, password) => {
  try {
    const users = getUsers();
    const user = users.find(u => u.id === userId);
    
    if (!user) return null;
    
    // Decrypt DOB
    const dateOfBirth = await decryptData(user.encryptedDob, password);
    const age = calculateAge(dateOfBirth);
    
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      age: age,
      dateOfBirth: dateOfBirth,
      registrationDate: user.registrationDate,
      lastLoginDate: user.lastLoginDate,
      consentGiven: user.consentGiven,
      consentDate: user.consentDate,
      researchDataConsent: user.researchDataConsent,
      profileData: user.profileData,
      settings: user.settings
    };
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
};

/**
 * Deletes a user account and all associated data
 * @param {string} userId - User ID
 * @param {string} password - User's password for verification
 * @returns {Promise<boolean>} - Success status
 */
export const deleteUserAccount = async (userId, password) => {
  try {
    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) return false;
    
    // Verify password before deletion
    const user = users[userIndex];
    const isValidPassword = await verifyPassword(password, user.passwordHash, user.passwordSalt);
    
    if (!isValidPassword) return false;
    
    // Remove user from users array
    users.splice(userIndex, 1);
    saveUsers(users);
    
    // Remove current session if it's this user
    const currentUser = getCurrentUser();
    if (currentUser && currentUser.userId === userId) {
      logoutUser();
    }
    
    // Clear user's test history
    const testHistoryKey = `dclinpsy-sjt-test-history-${userId}`;
    localStorage.removeItem(testHistoryKey);
    
    return true;
  } catch (error) {
    console.error('Error deleting user account:', error);
    return false;
  }
};

/**
 * Exports user data for GDPR compliance
 * @param {string} userId - User ID
 * @param {string} password - User's password for verification
 * @returns {Promise<Object|null>} - User data export or null
 */
export const exportUserData = async (userId, password) => {
  try {
    const profile = await getUserProfile(userId, password);
    if (!profile) return null;
    
    // Get user's test history
    const testHistoryKey = `dclinpsy-sjt-test-history-${userId}`;
    const testHistory = localStorage.getItem(testHistoryKey);
    
    return {
      exportDate: new Date().toISOString(),
      userData: profile,
      testHistory: testHistory ? JSON.parse(testHistory) : [],
      note: 'This export contains all personal data stored about your account in the DClinPsy SJT Practice application.'
    };
  } catch (error) {
    console.error('Error exporting user data:', error);
    return null;
  }
};

/**
 * Checks if current session is valid
 * @returns {boolean} - Whether user is authenticated
 */
export const isAuthenticated = () => {
  const currentUser = getCurrentUser();
  return currentUser !== null;
};

/**
 * Rate limiting for authentication attempts
 */
let loginAttempts = {};

export const checkRateLimit = (identifier) => {
  const now = Date.now();
  const key = identifier.toLowerCase();
  
  if (!loginAttempts[key]) {
    loginAttempts[key] = { count: 0, lastAttempt: now };
  }
  
  const attempts = loginAttempts[key];
  
  // Reset if more than 15 minutes have passed
  if (now - attempts.lastAttempt > 15 * 60 * 1000) {
    attempts.count = 0;
  }
  
  attempts.lastAttempt = now;
  attempts.count++;
  
  // Allow up to 5 attempts per 15 minutes
  return attempts.count <= 5;
};
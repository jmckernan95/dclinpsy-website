/**
 * Client-side encryption utilities for sensitive data
 * Uses Web Crypto API for secure password hashing and data encryption
 */

/**
 * Check if Web Crypto API is available
 */
const isWebCryptoAvailable = () => {
  return typeof crypto !== 'undefined' && 
         typeof crypto.subtle !== 'undefined' && 
         typeof crypto.getRandomValues !== 'undefined';
};

/**
 * Fallback hash function using simple built-in methods (less secure but functional)
 */
const fallbackHashPassword = async (password, salt = null) => {
  // Generate salt if not provided
  if (!salt) {
    // Fallback random salt generation
    const chars = '0123456789abcdef';
    salt = '';
    for (let i = 0; i < 32; i++) {
      salt += chars[Math.floor(Math.random() * chars.length)];
    }
  }
  
  // Simple hash using built-in methods (not cryptographically secure, but functional)
  const combined = password + salt;
  let hash = '';
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  // Convert to hex and pad
  const hashHex = Math.abs(hash).toString(16).padStart(8, '0') + 
                  Math.abs(hash * 31).toString(16).padStart(8, '0') +
                  Math.abs(hash * 37).toString(16).padStart(8, '0') +
                  Math.abs(hash * 41).toString(16).padStart(8, '0');
  
  return {
    hash: hashHex.substring(0, 64), // 64 char hex string
    salt: salt
  };
};

/**
 * Hashes a password using PBKDF2 (or fallback method)
 * @param {string} password - The password to hash
 * @param {string} salt - Optional salt (will generate if not provided)
 * @returns {Promise<Object>} - Object containing hash and salt
 */
export const hashPassword = async (password, salt = null) => {
  try {
    // Check if Web Crypto API is available
    if (!isWebCryptoAvailable()) {
      console.warn('Web Crypto API not available, using fallback hash method');
      return await fallbackHashPassword(password, salt);
    }

    // Generate salt if not provided
    if (!salt) {
      const saltBuffer = crypto.getRandomValues(new Uint8Array(16));
      salt = Array.from(saltBuffer, byte => byte.toString(16).padStart(2, '0')).join('');
    } else {
      // Convert hex string back to Uint8Array
      salt = new Uint8Array(salt.match(/.{2}/g).map(byte => parseInt(byte, 16)));
    }

    // Convert password to buffer
    const encoder = new TextEncoder();
    const passwordBuffer = encoder.encode(password);

    // Import password as key material
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      passwordBuffer,
      { name: 'PBKDF2' },
      false,
      ['deriveBits']
    );

    // Generate hash using PBKDF2
    const hashBuffer = await crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      256
    );

    // Convert to hex string
    const hashArray = new Uint8Array(hashBuffer);
    const hashHex = Array.from(hashArray, byte => byte.toString(16).padStart(2, '0')).join('');
    const saltHex = Array.from(salt, byte => byte.toString(16).padStart(2, '0')).join('');

    return {
      hash: hashHex,
      salt: saltHex
    };
  } catch (error) {
    console.error('Error hashing password with Web Crypto API, trying fallback:', error);
    // Fall back to simple method if Web Crypto fails
    try {
      return await fallbackHashPassword(password, salt);
    } catch (fallbackError) {
      console.error('Fallback hash also failed:', fallbackError);
      throw new Error('Failed to hash password');
    }
  }
};

/**
 * Verifies a password against a stored hash
 * @param {string} password - The password to verify
 * @param {string} storedHash - The stored hash
 * @param {string} storedSalt - The stored salt
 * @returns {Promise<boolean>} - Whether the password matches
 */
export const verifyPassword = async (password, storedHash, storedSalt) => {
  try {
    const result = await hashPassword(password, storedSalt);
    return result.hash === storedHash;
  } catch (error) {
    console.error('Error verifying password:', error);
    return false;
  }
};

/**
 * Fallback encryption using simple XOR (not secure but functional)
 */
const fallbackEncryptData = async (plaintext, password) => {
  // Simple XOR encryption as fallback
  let encrypted = '';
  for (let i = 0; i < plaintext.length; i++) {
    const keyChar = password.charCodeAt(i % password.length);
    const textChar = plaintext.charCodeAt(i);
    encrypted += String.fromCharCode(textChar ^ keyChar);
  }
  // Encode to base64 to make it safe for storage
  return btoa(encrypted);
};

/**
 * Simple encryption for sensitive but non-critical data (like DOB)
 * Uses AES-GCM for authenticated encryption (or fallback method)
 * @param {string} plaintext - The data to encrypt
 * @param {string} password - Password for encryption
 * @returns {Promise<string>} - Encrypted data as base64 string
 */
export const encryptData = async (plaintext, password) => {
  try {
    // Check if Web Crypto API is available
    if (!isWebCryptoAvailable()) {
      console.warn('Web Crypto API not available, using fallback encryption');
      return await fallbackEncryptData(plaintext, password);
    }

    const encoder = new TextEncoder();
    const data = encoder.encode(plaintext);
    
    // Generate a random IV
    const iv = crypto.getRandomValues(new Uint8Array(12));
    
    // Derive key from password
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      encoder.encode(password),
      { name: 'PBKDF2' },
      false,
      ['deriveKey']
    );
    
    const key = await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: encoder.encode('dclinpsy-sjt-salt'), // Fixed salt for simplicity
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt']
    );
    
    // Encrypt the data
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv: iv },
      key,
      data
    );
    
    // Combine IV and encrypted data
    const combined = new Uint8Array(iv.length + encrypted.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(encrypted), iv.length);
    
    // Convert to base64
    return btoa(String.fromCharCode.apply(null, combined));
  } catch (error) {
    console.error('Error encrypting data with Web Crypto API, trying fallback:', error);
    try {
      return await fallbackEncryptData(plaintext, password);
    } catch (fallbackError) {
      console.error('Fallback encryption also failed:', fallbackError);
      throw new Error('Failed to encrypt data');
    }
  }
};

/**
 * Fallback decryption using simple XOR (matches fallback encryption)
 */
const fallbackDecryptData = async (encryptedData, password) => {
  try {
    // Decode from base64
    const encrypted = atob(encryptedData);
    
    // Simple XOR decryption
    let decrypted = '';
    for (let i = 0; i < encrypted.length; i++) {
      const keyChar = password.charCodeAt(i % password.length);
      const encryptedChar = encrypted.charCodeAt(i);
      decrypted += String.fromCharCode(encryptedChar ^ keyChar);
    }
    return decrypted;
  } catch (error) {
    console.error('Fallback decryption failed:', error);
    throw new Error('Failed to decrypt data');
  }
};

/**
 * Decrypts data encrypted with encryptData
 * @param {string} encryptedData - Base64 encoded encrypted data
 * @param {string} password - Password for decryption
 * @returns {Promise<string>} - Decrypted plaintext
 */
export const decryptData = async (encryptedData, password) => {
  try {
    // If Web Crypto API is not available, try fallback first
    if (!isWebCryptoAvailable()) {
      console.warn('Web Crypto API not available, using fallback decryption');
      return await fallbackDecryptData(encryptedData, password);
    }

    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    
    // Convert from base64
    const combined = new Uint8Array(atob(encryptedData).split('').map(char => char.charCodeAt(0)));
    
    // Check if this looks like fallback encrypted data (too short for AES-GCM with IV)
    if (combined.length < 12) {
      console.warn('Data appears to be fallback encrypted, using fallback decryption');
      return await fallbackDecryptData(encryptedData, password);
    }
    
    // Extract IV and encrypted data
    const iv = combined.slice(0, 12);
    const encrypted = combined.slice(12);
    
    // Derive key from password
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      encoder.encode(password),
      { name: 'PBKDF2' },
      false,
      ['deriveKey']
    );
    
    const key = await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: encoder.encode('dclinpsy-sjt-salt'),
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['decrypt']
    );
    
    // Decrypt the data
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: iv },
      key,
      encrypted
    );
    
    return decoder.decode(decrypted);
  } catch (error) {
    console.error('Error decrypting data with Web Crypto API, trying fallback:', error);
    try {
      return await fallbackDecryptData(encryptedData, password);
    } catch (fallbackError) {
      console.error('Fallback decryption also failed:', fallbackError);
      throw new Error('Failed to decrypt data');
    }
  }
};

/**
 * Validates password strength
 * @param {string} password - Password to validate
 * @returns {Object} - Validation result with isValid and messages
 */
export const validatePasswordStrength = (password) => {
  const messages = [];
  let isValid = true;

  if (password.length < 8) {
    messages.push('Password must be at least 8 characters long');
    isValid = false;
  }

  if (!/[a-z]/.test(password)) {
    messages.push('Password must contain at least one lowercase letter');
    isValid = false;
  }

  if (!/[A-Z]/.test(password)) {
    messages.push('Password must contain at least one uppercase letter');
    isValid = false;
  }

  if (!/\d/.test(password)) {
    messages.push('Password must contain at least one number');
    isValid = false;
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    messages.push('Password must contain at least one special character');
    isValid = false;
  }

  return {
    isValid,
    messages,
    strength: isValid ? 'strong' : messages.length <= 2 ? 'medium' : 'weak'
  };
};

/**
 * Validates email format
 * @param {string} email - Email to validate
 * @returns {boolean} - Whether email is valid
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Calculates age from date of birth
 * @param {string} dateOfBirth - Date in YYYY-MM-DD format
 * @returns {number} - Age in years
 */
export const calculateAge = (dateOfBirth) => {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

/**
 * Sanitizes user input to prevent XSS
 * @param {string} input - Input to sanitize
 * @returns {string} - Sanitized input
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return '';
  
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};
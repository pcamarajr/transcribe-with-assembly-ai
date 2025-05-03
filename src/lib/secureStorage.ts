/**
 * Secure storage utilities for sensitive data like API keys
 * Uses a simple encryption mechanism combined with localStorage
 */

// A simple encryption function for client-side security
// Note: This is not bulletproof but adds a layer of obfuscation
const encrypt = (text: string): string => {
  try {
    // Basic encryption using btoa and character manipulation
    const encoded = btoa(text);
    // Add some character manipulation to make it less obvious
    return encoded
      .split("")
      .map((char) => char.charCodeAt(0).toString(16))
      .join("");
  } catch (error) {
    console.error("Encryption failed:", error);
    return "";
  }
};

// Decryption function that reverses the encryption
const decrypt = (encryptedText: string): string => {
  try {
    // Reverse the character manipulation
    const chunks = encryptedText.match(/.{1,2}/g) || [];
    const encoded = chunks
      .map((hex) => String.fromCharCode(parseInt(hex, 16)))
      .join("");
    // Decode from base64
    return atob(encoded);
  } catch (error) {
    console.error("Decryption failed:", error);
    return "";
  }
};

const STORAGE_KEY = "cautious_breeze";

export const secureStorage = {
  // Set a value securely
  setItem: (value: string): void => {
    try {
      const encryptedValue = encrypt(value);
      localStorage.setItem(STORAGE_KEY, encryptedValue);
    } catch (error) {
      console.error("Failed to securely store item:", error);
    }
  },

  // Get a value securely
  getItem: (): string | null => {
    try {
      const encryptedValue = localStorage.getItem(STORAGE_KEY);
      if (!encryptedValue) return null;
      return decrypt(encryptedValue);
    } catch (error) {
      console.error("Failed to retrieve secure item:", error);
      return null;
    }
  },

  // Remove the value
  removeItem: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Failed to remove secure item:", error);
    }
  },

  // Check if value exists
  hasItem: (): boolean => {
    return !!localStorage.getItem(STORAGE_KEY);
  },
};

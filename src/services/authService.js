/**
 * Auth Service
 * 
 * Handles customer authentication using Firebase Auth.
 * Replaces the Shopify customer authentication.
 */

import { auth } from './firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
} from 'firebase/auth';

/**
 * Register a new customer
 * @param {string} email
 * @param {string} password
 * @param {string} firstName
 * @param {string} lastName
 */
export async function registerCustomer(email, password, firstName, lastName = '') {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update displayName with first + last name
    const displayName = `${firstName}${lastName ? ' ' + lastName : ''}`;
    await updateProfile(user, { displayName });

    return {
      id: user.uid,
      email: user.email,
      name: displayName,
      firstName,
      lastName,
    };
  } catch (error) {
    console.error("Error registering customer:", error);
    // Map Firebase error codes to user-friendly messages
    switch (error.code) {
      case 'auth/email-already-in-use':
        throw new Error('An account with this email already exists.');
      case 'auth/weak-password':
        throw new Error('Password should be at least 6 characters.');
      case 'auth/invalid-email':
        throw new Error('Please enter a valid email address.');
      default:
        throw new Error(error.message || 'Registration failed. Please try again.');
    }
  }
}

/**
 * Log in a customer
 * @param {string} email
 * @param {string} password
 */
export async function loginCustomer(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    return {
      id: user.uid,
      email: user.email,
      name: user.displayName || email.split('@')[0],
    };
  } catch (error) {
    console.error("Error logging in:", error);
    switch (error.code) {
      case 'auth/user-not-found':
        throw new Error('No account found with this email.');
      case 'auth/wrong-password':
        throw new Error('Incorrect password.');
      case 'auth/invalid-credential':
        throw new Error('Invalid email or password.');
      case 'auth/too-many-requests':
        throw new Error('Too many failed attempts. Please try again later.');
      default:
        throw new Error(error.message || 'Login failed. Please try again.');
    }
  }
}

/**
 * Log out the current customer
 */
export async function logoutCustomer() {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
}

/**
 * Get the current authenticated user
 * Returns a promise that resolves with the user or null
 */
export function getCurrentUser() {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      if (user) {
        resolve({
          id: user.uid,
          email: user.email,
          name: user.displayName || user.email.split('@')[0],
        });
      } else {
        resolve(null);
      }
    });
  });
}

/**
 * Subscribe to auth state changes
 * @param {Function} callback - Called with user object or null
 * @returns {Function} unsubscribe function
 */
export function onAuthChange(callback) {
  return onAuthStateChanged(auth, (user) => {
    if (user) {
      callback({
        id: user.uid,
        email: user.email,
        name: user.displayName || user.email.split('@')[0],
      });
    } else {
      callback(null);
    }
  });
}

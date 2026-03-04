/**
 * Product Review Service
 * 
 * Handles reading and writing product reviews in Firestore.
 */

import { db } from './firebase';
import {
  collection,
  doc,
  getDocs,
  addDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';

const REVIEWS_COLLECTION = 'reviews';

/**
 * Fetch all reviews for a specific product
 * @param {string} productId
 */
export async function fetchReviewsByProduct(productId) {
  try {
    const q = query(
      collection(db, REVIEWS_COLLECTION),
      where('productId', '==', productId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
    }));
  } catch (error) {
    console.error(`Error fetching reviews for product ${productId}:`, error);
    return [];
  }
}

/**
 * Add a new review for a product
 * @param {Object} reviewData - { productId, userName, userEmail, rating, comment }
 */
export async function addReview(reviewData) {
  try {
    const docRef = await addDoc(collection(db, REVIEWS_COLLECTION), {
      ...reviewData,
      createdAt: serverTimestamp(),
    });
    return { id: docRef.id, ...reviewData, createdAt: new Date() };
  } catch (error) {
    console.error("Error adding review:", error);
    throw error;
  }
}

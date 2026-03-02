/**
 * Order Service
 * 
 * Handles saving and fetching user orders in Firestore.
 */

import { db } from './firebase';
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';

const ORDERS_COLLECTION = 'orders';

/**
 * Save a new order to Firestore
 * @param {Object} orderData - { userId, items, total, address, paymentId, orderId }
 */
export async function saveOrder(orderData) {
  try {
    const docRef = await addDoc(collection(db, ORDERS_COLLECTION), {
      ...orderData,
      status: 'Processing',
      createdAt: serverTimestamp(),
    });
    return { id: docRef.id, ...orderData };
  } catch (error) {
    console.error("Error saving order:", error);
    throw error;
  }
}

/**
 * Fetch orders for a specific user
 * @param {string} userId
 */
export async function fetchUserOrders(userId) {
  try {
    const q = query(
      collection(db, ORDERS_COLLECTION),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().createdAt?.toDate().toLocaleDateString() || 'Recently',
    }));
  } catch (error) {
    console.error("Error fetching user orders:", error);
    // If it's an index error, fallback to un-ordered fetch
    try {
        const q = query(
            collection(db, ORDERS_COLLECTION),
            where('userId', '==', userId)
          );
          const snapshot = await getDocs(q);
          return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            date: doc.data().createdAt?.toDate().toLocaleDateString() || 'Recently',
          }));
    } catch (e) {
        return [];
    }
  }
}

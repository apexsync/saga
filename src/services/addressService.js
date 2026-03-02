/**
 * Address Service
 * 
 * Handles saving and fetching user delivery addresses in Firestore.
 */

import { db } from './firebase';
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
} from 'firebase/firestore';

const ADDRESSES_COLLECTION = 'addresses';

export async function saveAddress(userId, addressData) {
  try {
    const docRef = await addDoc(collection(db, ADDRESSES_COLLECTION), {
      userId,
      ...addressData,
      createdAt: new Date(),
    });
    return { id: docRef.id, ...addressData };
  } catch (error) {
    console.error("Error saving address:", error);
    throw error;
  }
}

export async function fetchUserAddresses(userId) {
  try {
    const q = query(
      collection(db, ADDRESSES_COLLECTION),
      where('userId', '==', userId)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error fetching addresses:", error);
    return [];
  }
}

export async function updateAddress(addressId, updates) {
  try {
    const docRef = doc(db, ADDRESSES_COLLECTION, addressId);
    await updateDoc(docRef, updates);
    return true;
  } catch (error) {
    console.error("Error updating address:", error);
    throw error;
  }
}

export async function removeAddress(addressId) {
  try {
    const docRef = doc(db, ADDRESSES_COLLECTION, addressId);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error("Error deleting address:", error);
    throw error;
  }
}

/**
 * Product Service
 * 
 * Handles all product-related Firestore operations.
 * This is the READ-only service for the customer-facing Saga app.
 * Products are added/managed through the separate Saga-Admin app.
 */

import { db } from './firebase';
import {
  collection,
  doc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  limit,
} from 'firebase/firestore';

const PRODUCTS_COLLECTION = 'products';

// Helper to format price
const formatPrice = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Normalize a Firestore document to app product format
const normalizeProduct = (docSnapshot) => {
  const data = docSnapshot.data();
  return {
    id: docSnapshot.id,
    name: data.name || '',
    price: formatPrice(data.price || 0),
    rawPrice: data.price || 0,
    category: data.category || '',
    description: data.description || '',
    image: data.imageUrl || '',
    media: data.media || [],
    material: data.material || '',
    purity: data.purity || '',
    weight: data.weight || '',
    sizes: data.sizes || '',
    stock: data.stock || 0,
    metalColor: data.metalColor || '',
    gemstones: data.gemstones || '',
    createdAt: data.createdAt?.toDate() || new Date(),
  };
};

/**
 * Fetch all products
 */
export async function fetchAllProducts() {
  try {
    const q = query(
      collection(db, PRODUCTS_COLLECTION),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(normalizeProduct);
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

/**
 * Fetch products by category
 * @param {string} category - e.g., 'Bangle', 'Bracelet', 'Earring', 'Necklace', 'Pendant', 'Ring'
 */
export async function fetchProductsByCategory(category) {
  try {
    const q = query(
      collection(db, PRODUCTS_COLLECTION),
      where('category', '==', category)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(normalizeProduct);
  } catch (error) {
    console.error(`Error fetching products for category ${category}:`, error);
    return [];
  }
}

/**
 * Fetch a single product by ID
 * @param {string} productId
 */
export async function fetchProductById(productId) {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, productId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return normalizeProduct(docSnap);
    }
    return null;
  } catch (error) {
    console.error(`Error fetching product ${productId}:`, error);
    return null;
  }
}

/**
 * Fetch trending products (latest 8 products)
 */
export async function fetchTrendingProducts() {
  try {
    const q = query(
      collection(db, PRODUCTS_COLLECTION),
      orderBy('createdAt', 'desc'),
      limit(8)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(normalizeProduct);
  } catch (error) {
    console.error("Error fetching trending products:", error);
    return [];
  }
}

/**
 * Search products by name (client-side filtering)
 * Firestore doesn't support native full-text search, so we fetch all and filter.
 * For production at scale, consider Algolia or Typesense integration.
 * @param {string} searchQuery
 */
export async function searchProducts(searchQuery) {
  try {
    const allProducts = await fetchAllProducts();
    const lowerQuery = searchQuery.toLowerCase();
    return allProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(lowerQuery) ||
        product.category.toLowerCase().includes(lowerQuery) ||
        product.description.toLowerCase().includes(lowerQuery)
    );
  } catch (error) {
    console.error("Error searching products:", error);
    return [];
  }
}

/**
 * Fetch Festive Edit content
 * Uses a separate 'festive_edit' collection or returns defaults
 */
export async function fetchFestiveEdit() {
  // This is CMS-like content. For now, return static defaults.
  // In the future, the admin can manage this through Firestore.
  return {
    items: [
      { src: '/pl2.jpg', alt: 'Festive Look 1' },
      { src: '/pl1.jpg', alt: 'Festive Look 2' },
      { src: '/pl1.jpg', alt: 'Festive Look 3' },
      { src: '/pl2.jpg', alt: 'Festive Look 4' },
    ],
    banner: { src: '/stock1.jpg', alt: 'Traditional Coming Soon' },
  };
}

import React, { useState, useEffect } from 'react';
import ProductPageLayout from '../Components/ProductPageLayout';
import { fetchProductsByCategory } from '../services/shopify';

const Bangles = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProductsByCategory('Bangle');
        setProducts(data);
      } catch (error) {
        console.error("Error fetching bangles:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black pt-32 flex justify-center">
        <div className="text-white text-xl">Loading Bangles...</div>
      </div>
    );
  }

  return (
    <>
      <ProductPageLayout title="Bangles" products={products} />
    </>
  );
};

export default Bangles;

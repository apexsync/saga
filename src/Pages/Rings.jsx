import React, { useState, useEffect } from 'react';
import ProductPageLayout from '../Components/ProductPageLayout';
import { fetchProductsByCategory } from '../services/products';

const Rings = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProductsByCategory('Rings');
        setProducts(data);
      } catch (error) {
        console.error("Error fetching rings:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black pt-32 flex justify-center">
        <div className="text-white text-xl">Loading Rings...</div>
      </div>
    );
  }

  return (
    <ProductPageLayout title="Rings" products={products} />
  );
};

export default Rings;
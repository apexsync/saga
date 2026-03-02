import React, { useState, useEffect } from 'react';
import ProductPageLayout from '../Components/ProductPageLayout';
import { fetchProductsByCategory } from '../services/products';

const Earrings = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProductsByCategory('Earrings');
        setProducts(data);
      } catch (error) {
        console.error("Error fetching earrings:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black pt-32 flex justify-center">
        <div className="text-white text-xl">Loading Earrings...</div>
      </div>
    );
  }

  return (
    <ProductPageLayout title="Earrings" products={products} />
  );
};

export default Earrings;
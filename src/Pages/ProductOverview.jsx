import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../Context/CartContext';
import { fetchAllProducts } from '../services/products';
import CircularHorizontalScroll from '../Components/CircularHorizontalScroll';

const ProductOverview = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const getProducts = async () => {
      try {
        const data = await fetchAllProducts();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    getProducts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black pt-32 flex justify-center items-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <div className="text-zinc-400 text-xl font-Poppins tracking-widest">LOADING COLLECTION...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-20 px-4 min-h-screen bg-transparent">
      <CircularHorizontalScroll />
      
      <div className="w-[90vw] max-w-7xl mx-auto text-zinc-300 text-sm font-medium p-4 mt-6">
        <Link to="/" className="hover:text-primary transition-colors">Home</Link>
        <span className="mx-2 text-zinc-500">•</span>
        <span className="text-white">Product Overview</span>
      </div>

      <div className="text-center mb-16 relative">
        <h1 className="text-white font-Great_Vibes text-7xl md:text-8xl mb-2 tracking-wider drop-shadow-lg">Our Collection</h1>
        <div className="w-24 h-1 bg-primary mx-auto rounded-full opacity-60"></div>
        <p className="text-zinc-200 mt-6 font-Poppins text-xl max-w-2xl mx-auto px-4 leading-relaxed">
          Discover our exquisite range of handcrafted jewelry, where every piece tells a story of elegance and timeless beauty.
        </p>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {products.map((product) => (
            <div 
              key={product.id}
              onClick={() => navigate(`/product/${product.id}`)}
              className="bg-black/30 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/10 group h-full flex flex-col hover:border-primary/50 transition-all duration-700 hover:shadow-[0_0_50px_rgba(251,112,16,0.15)] cursor-pointer"
            >
              <div className="relative h-80 overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
                <div className="absolute top-4 left-4">
                  <span className="text-white text-[10px] font-bold tracking-[0.2em] uppercase bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                    {product.category}
                  </span>
                </div>
              </div>

              <div className="p-8 flex flex-col flex-grow bg-gradient-to-b from-transparent to-black/20">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-white text-2xl font-Poppins font-medium line-clamp-1 group-hover:text-primary transition-colors tracking-tight">
                    {product.name}
                  </h3>
                  <p className="text-primary font-bold text-xl font-Poppins whitespace-nowrap ml-4">
                    {product.price}
                  </p>
                </div>

                <p className="text-zinc-300 text-sm font-Poppins leading-relaxed mb-8 line-clamp-3 group-hover:text-white transition-colors">
                  {product.description || "A masterfully crafted piece designed to capture the essence of sophistication and grace. Perfect for any occasion that calls for a touch of brilliance."}
                </p>

                <div className="mt-auto pt-6 border-t border-white/5">
                  <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product);
                    }}
                    className="w-full group/btn relative overflow-hidden bg-white/5 text-white py-4 rounded-2xl font-bold transition-all duration-500 hover:bg-primary hover:text-black active:scale-[0.98] border border-white/10 hover:border-primary shadow-lg"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                        </svg>
                        Add to Bag
                    </span>
                    <div className="absolute inset-0 bg-primary transform translate-y-full transition-transform duration-500 group-hover/btn:translate-y-0"></div>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductOverview;

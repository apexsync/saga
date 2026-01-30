import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../Context/CartContext';
import CircularHorizontalScroll from './CircularHorizontalScroll';

const ProductPageLayout = ({ title, products }) => {
  const [isScrolling, setIsScrolling] = useState(false);
  const [hoveredId, setHoveredId] = useState(null);
  const [showBlur, setShowBlur] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    let timeoutId;
    const handleScroll = () => {
      setIsScrolling(true);
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsScrolling(false);
      }, 150);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    let timer;
    if (hoveredId && !isScrolling) {
      timer = setTimeout(() => {
        setShowBlur(true);
      }, 1250);
    } else {
      setShowBlur(false);
    }
    return () => clearTimeout(timer);
  }, [hoveredId, isScrolling]);

  return (
    <div className="pt-28 pb-10 px-4 min-h-screen bg-black">
          <CircularHorizontalScroll />
      <div className="w-[90vw] m-auto text-zinc-400 text-sm font-medium p-4">
        <Link to="/" className="hover:text-primary transition-colors">Home</Link>
        <span className="mx-2">•</span>
        <span className="text-white">{title}</span>
      </div>
      <h1 className="text-white text-center font-Great_Vibes text-6xl mb-12 mt-10 md:mt-0 tracking-wider">{title}</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {products.map((item) => (
          <div 
            key={item.id} 
            onMouseEnter={() => setHoveredId(item.id)}
            onMouseLeave={() => setHoveredId(null)}
            className={`bg-zinc-900 rounded-xl overflow-hidden shadow-lg transition-all duration-500 cursor-pointer border border-zinc-800 group flex flex-col h-[18rem] md:h-auto
            hover:scale-105 hover:z-10 hover:shadow-primary/50 hover:border-primary
            ${showBlur && hoveredId !== item.id ? 'md:blur-sm' : ''}
            `}
          >
            <div className="h-1/2 md:h-64 overflow-hidden relative">
              <img 
                src={item.image} 
                alt={item.name} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300"></div>
            </div>
            <div className="p-3 md:p-5 flex flex-col justify-center h-1/2 md:h-auto gap-2 md:gap-3">
              <h3 className="text-white text-lg md:text-xl font-Poppins tracking-wide text-center group-hover:text-primary transition-colors line-clamp-1">{item.name}</h3>
              <p className="text-zinc-400 text-center font-semibold text-sm md:text-base group-hover:text-white">{item.price}</p>
              <button 
                onClick={(e) => {
                  e.stopPropagation(); // Prevent card click if there's one
                  addToCart(item);
                  e.target.textContent = "Added!";
                }}
                className="w-full bg-zinc-800 text-white py-1.5 md:py-2 rounded-lg hover:bg-primary hover:text-black transition-colors duration-300 font-medium mt-1 md:mt-2 text-sm md:text-base active:scale-95 transform"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductPageLayout;

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../Context/CartContext';
import CircularHorizontalScroll from './CircularHorizontalScroll';

const ProductPageLayout = ({ title, products }) => {
  const [isScrolling, setIsScrolling] = useState(false);
  const [hoveredId, setHoveredId] = useState(null);
  const [showBlur, setShowBlur] = useState(false);
  const { addToCart } = useCart();
  const navigate = useNavigate();

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
      <div className="w-[90vw] m-auto text-zinc-300 text-sm font-medium p-4 drop-shadow-sm">
        <Link to="/" className="hover:text-primary transition-colors">Home</Link>
        <span className="mx-2 text-zinc-500">•</span>
        <span className="text-white">{title}</span>
      </div>
      <h1 className="text-white text-center font-Great_Vibes text-7xl md:text-8xl mb-16 mt-10 md:mt-6 tracking-wider drop-shadow-lg">{title}</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
        {products.map((item) => (
          <div 
            key={item.id} 
            onMouseEnter={() => setHoveredId(item.id)}
            onMouseLeave={() => setHoveredId(null)}
            onClick={() => navigate(`/product/${item.id}`)}
            className={`bg-black/30 backdrop-blur-xl rounded-[2rem] overflow-hidden shadow-2xl transition-all duration-700 cursor-pointer border border-white/10 group flex flex-col h-[22rem] md:h-auto
            hover:scale-[1.03] hover:z-10 hover:shadow-primary/20 hover:border-primary/50
            ${showBlur && hoveredId !== item.id ? 'md:blur-sm' : ''}
            `}
          >
            <div className="h-48 md:h-72 overflow-hidden relative">
              <img 
                src={item.image} 
                alt={item.name} 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            </div>
            <div className="p-5 md:p-8 flex flex-col justify-between flex-grow gap-4 bg-gradient-to-b from-transparent to-black/20">
              <div className="space-y-2">
                <h3 className="text-white text-xl md:text-2xl font-Poppins font-medium tracking-tight text-center group-hover:text-primary transition-colors line-clamp-1">{item.name}</h3>
                <p className="text-primary text-center font-bold text-lg md:text-xl drop-shadow-sm">{item.price}</p>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart(item);
                  e.target.textContent = "Added!";
                }}
                className="w-full bg-white/5 text-white py-3 md:py-4 rounded-xl hover:bg-primary hover:text-black transition-all duration-500 font-bold text-sm md:text-base border border-white/10 hover:border-primary active:scale-95 shadow-lg"
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

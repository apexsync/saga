

import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Static category data — these are the fixed categories in the store
const CATEGORIES = [
  { id: 'bangles', name: 'Bangles', handle: 'bangles', image: '/pl1.jpg' },
  { id: 'bracelets', name: 'Bracelets', handle: 'bracelets', image: '/pl2.jpg' },
  { id: 'earrings', name: 'Earrings', handle: 'earrings', image: '/pl1.jpg' },
  { id: 'necklaces', name: 'Necklaces', handle: 'necklaces', image: '/pl2.jpg' },
  { id: 'pendants', name: 'Pendants', handle: 'pendants', image: '/pl1.jpg' },
  { id: 'rings', name: 'Rings', handle: 'rings', image: '/pl2.jpg' },
];

function CircularHorizontalScroll() {
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  // Duplicate for infinite scroll effect
  const categories = [...CATEGORIES, ...CATEGORIES];

  const handleCategoryClick = (handle) => {
    navigate(`/${handle}`);
  };

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  return (
    <div className="md:py-6 relative group/scroll">
        <button 
          onClick={scrollLeft}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full opacity-0 group-hover/scroll:opacity-100 transition-opacity duration-300 pointer-events-auto"
          aria-label="Scroll left"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        
        <button 
          onClick={scrollRight}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full opacity-0 group-hover/scroll:opacity-100 transition-opacity duration-300 pointer-events-auto"
          aria-label="Scroll right"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>

      <div 
        ref={scrollRef}
        className="flex overflow-x-auto whitespace-nowrap py-4 no-scrollbar scroll-smooth w-full md:px-8"
      >
        {[...categories, ...categories].map((category, index) => (
          <div 
            key={`${category.id}-${index}`} 
            className="shrink-0 flex flex-col items-center gap-3 group mx-4 w-20 md:w-24 cursor-pointer"
            onClick={() => handleCategoryClick(category.handle)}
          >
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-zinc-900 shadow-lg flex items-center justify-center border-2 border-zinc-800 group-hover:border-primary group-hover:shadow-primary/20 transition-all duration-300 cursor-pointer overflow-hidden">
              <img 
                src={category.image} 
                alt={category.name} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
              />
            </div>
            <span className="text-zinc-400 text-xs font-semibold tracking-wider uppercase group-hover:text-primary transition-colors duration-300">{category.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CircularHorizontalScroll;

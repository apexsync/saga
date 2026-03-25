

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
    <div className="md:py-10 relative group/scroll w-full">
        {/* Navigation Buttons - Styled with glassmorphism for a premium feel on desktop */}
        <button 
          onClick={scrollLeft}
          className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 
                     bg-black/50 md:bg-zinc-900/80 hover:bg-black/70 md:hover:bg-zinc-800 
                     md:backdrop-blur-md md:border md:border-zinc-700
                     text-white p-3 rounded-full opacity-0 group-hover/scroll:opacity-100 
                     transition-all duration-300 cursor-pointer md:hover:scale-110 md:active:scale-95 md:shadow-xl pointer-events-auto"
          aria-label="Scroll left"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        
        <button 
          onClick={scrollRight}
          className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 
                     bg-black/50 md:bg-zinc-900/80 hover:bg-black/70 md:hover:bg-zinc-800 
                     md:backdrop-blur-md md:border md:border-zinc-700
                     text-white p-3 rounded-full opacity-0 group-hover/scroll:opacity-100 
                     transition-all duration-300 cursor-pointer md:hover:scale-110 md:active:scale-95 md:shadow-xl pointer-events-auto"
          aria-label="Scroll right"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>

      <div 
        ref={scrollRef}
        className="flex overflow-x-auto whitespace-nowrap py-4 md:py-6 px-4 md:px-12 w-full no-scrollbar scroll-smooth gap-4 md:gap-8"
      >
        {[...categories, ...categories].map((category, index) => (
          <div 
            key={`${category.id}-${index}`} 
            className="shrink-0 flex flex-col items-center gap-3 md:gap-4 group cursor-pointer w-20 md:w-auto"
            onClick={() => handleCategoryClick(category.handle)}
          >
            {/* Image Container with Gradient Ring Effect */}
            <div className="w-20 h-20 md:w-38 md:h-38 rounded-full md:p-[3px] 
                            bg-zinc-900 md:bg-gradient-to-br md:from-zinc-700 md:to-zinc-800 
                            md:group-hover:from-primary md:group-hover:to-primary/50
                            transition-all duration-500 md:shadow-lg md:group-hover:shadow-primary/20
                            flex items-center justify-center overflow-hidden">
              <div className="w-full h-full rounded-full overflow-hidden border-2 border-zinc-800 md:border-[3px] md:border-zinc-950 relative bg-zinc-900">
                <img 
                  src={category.image} 
                  alt={category.name} 
                  className="w-full h-full object-cover md:opacity-90 md:group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" 
                />
              </div>
            </div>
            
            <span className="text-zinc-400 text-xs md:text-sm font-semibold md:font-medium tracking-wider md:tracking-[0.2em] uppercase 
                           group-hover:text-primary transition-colors duration-300 md:transform md:group-hover:-translate-y-1">
              {category.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CircularHorizontalScroll;

import React, { useRef, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { fetchTrendingProducts } from '../services/products';

export default function HorizontalCarousal(){
    const [items, setItems] = useState([]);
    const navigate = useNavigate();
    const scrollRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    
    // Refs for physics calculations
    const velX = useRef(0);
    const animationRef = useRef(null);
    const lastX = useRef(0);

    useEffect(() => {
        const loadData = async () => {
            const products = await fetchTrendingProducts();
            setItems(products);
        };
        loadData();
    }, []);

    // Duplicate items to create a "loop" effect
    const loopedItems = items.length > 0 ? [...items, ...items, ...items, ...items] : [];

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartX(e.pageX - scrollRef.current.offsetLeft);
        setScrollLeft(scrollRef.current.scrollLeft);
        lastX.current = e.pageX;
        velX.current = 0;
        
        // Stop any existing momentum
        cancelAnimationFrame(animationRef.current);
        
        scrollRef.current.style.cursor = 'grabbing';
    };

    const handleMouseLeave = () => {
        if (isDragging) {
            setIsDragging(false);
            if (scrollRef.current) scrollRef.current.style.cursor = 'grab';
            beginMomentum();
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        if (scrollRef.current) scrollRef.current.style.cursor = 'grab';
        beginMomentum();
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        
        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = (x - startX) * 1.5; // Drag speed multiplier
        scrollRef.current.scrollLeft = scrollLeft - walk;

        // Calculate velocity for momentum
        const newVel = e.pageX - lastX.current;
        lastX.current = e.pageX;
        velX.current = newVel;
    };

    const beginMomentum = () => {
        cancelAnimationFrame(animationRef.current);
        
        const loop = () => {
            // Apply friction needed to slow down
            velX.current *= 0.95; 
            
            if (Math.abs(velX.current) > 0.5) {
                if (scrollRef.current) {
                    scrollRef.current.scrollLeft -= velX.current * 1.5;
                }
                animationRef.current = requestAnimationFrame(loop);
            }
        };
        loop();
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => cancelAnimationFrame(animationRef.current);
    }, []);

    return(
        <>
            <div className="text-white text-center mt-10">
                <h1 className="font-Great_Vibes md:text-7xl text-5xl text-primary">Trending One's</h1>
                <span className="text-xl mt-5 text-gray-300">Odd's everyone is eyeing</span>
            </div>
            <div className="mt-8 relative w-[90vw] m-auto">
                <div 
                    ref={scrollRef}
                    className="overflow-x-auto whitespace-nowrap py-10 md:px-5 flex gap-8 w-full no-scrollbar cursor-grab select-none"
                    onMouseDown={handleMouseDown}
                    onMouseLeave={handleMouseLeave}
                    onMouseUp={handleMouseUp}
                    onMouseMove={handleMouseMove}
                >
                    {loopedItems.map((item, index) => (
                        <Link 
                            to={`/product/${item.id}`} 
                            key={`${item.id}-${index}`} 
                            className="relative shrink-0 block"
                        >
                             <img 
                                src={item.image} 
                                alt={item.name} 
                                draggable="false"
                                className="md:h-[40vh] h-[30vh] lg:h-[60vh] md:w-[42vw] w-[60vw] lg:w-[28vw] object-cover rounded-2xl hover:scale-105 transform transition-transform duration-300 select-none" 
                            />
                        </Link>
                    ))}
                </div>
            </div>
        </>
    )
}
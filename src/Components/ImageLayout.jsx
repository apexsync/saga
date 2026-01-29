import { useState, useEffect } from 'react';
import { fetchFestiveEdit } from '../services/shopify';

export default function ImageLayout(){
    const [content, setContent] = useState(null);

    useEffect(() => {
        const loadContent = async () => {
            const data = await fetchFestiveEdit();
            setContent(data);
        };
        loadContent();
    }, []);

    if (!content) return null; // Or skeleton

    return(
        <>
        <div className="relative w-[90vw] md:w-[80vw] m-auto">
            <h1 className="absolute md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 translate-y-1/3 left-1/3 text-white md:bg-black md:p-6 rounded-xl md:text-primary text-center text-6xl md:text-8xl font-Great_Vibes z-50">Festive Edit</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 justify-center items-center gap-8 py-5">
                {/* Image 1: Tall */}
                {content.items[0] && <img src={content.items[0].src} alt={content.items[0].alt} className="rounded-2xl md:h-[30vw] h-[45vw] w-full object-cover hover:scale-105 transform transition-transform duration-300" />}
                
                {/* Image 2: Short */}
                {content.items[1] && <img src={content.items[1].src} alt={content.items[1].alt} className="rounded-2xl md:h-[30vw] h-[35vw] w-full object-cover hover:scale-105 transform transition-transform duration-300" />}
                
                {/* Image 3: Short */}
                {content.items[2] && <img src={content.items[2].src} alt={content.items[2].alt} className="rounded-2xl md:h-[30vw] h-[35vw] w-full object-cover hover:scale-105 transform transition-transform duration-300" />}
                
                {/* Image 4: Tall */}
                {content.items[3] && <img src={content.items[3].src} alt={content.items[3].alt} className="rounded-2xl md:h-[30vw] h-[45vw] w-full object-cover hover:scale-105 transform transition-transform duration-300" />}
            </div>
         </div>
         <div className="relative w-[90vw] md:w-[80vw] m-auto mt-10 group">
           <h1 className="absolute top-1/2 md:left-1/2 md:-translate-x-1/2 -translate-y-1/2 text-white text-center text-6xl md:text-8xl font-Great_Vibes z-10 group-hover:text-orange-300 transition-colors duration-700">Tradional Coming Soon</h1> 
           <img src={content.banner.src} alt={content.banner.alt} className="w-full h-[40vh] rounded-2xl object-cover hover:scale-105 transform transition-transform duration-300"/>
         </div>
        </>
    )
}



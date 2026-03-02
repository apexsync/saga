import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchProducts } from '../services/products';

export default function Search({ isOpen, onClose }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [searching, setSearching] = useState(false);
    const navigate = useNavigate();
    const inputRef = useRef(null);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    useEffect(() => {
        const fetchResults = async () => {
             if (query.trim() === '') {
                setResults([]);
                return;
            }

            setSearching(true);
            try {
                // Fetch products from Shopify service
                const products = await searchProducts(query);
                
                // Map products to search result format
                // Assuming simple pluralization for route: category + 's'
                const formattedResults = products.map(p => ({
                    name: p.name,
                    // Handle path logic: check if category ends in 's' or not.
                    // E.g. Ring -> /rings, Necklace -> /necklaces.
                    // This logic might need refinement based on exact route names.
                    path: `/${p.category.toLowerCase().endsWith('s') ? p.category.toLowerCase() : p.category.toLowerCase() + 's'}`
                }));

                setResults(formattedResults);
            } catch (err) {
                console.error("Search failed", err);
            } finally {
                setSearching(false);
            }
        };

        const timeoutId = setTimeout(fetchResults, 300); // Debounce
        return () => clearTimeout(timeoutId);

    }, [query]);

    const handleResultClick = (path) => {
        navigate(path);
        handleClose();
    };

    const handleClose = () => {
        setQuery('');
        setResults([]);
        onClose();
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100]">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
                onClick={handleClose} 
            />

            {/* Search Container */}
            <div className="relative bg-black border-b border-white/10 shadow-2xl animate-in slide-in-from-top duration-300">
                <div className="max-w-7xl mx-auto px-4 md:px-6 h-20 flex items-center gap-2 md:gap-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#FB7010" className="w-6 h-6 shrink-0">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                    </svg>
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Search..."
                        className="flex-1 bg-transparent text-white text-lg md:text-xl placeholder:text-neutral-500 focus:outline-none font-[Poppins] min-w-0"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <button 
                        onClick={handleClose}
                        className="p-2 text-neutral-400 hover:text-white transition-colors rounded-full hover:bg-white/10 shrink-0"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Results Section - Attached directly to bottom */}
                {query && (
                    <div className="border-t border-white/10 max-h-[70vh] overflow-y-auto bg-black/95">
                        <div className="max-w-7xl mx-auto py-2">
                        {results.length > 0 ? (
                            <div className="max-w-4xl mx-auto py-8 px-6 flex flex-col gap-2">
                                <div className="text-xs text-neutral-500 font-Poppins mb-4 uppercase tracking-widest pl-2">Top Results</div>
                                {results.map((item, index) => (
                                    <div 
                                        key={index}
                                        onClick={() => handleResultClick(item.path)}
                                        className="group flex items-center justify-between py-4 border-b border-white/5 cursor-pointer hover:border-primary/30 transition-all duration-500"
                                    >
                                        <div className="flex items-center gap-6">
                                            <span className="text-neutral-700 font-Great_Vibes text-xl group-hover:text-primary transition-colors">
                                                {String(index + 1).padStart(2, '0')}
                                            </span>
                                            <h3 className="text-2xl md:text-3xl text-neutral-400 font-[Poppins] font-light group-hover:text-white group-hover:pl-4 transition-all duration-500 ease-out">
                                                {item.name}
                                            </h3>
                                        </div>
                                        
                                        <div className="flex items-center gap-4 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
                                            <span className="text-xs text-primary font-inter hidden md:block">VIEW COLLECTION</span>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-primary">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                                            </svg>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-neutral-500">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mb-4 opacity-50">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607z" />
                                </svg>
                                <p className="font-[Poppins] text-lg">No items found for "{query}"</p>
                                <p className="text-sm mt-2">Try searching for "Rings", "Gold", or "Necklaces"</p>
                            </div>
                        )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

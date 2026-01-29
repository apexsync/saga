import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchCollections } from '../services/shopify';

export default function CategoryGrid(){
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadCollections = async () => {
            try {
                const data = await fetchCollections();
                setCategories(data);
            } catch (error) {
                console.error("Failed to load collections", error);
            } finally {
                setLoading(false);
            }
        };
        loadCollections();
    }, []);

    if (loading) return null; // Or a loading skeleton

    return(
        <>
        <div className="mb-16">
        <div className="text-white flex flex-col gap-6 text-center w-[80vw] m-auto mt-10">
        <h1 className="text-xl md:text-4xl tracking-wide">Find your <span className="text-primary py-2 text-3xl md:text-5xl font-Great_Vibes">PERFECT</span> one</h1>
        <span className="text-xl md:mt-5">Shop by Category</span>
        </div>
        <div className="grid grid-cols-2 gap-8 w-[90vw] md:w-[80vw] m-auto my-10">
            {categories.map((cat) => (
                <div key={cat.handle} className="cursor-pointer" onClick={() => navigate(`/${cat.handle}`)}>
                    <img src={cat.image.url} alt={cat.title} className=" h-[50vw]  md:h-[30vw] w-full object-cover rounded-2xl" />
                    <h1 className="font-Poppins text-white text-center md:text-2xl text-xs mt-5">{cat.title}</h1>
                </div>
            ))}
        </div>
        </div>
        </>
    )
}

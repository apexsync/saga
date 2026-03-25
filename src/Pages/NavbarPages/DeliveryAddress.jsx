import React, { useState, useEffect } from 'react';
import { useAuth } from '../../Context/AuthContext';
import { 
    fetchUserAddresses, 
    saveAddress, 
    updateAddress, 
    removeAddress 
} from '../../services/addressService';

const DeliveryAddress = () => {
    const { user } = useAuth();
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editAddressId, setEditAddressId] = useState(null);
    const [newAddress, setNewAddress] = useState({
        type: 'Home',
        name: '',
        street: '',
        city: '',
        state: '',
        zip: '',
        phone: ''
    });

    useEffect(() => {
        const loadAddresses = async () => {
            if (user) {
                try {
                    const data = await fetchUserAddresses(user.id);
                    setAddresses(data);
                } catch (error) {
                    console.error("Failed to load addresses", error);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };
        loadAddresses();
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewAddress(prev => ({ ...prev, [name]: value }));
    };

    const resetForm = () => {
        setNewAddress({
            type: 'Home',
            name: '',
            street: '',
            city: '',
            state: '',
            zip: '',
            phone: ''
        });
        setIsEditMode(false);
        setEditAddressId(null);
    };

    const handleOpenAddModal = () => {
        resetForm();
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (address) => {
        setNewAddress({
            type: address.type,
            name: address.name,
            street: address.street,
            city: address.city,
            state: address.state,
            zip: address.zip,
            phone: address.phone
        });
        setIsEditMode(true);
        setEditAddressId(address.id);
        setIsModalOpen(true);
    };

    const handleSaveAddress = async (e) => {
        e.preventDefault();
        try {
            if (isEditMode) {
                await updateAddress(editAddressId, newAddress);
                setAddresses(addresses.map(addr => 
                    addr.id === editAddressId ? { ...newAddress, id: editAddressId } : addr
                ));
            } else {
                const saved = await saveAddress(user.id, newAddress);
                setAddresses([...addresses, saved]);
            }
            setIsModalOpen(false);
            resetForm();
        } catch (error) {
            alert("Failed to save address. Please try again.");
            console.error(error);
        }
    };

    const handleDeleteAddress = async (id) => {
        if (window.confirm("Are you sure you want to delete this address?")) {
            try {
                await removeAddress(id);
                setAddresses(addresses.filter(addr => addr.id !== id));
            } catch (error) {
                alert("Failed to delete address.");
            }
        }
    };

    if (loading) {
        return <div className="pt-32 min-h-screen text-center text-white">Loading addresses...</div>;
    }

    if (!user) {
        return <div className="pt-32 min-h-screen text-center text-white">Please sign in to manage addresses.</div>;
    }

    return (
        <div className="pt-32 min-h-screen text-white px-4 md:px-10 pb-20">
            <div className="max-w-5xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center border-b border-white/50 pb-6 mb-12">
                    <h1 className="text-4xl font-Great_Vibes mb-4 md:mb-0">My Addresses</h1>
                    <button 
                        onClick={handleOpenAddModal}
                        className="bg-white text-black border border-white px-6 py-2.5 text-sm uppercase tracking-widest font-medium hover:bg-black hover:text-white transition-colors duration-300"
                    >
                        + Add New Address
                    </button>
                </div>

                {addresses.length === 0 ? (
                    <div className="text-center py-20 bg-zinc-900/20 border border-zinc-800 rounded-sm">
                        <p className="text-zinc-400 mb-6 text-lg">You don't have any saved delivery addresses.</p>
                        <button 
                            onClick={handleOpenAddModal}
                            className="text-white border-b border-white pb-1 hover:text-zinc-300 transition-colors uppercase tracking-widest text-sm"
                        >
                            Create One Now
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {addresses.map((addr) => (
                            <div key={addr.id} className="bg-black p-8 rounded-sm border border-zinc-800 hover:border-zinc-600 transition-colors flex flex-col h-full">
                                <div className="mb-6 flex-grow">
                                    <div className="mb-4 inline-block px-3 py-1 bg-zinc-800 text-xs font-medium tracking-widest uppercase text-zinc-300">
                                        {addr.type}
                                    </div>
                                    <h3 className="font-semibold text-xl mb-2 text-white">{addr.name}</h3>
                                    <div className="text-zinc-400 space-y-1 text-sm leading-relaxed">
                                        <p>{addr.street}</p>
                                        <p>{addr.city}{addr.state ? `, ${addr.state}` : ''} {addr.zip}</p>
                                        <p className="pt-2 text-white">Ph: {addr.phone}</p>
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-3 mt-auto pt-6 border-t border-zinc-800">
                                    <button 
                                        onClick={() => handleOpenEditModal(addr)}
                                        className="py-2 text-sm text-white border border-zinc-700 hover:border-white hover:bg-white hover:text-black transition-all duration-300 uppercase tracking-wider"
                                    >
                                        Edit
                                    </button>
                                    <button 
                                        onClick={() => handleDeleteAddress(addr.id)}
                                        className="py-2 text-sm text-zinc-400 border border-transparent hover:border-red-900 hover:text-red-400 hover:bg-red-950/20 transition-all duration-300 uppercase tracking-wider"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm">
                        <div className="bg-black border border-zinc-800 rounded-sm w-full max-w-lg max-h-[90vh] overflow-y-auto">
                            <div className="sticky top-0 bg-black/95 backdrop-blur-xl border-b border-zinc-800 p-6 flex justify-between items-center z-10">
                                <h2 className="text-3xl font-Great_Vibes">{isEditMode ? 'Edit Address' : 'New Address'}</h2>
                                <button 
                                    onClick={() => setIsModalOpen(false)} 
                                    className="text-zinc-500 hover:text-white transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            
                            <div className="p-6">
                                <form onSubmit={handleSaveAddress} className="space-y-5">
                                    <div>
                                        <label className="block text-xs uppercase tracking-widest text-zinc-400 mb-2">Address Type</label>
                                        <div className="relative">
                                            <select 
                                                name="type" 
                                                value={newAddress.type} 
                                                onChange={handleInputChange}
                                                className="w-full p-3 bg-zinc-900 border border-zinc-800 text-white focus:border-white outline-none appearance-none transition-colors"
                                            >
                                                <option value="Home">Home</option>
                                                <option value="Work">Work</option>
                                                <option value="Other">Other</option>
                                            </select>
                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-zinc-400">
                                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-xs uppercase tracking-widest text-zinc-400 mb-2">Full Name</label>
                                        <input 
                                            type="text" 
                                            name="name" 
                                            value={newAddress.name} 
                                            onChange={handleInputChange} 
                                            required 
                                            className="w-full p-3 bg-black border border-zinc-800 text-white focus:border-white outline-none transition-colors"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs uppercase tracking-widest text-zinc-400 mb-2">Street Address</label>
                                        <input 
                                            type="text" 
                                            name="street" 
                                            value={newAddress.street} 
                                            onChange={handleInputChange} 
                                            required 
                                            className="w-full p-3 bg-black border border-zinc-800 text-white focus:border-white outline-none transition-colors"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-xs uppercase tracking-widest text-zinc-400 mb-2">City</label>
                                            <input 
                                                type="text" 
                                                name="city" 
                                                value={newAddress.city} 
                                                onChange={handleInputChange} 
                                                required 
                                                className="w-full p-3 bg-black border border-zinc-800 text-white focus:border-white outline-none transition-colors"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs uppercase tracking-widest text-zinc-400 mb-2">State</label>
                                            <input 
                                                type="text" 
                                                name="state" 
                                                value={newAddress.state} 
                                                onChange={handleInputChange} 
                                                required 
                                                className="w-full p-3 bg-black border border-zinc-800 text-white focus:border-white outline-none transition-colors"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-xs uppercase tracking-widest text-zinc-400 mb-2">ZIP Code</label>
                                            <input 
                                                type="text" 
                                                name="zip" 
                                                value={newAddress.zip} 
                                                onChange={handleInputChange} 
                                                required 
                                                className="w-full p-3 bg-black border border-zinc-800 text-white focus:border-white outline-none transition-colors"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs uppercase tracking-widest text-zinc-400 mb-2">Phone</label>
                                            <input 
                                                type="text" 
                                                name="phone" 
                                                value={newAddress.phone} 
                                                onChange={handleInputChange} 
                                                required 
                                                className="w-full p-3 bg-black border border-zinc-800 text-white focus:border-white outline-none transition-colors"
                                            />
                                        </div>
                                    </div>

                                    <button 
                                        type="submit" 
                                        className="w-full bg-white text-black font-semibold py-4 uppercase tracking-widest text-sm hover:bg-zinc-200 transition-colors duration-300 mt-6"
                                    >
                                        {isEditMode ? 'Update Address' : 'Save Address'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DeliveryAddress;

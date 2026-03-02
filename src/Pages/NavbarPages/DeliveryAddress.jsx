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
        <div className="pt-24 min-h-screen text-white container mx-auto px-4 md:px-10 mb-10 relative">
             <div className="flex justify-between items-end border-b border-white/20 pb-2 mb-8">
                <h1 className="text-3xl font-bold text-primary border-b-2 border-primary -mb-2.5 pb-2 inline-block">Delivery Addresses</h1>
                <button 
                    onClick={handleOpenAddModal}
                    className="bg-primary text-white border border-primary px-4 py-2 rounded text-sm font-semibold hover:bg-black hover:text-primary transition-colors"
                >
                    + Add New Address
                </button>
            </div>

            {addresses.length === 0 ? (
                <div className="text-center text-white/60 py-10">No saved addresses found.</div>
            ) : (
                <div className="grid md:grid-cols-2 gap-6">
                    {addresses.map((addr) => (
                        <div key={addr.id} className="bg-black p-6 rounded-lg border border-white relative group">
                            <div className="flex justify-between items-start mb-4">
                                <span className="bg-white/10 border border-white/20 text-white text-xs px-2 py-1 rounded uppercase font-bold tracking-wide">{addr.type}</span>
                            </div>
                            <h3 className="font-bold text-lg mb-1 text-primary">{addr.name}</h3>
                            <p className="text-white/80 mb-1">{addr.street}</p>
                            <p className="text-white/80 mb-1">{addr.city}, {addr.state} - {addr.zip}</p>
                            <p className="text-white font-medium mt-2">Ph: {addr.phone}</p>
                            
                            <div className="flex gap-3 mt-6 border-t border-white/20 pt-4">
                                <button 
                                    onClick={() => handleOpenEditModal(addr)}
                                    className="flex-1 bg-white text-black py-1.5 rounded font-bold text-sm hover:bg-gray-200 transition-colors"
                                >
                                    Edit
                                </button>
                                <button 
                                    onClick={() => handleDeleteAddress(addr.id)}
                                    className="flex-1 border border-primary text-primary py-1.5 rounded font-bold text-sm hover:bg-primary hover:text-white transition-colors"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal remains the same */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-black border border-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-primary">{isEditMode ? 'Edit Address' : 'Add New Address'}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-white hover:text-primary">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        
                        <form onSubmit={handleSaveAddress} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-white/80 mb-1">Address Type</label>
                                <select 
                                    name="type" 
                                    value={newAddress.type} 
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded focus:border-primary outline-none text-white appearance-none"
                                >
                                    <option value="Home" className="bg-black">Home</option>
                                    <option value="Work" className="bg-black">Work</option>
                                    <option value="Other" className="bg-black">Other</option>
                                </select>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-white/80 mb-1">Full Name</label>
                                <input 
                                    type="text" 
                                    name="name" 
                                    value={newAddress.name} 
                                    onChange={handleInputChange} 
                                    required 
                                    className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded focus:border-primary outline-none text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-white/80 mb-1">Street Address</label>
                                <input 
                                    type="text" 
                                    name="street" 
                                    value={newAddress.street} 
                                    onChange={handleInputChange} 
                                    required 
                                    className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded focus:border-primary outline-none text-white"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-white/80 mb-1">City</label>
                                    <input 
                                        type="text" 
                                        name="city" 
                                        value={newAddress.city} 
                                        onChange={handleInputChange} 
                                        required 
                                        className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded focus:border-primary outline-none text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-white/80 mb-1">State</label>
                                    <input 
                                        type="text" 
                                        name="state" 
                                        value={newAddress.state} 
                                        onChange={handleInputChange} 
                                        required 
                                        className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded focus:border-primary outline-none text-white"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-white/80 mb-1">ZIP Code</label>
                                    <input 
                                        type="text" 
                                        name="zip" 
                                        value={newAddress.zip} 
                                        onChange={handleInputChange} 
                                        required 
                                        className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded focus:border-primary outline-none text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-white/80 mb-1">Phone Number</label>
                                    <input 
                                        type="tel" 
                                        name="phone" 
                                        value={newAddress.phone} 
                                        onChange={handleInputChange} 
                                        required 
                                        className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded focus:border-primary outline-none text-white"
                                    />
                                </div>
                            </div>

                            <button type="submit" className="w-full bg-primary text-white font-bold py-3 rounded mt-4 hover:bg-white hover:text-black transition-colors">
                                {isEditMode ? 'Update Address' : 'Save Address'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DeliveryAddress;

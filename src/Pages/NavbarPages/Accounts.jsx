import React, { useState, useEffect } from 'react';
import { fetchCustomerProfile, updateCustomerProfile } from '../../services/shopify';
import { FaUserCircle } from 'react-icons/fa';
import { useAuth } from '../../Context/AuthContext';

const Accounts = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: ''
    });
    const [message, setMessage] = useState('');
    const { updateUser } = useAuth();

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await fetchCustomerProfile();
                setUser(data);
                setFormData({
                    firstName: data.firstName || '',
                    lastName: data.lastName || '',
                    email: data.email || '',
                    phone: data.phone || ''
                });
            } catch (error) {
                console.error("Failed to fetch user profile", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage('');
        try {
            const updatedUser = await updateCustomerProfile(formData);
            setUser(updatedUser);
            // Update global auth context so navbar reflects changes immediately
            if (updateUser) {
                updateUser({ 
                    name: updatedUser.firstName + (updatedUser.lastName ? ' ' + updatedUser.lastName : ''),
                    firstName: updatedUser.firstName,
                    lastName: updatedUser.lastName,
                    email: updatedUser.email,
                    phone: updatedUser.phone
                });
            }
            setMessage('Changes saved successfully!');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error("Failed to update profile", error);
            setMessage('Failed to save changes.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="pt-32 text-center text-white">Loading account details...</div>;
    }

    return (
        <div className="pt-24 min-h-screen text-white container mx-auto px-4 md:px-10 mb-10">
            <h1 className="text-3xl font-bold mb-8 text-primary border-b-2 border-primary pb-2 inline-block">Account Details</h1>
            
            <div className="bg-black p-6 rounded-lg border border-white max-w-2xl mx-auto">
                <div className="flex flex-col items-center mb-8">
                    <FaUserCircle className="w-32 h-32 text-primary mb-4" />
                </div>

                <form className="space-y-6" onSubmit={handleSave}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-white/80 mb-2">First Name</label>
                            <input 
                                type="text" 
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-black border border-white rounded-md text-white focus:border-primary outline-none transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-white/80 mb-2">Last Name</label>
                            <input 
                                type="text" 
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-black border border-white rounded-md text-white focus:border-primary outline-none transition-colors"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white/80 mb-2">Email Address</label>
                        <input 
                            type="email" 
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-2 bg-black border border-white rounded-md text-white focus:border-primary outline-none transition-colors"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white/80 mb-2">Phone Number</label>
                        <input 
                            type="tel" 
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full px-4 py-2 bg-black border border-white rounded-md text-white focus:border-primary outline-none transition-colors"
                        />
                    </div>

                    {message && (
                        <div className={`text-center ${message.includes('success') ? 'text-green-500' : 'text-red-500'}`}>
                            {message}
                        </div>
                    )}

                    <div className="pt-4 flex gap-4">
                        <button 
                            type="submit" 
                            disabled={saving}
                            className={`w-full bg-primary text-white py-3 rounded-md font-semibold hover:bg-white hover:text-black border border-primary transition-colors ${saving ? 'opacity-70 cursor-wait' : ''}`}
                        >
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Accounts;

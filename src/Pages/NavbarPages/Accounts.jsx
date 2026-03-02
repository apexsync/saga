import React, { useState, useEffect } from 'react';
// Profile is managed via Firebase Auth (through AuthContext)
import { FaUserCircle } from 'react-icons/fa';
import { useAuth } from '../../Context/AuthContext';

const Accounts = () => {
    const { user, updateUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: ''
    });
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (user) {
            const nameParts = (user.name || '').split(' ');
            setFormData({
                firstName: nameParts[0] || '',
                lastName: nameParts.slice(1).join(' ') || '',
                email: user.email || '',
                phone: user.phone || ''
            });
        }
    }, [user]);

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
            // Update the auth context with new data
            const updatedData = {
                name: formData.firstName + (formData.lastName ? ' ' + formData.lastName : ''),
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phone: formData.phone
            };
            updateUser(updatedData);
            setMessage('Changes saved successfully!');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error("Failed to update profile", error);
            setMessage('Failed to save changes.');
        } finally {
            setSaving(false);
        }
    };

    if (!user) {
        return <div className="pt-32 text-center text-white">Please sign in to view account details.</div>;
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
                            disabled
                            className="w-full px-4 py-2 bg-black border border-white/40 rounded-md text-white/60 cursor-not-allowed"
                        />
                        <p className="text-xs text-white/40 mt-1">Email cannot be changed</p>
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

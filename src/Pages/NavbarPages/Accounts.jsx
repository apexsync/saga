import React, { useState, useEffect } from 'react';
import { fetchCustomerProfile } from '../../services/shopify';

const Accounts = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await fetchCustomerProfile();
                setUser(data);
            } catch (error) {
                console.error("Failed to fetch user profile", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    if (loading) {
        return <div className="pt-32 text-center text-white">Loading account details...</div>;
    }

    return (
        <div className="pt-24 min-h-screen text-white container mx-auto px-4 md:px-10 mb-10">
            <h1 className="text-3xl font-bold mb-8 text-primary border-b-2 border-primary pb-2 inline-block">Account Details</h1>
            
            <div className="bg-black p-6 rounded-lg border border-white max-w-2xl mx-auto">
                <div className="flex flex-col items-center mb-8">
                    <img src={user?.imageUrl || "/stock1.jpg"} alt="Profile" className="w-32 h-32 rounded-full object-cover mb-4 border-4 border-primary" />
                    <button className="text-primary hover:text-white border border-primary px-4 py-1 rounded transition-colors font-semibold text-sm">Change Photo</button>
                </div>

                <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-white/80 mb-2">First Name</label>
                            <input 
                                type="text" 
                                defaultValue={user?.firstName}
                                className="w-full px-4 py-2 bg-black border border-white rounded-md text-white focus:border-primary outline-none transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-white/80 mb-2">Last Name</label>
                            <input 
                                type="text" 
                                defaultValue={user?.lastName}
                                className="w-full px-4 py-2 bg-black border border-white rounded-md text-white focus:border-primary outline-none transition-colors"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white/80 mb-2">Email Address</label>
                        <input 
                            type="email" 
                            defaultValue={user?.email}
                            className="w-full px-4 py-2 bg-black border border-white/50 rounded-md text-gray-400 cursor-not-allowed outline-none"
                            readOnly
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white/80 mb-2">Phone Number</label>
                        <input 
                            type="tel" 
                            defaultValue={user?.phone}
                            className="w-full px-4 py-2 bg-black border border-white rounded-md text-white focus:border-primary outline-none transition-colors"
                        />
                    </div>

                    <div className="pt-4 flex gap-4">
                        <button type="button" className="w-full bg-primary text-white py-3 rounded-md font-semibold hover:bg-white hover:text-black border border-primary transition-colors">
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Accounts;

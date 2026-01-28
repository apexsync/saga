import React, { useState, useEffect } from 'react';
import { fetchCustomerOrders } from '../../services/shopify';

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadOrders = async () => {
            try {
                const data = await fetchCustomerOrders();
                setOrders(data);
            } catch (error) {
                console.error("Failed to fetch orders", error);
            } finally {
                setLoading(false);
            }
        };
        loadOrders();
    }, []);

    if (loading) {
        return <div className="pt-32 text-center text-white">Loading your orders...</div>;
    }

    return (
        <div className="pt-24 min-h-screen text-white container mx-auto px-4 md:px-10 mb-10">
            <h1 className="text-3xl font-bold mb-8 text-primary border-b-2 border-primary pb-2 inline-block">My Orders</h1>

            {orders.length === 0 ? (
                <div className="text-center text-white/60 py-10">You have no orders yet.</div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <div key={order.id} className="bg-black border border-white rounded-lg overflow-hidden hover:border-primary transition-colors">
                            <div className="bg-white/5 px-6 py-4 border-b border-white/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div className="flex flex-wrap gap-8 text-sm">
                                    <div>
                                        <p className="text-white/60 font-medium">Order Placed</p>
                                        <p className="font-semibold text-white">{order.date}</p>
                                    </div>
                                    <div>
                                        <p className="text-white/60 font-medium">Total</p>
                                        <p className="font-semibold text-white">{order.total}</p>
                                    </div>
                                    <div>
                                        <p className="text-white/60 font-medium">Order ID</p>
                                        <p className="font-semibold text-white">#{order.id}</p>
                                    </div>
                                </div>
                                <div className="flex gap-4 items-center">
                                    <button className="text-primary hover:text-white transition-colors font-semibold text-sm border-b border-transparent hover:border-white">View Invoice</button>
                                    <div className={`px-3 py-1 rounded-full text-xs font-bold ring-1 ${
                                        order.status === 'Delivered' ? 'bg-green-900/40 text-green-400 ring-green-600' : 'bg-primary/20 text-primary ring-primary'
                                    }`}>
                                        {order.status}
                                    </div>
                                </div>
                            </div>

                            <div className="p-6">
                                {order.items.map((item, idx) => (
                                    <div key={idx} className="flex flex-col sm:flex-row gap-6 mb-6 last:mb-0 items-center border-b border-white/10 last:border-0 pb-6 last:pb-0">
                                        <div className="w-20 h-20 bg-white/10 rounded-md overflow-hidden flex-shrink-0 border border-white/20">
                                            {item.image ? (
                                                 <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-xs text-white/40">No Image</div>
                                            )}
                                        </div>
                                        <div className="flex-grow text-center sm:text-left">
                                            <h3 className="font-bold text-lg text-white group-hover:text-primary transition-colors">{item.name}</h3>
                                            <p className="text-white/50 text-sm mt-1">Return window closed on {order.date}</p>
                                        </div>
                                        <div className="flex gap-2 w-full sm:w-auto">
                                            <button className="flex-1 sm:flex-none px-4 py-2 border border-white text-white rounded text-sm font-semibold hover:bg-white hover:text-black transition-colors">
                                                Track
                                            </button>
                                            <button className="flex-1 sm:flex-none px-4 py-2 bg-primary text-white border border-primary rounded text-sm font-semibold hover:bg-black hover:text-primary transition-colors">
                                                Buy Again
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyOrders;

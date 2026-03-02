import React, { useState } from 'react';
import { useCart } from '../Context/CartContext';
import { useAuth } from '../Context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { initiatePayment } from '../services/paymentService';
import { saveOrder } from '../services/orderService';

export default function Cart() {
    const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);
    const [address, setAddress] = useState({
        street: '',
        city: '',
        zip: '',
        phone: ''
    });
    const total = getCartTotal();

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setAddress(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckout = async () => {
        if (!user) {
            navigate('/signin');
            return;
        }

        // Basic validation
        if (!address.street || !address.city || !address.zip || !address.phone) {
            setError('Please fill in your delivery details.');
            return;
        }

        setIsProcessing(true);
        setError(null);

        try {
            const result = await initiatePayment({
                amount: total,
                customerName: user.name || 'Saga Customer',
                customerEmail: user.email,
                customerPhone: address.phone
            });

            if (result.success) {
                // SAVE THE ORDER TO FIRESTORE
                const savedOrder = await saveOrder({
                    userId: user.id,
                    items: cartItems,
                    total: `₹${total.toLocaleString('en-IN')}`,
                    rawTotal: total,
                    address: address,
                    paymentId: result.paymentId,
                    razorpayOrderId: result.orderId,
                });

                clearCart();
                navigate('/order-success', { 
                    state: { 
                        orderId: savedOrder.id, 
                        paymentId: result.paymentId 
                    } 
                });
            }
        } catch (err) {
            console.error("Checkout failed:", err);
            setError(err.message || 'Payment initiation failed. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center pt-20">
                <h2 className="text-4xl font-Great_Vibes mb-4">Your Cart is Empty</h2>
                <p className="text-zinc-400 mb-8">Looks like you haven't added anything yet.</p>
                <Link to="/" className="border border-white px-8 py-3 hover:bg-white hover:text-black transition-all duration-300">
                    CONTINUE SHOPPING
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white pt-28 pb-10 px-4">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-5xl font-Great_Vibes text-center mb-12">Shopping Cart</h1>
                
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Cart Items List */}
                    <div className="lg:w-2/3">
                        <div className="hidden md:grid grid-cols-4 gap-4 border-b border-zinc-800 pb-4 mb-4 text-zinc-400 text-sm uppercase tracking-wider">
                            <div className="col-span-2">Product</div>
                            <div className="text-center">Quantity</div>
                            <div className="text-right">Total</div>
                        </div>

                        <div className="flex flex-col gap-6 mb-12">
                            {cartItems.map((item) => (
                                <div key={`${item.id}-${item.name}`} className="flex flex-col md:grid md:grid-cols-4 gap-4 items-center border-b border-zinc-900 pb-6">
                                    <div className="col-span-2 flex items-center md:flex-row flex-col text-center md:text-left gap-4 w-full">
                                        <div className="w-24 h-24 overflow-hidden bg-zinc-900 flex-shrink-0">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-lg">{item.name}</h3>
                                            <p className="text-zinc-400 text-sm mt-1">{item.price}</p>
                                            <button 
                                                onClick={() => removeFromCart(item.id, item.name)}
                                                className="text-xs text-red-400/50 mt-2 hover:text-red-500 border-b border-red-400 pb-0.5"
                                            >
                                                REMOVE
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center justify-center gap-3">
                                        <button 
                                            onClick={() => updateQuantity(item.id, item.name, item.quantity - 1)}
                                            className="w-8 h-8 rounded-full border border-zinc-700 flex items-center justify-center hover:bg-zinc-800"
                                        >
                                            -
                                        </button>
                                        <span className="w-8 text-center">{item.quantity}</span>
                                        <button 
                                            onClick={() => updateQuantity(item.id, item.name, item.quantity + 1)}
                                            className="w-8 h-8 rounded-full border border-zinc-700 flex items-center justify-center hover:bg-zinc-800"
                                        >
                                            +
                                        </button>
                                    </div>

                                    <div className="text-right font-medium text-lg w-full md:w-auto text-center md:text-right">
                                        ₹{(parseFloat(item.price.replace(/[^0-9.]/g, '')) * item.quantity).toLocaleString('en-IN')}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Delivery Details */}
                        <div className="bg-zinc-900/20 p-8 rounded-sm border border-zinc-800">
                            <h2 className="text-2xl font-Great_Vibes mb-6">Delivery Details</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs text-zinc-400 uppercase tracking-widest">Street Address</label>
                                    <input 
                                        type="text" 
                                        name="street"
                                        value={address.street}
                                        onChange={handleAddressChange}
                                        placeholder="e.g. 123 Luxury Lane" 
                                        className="w-full bg-black border border-zinc-800 p-3 text-sm focus:border-white outline-none transition-colors"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs text-zinc-400 uppercase tracking-widest">City</label>
                                    <input 
                                        type="text" 
                                        name="city"
                                        value={address.city}
                                        onChange={handleAddressChange}
                                        placeholder="e.g. Mumbai" 
                                        className="w-full bg-black border border-zinc-800 p-3 text-sm focus:border-white outline-none transition-colors"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs text-zinc-400 uppercase tracking-widest">ZIP Code</label>
                                    <input 
                                        type="text" 
                                        name="zip"
                                        value={address.zip}
                                        onChange={handleAddressChange}
                                        placeholder="e.g. 400001" 
                                        className="w-full bg-black border border-zinc-800 p-3 text-sm focus:border-white outline-none transition-colors"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs text-zinc-400 uppercase tracking-widest">Phone Number</label>
                                    <input 
                                        type="tel" 
                                        name="phone"
                                        value={address.phone}
                                        onChange={handleAddressChange}
                                        placeholder="e.g. 9876543210" 
                                        className="w-full bg-black border border-zinc-800 p-3 text-sm focus:border-white outline-none transition-colors"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:w-1/3">
                        <div className="bg-zinc-900/30 p-8 rounded-sm sticky top-28 border border-zinc-800">
                            <h2 className="text-2xl font-Great_Vibes mb-6">Order Summary</h2>
                            
                            <div className="space-y-4 mb-6 text-sm">
                                <div className="flex justify-between text-zinc-400">
                                    <span>Subtotal</span>
                                    <span className="text-white">₹{total.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between text-zinc-400">
                                    <span>Shipping</span>
                                    <span className="text-green-400">Free</span>
                                </div>
                            </div>
                            
                            <div className="border-t border-zinc-800 pt-4 mb-8">
                                <div className="flex justify-between items-center text-lg">
                                    <span>Total</span>
                                    <span className="font-bold">₹{total.toLocaleString('en-IN')}</span>
                                </div>
                                <p className="text-xs text-zinc-500 mt-2">Including all taxes</p>
                            </div>

                            {error && (
                                <div className="bg-red-900/40 border border-red-500/50 text-red-200 text-xs p-3 rounded mb-4">
                                    {error}
                                </div>
                            )}

                            <button 
                                onClick={handleCheckout}
                                disabled={isProcessing}
                                className={`w-full bg-white text-black py-4 border border-white font-medium hover:bg-black hover:text-white transition-colors uppercase tracking-widest text-sm ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {isProcessing ? 'Processing Payment...' : 'Proceed to Checkout'}
                            </button>
                            
                            <button 
                                onClick={clearCart}
                                disabled={isProcessing}
                                className="w-full mt-4 text-zinc-500 hover:text-white text-xs transition-colors"
                            >
                                Clear Cart
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

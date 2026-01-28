import React from 'react';
import { useCart } from '../Context/CartContext';
import { Link } from 'react-router-dom';

export default function Cart() {
    const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
    const total = getCartTotal();

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

                        <div className="flex flex-col gap-6">
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
                    </div>

                    {/* Order Summary */}
                    <div className="lg:w-1/3">
                        <div className="bg-zinc-900/30 p-8 rounded-sm sticky top-28">
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

                            <button className="w-full bg-white text-black py-4 border border-white font-medium hover:bg-black hover:text-white transition-colors uppercase tracking-widest text-sm">
                                Proceed to Checkout
                            </button>
                            
                            <button 
                                onClick={clearCart}
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

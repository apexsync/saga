import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function OrderSuccess() {
    const location = useLocation();
    const navigate = useNavigate();
    const { orderId, paymentId } = location.state || {};

    useEffect(() => {
        if (!paymentId) {
            navigate('/');
        }
    }, [paymentId, navigate]);

    return (
        <div className="min-h-screen bg-black text-white pt-32 pb-20 px-4 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-8 animate-bounce">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-10 h-10 text-black">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
            </div>
            
            <h1 className="text-5xl font-Great_Vibes mb-4">Thank You for Your Order!</h1>
            <p className="text-zinc-400 text-lg mb-8 max-w-md mx-auto">
                Your luxury jewelry is being prepared for delivery. We've sent a confirmation to your email.
            </p>

            <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-sm mb-12 max-w-lg w-full">
                <div className="flex justify-between items-center mb-4 border-b border-zinc-800 pb-4">
                    <span className="text-zinc-500 uppercase tracking-widest text-xs">Payment ID</span>
                    <span className="font-mono text-zinc-200">{paymentId}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-zinc-500 uppercase tracking-widest text-xs">Order ID</span>
                    <span className="font-mono text-zinc-200">#{orderId?.slice(0, 8)}</span>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/my-orders" className="bg-white text-black px-8 py-3 font-medium hover:bg-zinc-200 transition-colors uppercase tracking-widest text-sm">
                    View My Orders
                </Link>
                <Link to="/" className="border border-white text-white px-8 py-3 font-medium hover:bg-white hover:text-black transition-colors uppercase tracking-widest text-sm">
                    Back to Store
                </Link>
            </div>
        </div>
    );
}

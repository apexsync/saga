import React, { useState } from 'react';
// Payment methods — placeholder, can be implemented later

const Payment = () => {
    const [paymentMethods] = useState([]);

    return (
        <div className="pt-24 min-h-screen text-white container mx-auto px-4 md:px-10 mb-10">
            <h1 className="text-3xl font-bold mb-8 text-primary border-b-2 border-primary pb-2 inline-block">Payment Methods</h1>

            <div className="grid gap-6 max-w-2xl mx-auto">
                {/* Saved Cards */}
                <div className="bg-black p-6 rounded-lg border border-white">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-primary">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
                        </svg>
                        Saved Cards
                    </h2>
                    
                    {paymentMethods.length === 0 ? (
                        <p className="text-white/60 text-sm mb-4">No saved cards.</p>
                    ) : (
                        <div className="space-y-4">
                            {paymentMethods.map(method => (
                                <div key={method.id} className="flex flex-col md:flex-row items-center justify-between p-4 border border-white/20 rounded-lg hover:border-primary transition-colors gap-4">
                                    <div className="flex items-center gap-4 w-full md:w-auto">
                                        <div className="w-12 h-8 bg-white/10 rounded flex items-center justify-center font-bold text-xs text-white">
                                            {method.brand}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-white">**** **** **** {method.last4}</p>
                                            <p className="text-sm text-white/60">Expires {method.expiryMonth}/{method.expiryYear}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 w-full md:w-auto">
                                        <button className="flex-1 md:flex-none px-4 py-1 border border-white/40 rounded text-sm hover:bg-white hover:text-black transition-colors">Edit</button>
                                        <button className="flex-1 md:flex-none px-4 py-1 border border-primary text-primary rounded text-sm hover:bg-primary hover:text-white transition-colors">Delete</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <button className="mt-6 w-full py-2 border-2 border-dashed border-white/30 text-white/70 font-semibold rounded-lg hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Add New Card
                    </button>
                </div>

                {/* UPI / Other Methods */}
                <div className="bg-black p-6 rounded-lg border border-white">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-white">
                       UPI & Wallets
                    </h2>
                    <div className="flex flex-col md:flex-row items-center justify-between p-4 border border-white/20 rounded-lg mb-4 gap-4">
                        <div className="flex items-center gap-4 w-full md:w-auto">
                             <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-xs font-bold text-white">UPI</div>
                             <span className="font-medium text-white">user@upi</span>
                        </div>
                        <div className="flex gap-2 w-full md:w-auto">
                             <button className="flex-1 md:flex-none px-4 py-1 border border-white/40 rounded text-sm hover:bg-white hover:text-black transition-colors">Edit</button>
                             <button className="flex-1 md:flex-none px-4 py-1 border border-primary text-primary rounded text-sm hover:bg-primary hover:text-white transition-colors">Delete</button>
                        </div>
                    </div>
                    <button className="text-primary font-semibold text-sm hover:text-white transition-colors">+ Add New UPI ID</button>
                </div>
            </div>
        </div>
    );
};

export default Payment;

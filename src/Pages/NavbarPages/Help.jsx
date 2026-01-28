import React from 'react';

const Help = () => {
    return (
        <div className="pt-24 min-h-screen bg-black text-white container mx-auto px-4 md:px-10 mb-10">
            <h1 className="text-3xl font-bold mb-8 text-primary border-b-2 border-primary pb-2 inline-block">Help & Support</h1>

            <div className="grid md:grid-cols-2 gap-10">
                <div>
                    <h2 className="text-2xl font-bold mb-6 text-white">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                        <details className="group bg-black p-4 rounded-lg border border-white cursor-pointer open:border-primary">
                            <summary className="flex justify-between items-center font-medium text-white list-none hover:text-primary transition-colors">
                                How can I track my order?
                                <span className="transition group-open:rotate-180 group-open:text-primary">
                                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                                </span>
                            </summary>
                            <p className="text-white/70 mt-3 group-open:animate-fadeIn text-sm leading-relaxed">
                                You can track your order by visiting the "My Orders" section in your account. Click on the specific order to see real-time updates.
                            </p>
                        </details>
                        <details className="group bg-black p-4 rounded-lg border border-white cursor-pointer open:border-primary">
                            <summary className="flex justify-between items-center font-medium text-white list-none hover:text-primary transition-colors">
                                What is the return policy?
                                <span className="transition group-open:rotate-180 group-open:text-primary">
                                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                                </span>
                            </summary>
                            <p className="text-white/70 mt-3 group-open:animate-fadeIn text-sm leading-relaxed">
                                We accept returns within 7 days of delivery. The item must be unused and in its original packaging. Please contact support to initiate a return.
                            </p>
                        </details>
                        <details className="group bg-black p-4 rounded-lg border border-white cursor-pointer open:border-primary">
                            <summary className="flex justify-between items-center font-medium text-white list-none hover:text-primary transition-colors">
                                Do you ship internationally?
                                <span className="transition group-open:rotate-180 group-open:text-primary">
                                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                                </span>
                            </summary>
                            <p className="text-white/70 mt-3 group-open:animate-fadeIn text-sm leading-relaxed">
                                Currently, we only ship within India. We are working on expanding our delivery network to international locations soon.
                            </p>
                        </details>
                    </div>
                </div>

                <div>
                    <h2 className="text-2xl font-bold mb-6 text-white">Contact Us</h2>
                    <div className="bg-black p-8 rounded-lg border border-primary">
                        <p className="mb-6 text-white/80">Need more assistance? Reach out to our customer support team.</p>
                        
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-full bg-primary/20 text-primary border border-primary flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm text-white/60 font-semibold mb-1">Email Us</p>
                                <p className="text-lg font-bold text-white hover:text-primary cursor-pointer transition-colors">support@saga.com</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 rounded-full bg-primary/20 text-primary border border-primary flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm text-white/60 font-semibold mb-1">Call Us</p>
                                <p className="text-lg font-bold text-white hover:text-primary cursor-pointer transition-colors">+91 1800 123 4567</p>
                            </div>
                        </div>

                         <button className="w-full bg-primary text-white py-3 rounded font-semibold hover:bg-white hover:text-black transition-colors border border-primary">Chat with Support</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Help;

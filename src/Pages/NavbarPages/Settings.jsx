import React, { useState } from 'react';
// Settings — placeholder, can be implemented with Firestore later

const Settings = () => {
    const [notifications, setNotifications] = useState({
        marketing: true,
        orderUpdates: true,
        newsletter: false
    });



    return (
        <div className="pt-24 min-h-screen text-white container mx-auto px-4 md:px-10 mb-10">
            <h1 className="text-3xl font-bold mb-8 text-primary border-b-2 border-primary pb-2 inline-block">Settings</h1>
            
            <div className="max-w-3xl mx-auto space-y-8">
                
                {/* Notification Settings */}
                <div className="bg-black p-6 rounded-lg border border-white">
                     <h2 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-primary">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                        </svg>
                        Notification Preferences
                    </h2>
                    
                    <div className="space-y-4">
                        <div className="flex items-center justify-between py-3 border-b border-white/10 last:border-0">
                            <div>
                                <p className="font-semibold text-white">Order Updates</p>
                                <p className="text-sm text-white/50">Get notified about your order status.</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" checked={notifications.orderUpdates} onChange={() => setNotifications({...notifications, orderUpdates: !notifications.orderUpdates})} className="sr-only peer" />
                                <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between py-3 border-b border-white/10 last:border-0">
                            <div>
                                <p className="font-semibold text-white">Marketing Emails</p>
                                <p className="text-sm text-white/50">Receive offers and promotions.</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" checked={notifications.marketing} onChange={() => setNotifications({...notifications, marketing: !notifications.marketing})} className="sr-only peer" />
                                <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between py-3 border-b border-white/10 last:border-0">
                            <div>
                                <p className="font-semibold text-white">Newsletter</p>
                                <p className="text-sm text-white/50">Weekly updates on new collections.</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" checked={notifications.newsletter} onChange={() => setNotifications({...notifications, newsletter: !notifications.newsletter})} className="sr-only peer" />
                                <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Account Security */}
                 <div className="bg-black p-6 rounded-lg border border-white">
                    <h2 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
                         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-primary">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                        </svg>
                        Security & Login
                    </h2>
                     <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-white/10 pb-4 last:border-0 last:pb-0">
                            <p className="font-medium text-white/80">Change Password</p>
                            <button className="text-primary font-semibold hover:text-white transition-colors border border-primary px-4 py-1 rounded text-sm hover:bg-primary">Update</button>
                        </div>
                         <div className="flex items-center justify-between border-b border-white/10 pb-4 last:border-0 last:pb-0">
                            <p className="font-medium text-white/80">Two-Factor Authentication</p>
                            <button className="text-primary font-semibold hover:text-white transition-colors border border-primary px-4 py-1 rounded text-sm hover:bg-primary">Enable</button>
                        </div>
                     </div>
                 </div>

                 {/* Delete Account */}
                 <div className="bg-black p-6 rounded-lg border border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.1)] mt-8">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div>
                            <h2 className="text-xl font-bold text-red-500 flex items-center gap-2 mb-2">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                                </svg>
                                Delete Account
                            </h2>
                            <p className="text-white/60 text-sm max-w-md">
                                Permanently remove your account and all associated data. This action cannot be undone.
                            </p>
                        </div>
                        <button className="whitespace-nowrap bg-red-500/10 text-red-500 border border-red-500/50 px-6 py-2.5 rounded-lg font-semibold hover:bg-red-500 hover:text-white transition-all duration-300 flex items-center gap-2 group">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                            </svg>
                            Delete Account
                        </button>
                    </div>
                 </div>

            </div>
        </div>
    );
};

export default Settings;

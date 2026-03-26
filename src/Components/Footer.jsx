import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
    return (
        <footer className="w-full bg-black text-white py-16 font-Poppins">
            <div className="max-w-[1440px] mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 text-center lg:text-left">
                
                {/* Brand Section */}
                <div className="flex flex-col items-center lg:items-start space-y-4">
                    <img src="/SAGA LOGO.PNG" alt="Saga Logo" className="h-12 w-auto object-contain rounded-sm" />
                    <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                        Curating timeless elegance for the modern individual. Where simplicity meets sophistication.
                    </p>
                </div>

                {/* Navigation Section */}
                <div className="flex flex-col items-center lg:items-center space-y-4">
                    <h3 className="text-lg font-semibold tracking-wide mr-2 text-primary">Explore</h3>
                    <nav className="grid grid-cols-2 gap-2 text-gray-400">
                        <Link to="/" className="hover:text-white transition-colors duration-300">Home</Link>
                        <Link to="/products" className="hover:text-white transition-colors duration-300">Full Collection</Link>
                        <Link to="/necklaces" className="hover:text-white transition-colors duration-300">Necklaces</Link>
                        <Link to="/bangles" className="hover:text-white transition-colors duration-300">Bangles</Link>
                        <Link to="/earrings" className="hover:text-white transition-colors duration-300">Earrings</Link>
                        <Link to="/pendants" className="hover:text-white transition-colors duration-300">Pendants</Link>
                        <Link to="/rings" className="hover:text-white transition-colors duration-300">Rings</Link>
                        <Link to="/bracelets" className="hover:text-white transition-colors duration-300">Bracelets</Link>
                    </nav>
                </div>

                {/* Contact/Social Section */}
                <div className="flex flex-col items-center lg:items-end space-y-4 w-full">
                    <h3 className="text-lg font-semibold tracking-wide text-primary">Contact</h3>
                    <div className="flex flex-col space-y-2 text-gray-400 text-sm lg:text-right w-full break-words">
                        <a href="mailto:hello@saga.com" className="hover:text-white transition-colors cursor-default">sagakamya@gmail.com</a>
                        <a href="tel:+919847294800" className='hover:text-white cursor-default'>+91 98472 94800</a>
                        <div className="pt-2 flex gap-4 justify-center lg:justify-end">
                            {/* Social Icons */}
                            <a href="https://www.instagram.com/shopsaga_?igsh=MW5sbGt6ejJwbm9yZA==" className="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center hover:border-white hover:bg-white/90 hover:text-black transition-all cursor-pointer group">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 group-hover:text-primary transition-colors">
                                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                                </svg>
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center hover:border-white hover:bg-white/90 hover:text-black transition-all cursor-pointer group">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 group-hover:text-primary transition-colors">
                                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Copyright */}
            <div className="mt-12 pt-8 border-t border-gray-800 text-center text-xs text-gray-500">
                <p>&copy; {new Date().getFullYear()} Saga. All rights reserved.</p>
            </div>
        </footer>
    );
}

export default Footer;
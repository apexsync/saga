import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerCustomer } from '../services/authService';

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        return;
    }

    setLoading(true);
    setError(null);

    try {
        await registerCustomer(formData.email, formData.password, formData.name);
        // On success, redirect to sign in
        navigate('/signin');
    } catch (err) {
        setError(err.message || "Failed to create account");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="flex items-center text-white justify-center min-h-[calc(100vh-80px)] px-4 py-[8vw]">
      <div className="w-full max-w-md p-8 space-y-6 rounded-xl shadow-lg border border-gray-100 bg-black/60">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-primary font-[Poppins]">Create Account</h2>
          <p className="mt-2 text-sm text-gray-200 font-[Poppins]">Join us today!</p>
        </div>
        
        {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-100 px-4 py-2 rounded text-sm text-center">
                {error}
            </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-200 font-[Poppins]">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm font-[Poppins]"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-200 font-[Poppins]">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="w-full px-3 py-2 border text-white border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm font-[Poppins]"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-200 font-[Poppins]">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm font-[Poppins]"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-200 font-[Poppins]">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm font-[Poppins]"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                ${loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-primary hover:bg-orange-600'} 
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200 font-[Poppins]`}
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </div>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-400 font-[Poppins]">
            Already have an account?{' '}
            <Link to="/signin" className="font-medium text-primary hover:text-orange-600">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;

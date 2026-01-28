import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginCustomer } from '../services/shopify';
import { useAuth } from '../Context/AuthContext';

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
        const response = await loginCustomer(formData.email, formData.password);
        // Store token via Context
        login(response.accessToken, response.customerUser);
        
        // Navigate to home or account page
        navigate('/');
    } catch (err) {
        setError(err.message || "Failed to sign in");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="flex items-center text-white justify-center min-h-[calc(100vh-80px)] mt-8  px-4">
      <div className="w-full max-w-md p-8 space-y-6 rounded-xl shadow-lg border border-gray-100">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-primary font-[Poppins]">Welcome Back</h2>
          <p className="mt-2 text-sm text-gray-500 font-[Poppins]">Please sign in to your account</p>
        </div>

        {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-100 px-4 py-2 rounded text-sm text-center">
                {error}
            </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm font-[Poppins]"
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
              autoComplete="current-password"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm font-[Poppins]"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-500 font-[Poppins]">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-primary hover:text-orange-600 font-[Poppins]">
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                ${loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-primary hover:bg-orange-600'} 
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200 font-[Poppins]`}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </div>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600 font-[Poppins]">
            Don't have an account?{' '}
            <Link to="/signup" className="font-medium text-primary hover:text-orange-600">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;

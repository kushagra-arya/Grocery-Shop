import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { EnvelopeIcon, LockClosedIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { login, clearError } from '../store/slices/authSlice';
import { loadUserWishlist } from '../store/slices/wishlistSlice';
import toast from 'react-hot-toast';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { isLoading, error, isAuthenticated } = useSelector((state) => state.auth);

  const from = location.state?.from?.pathname || '/';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const onSubmit = async (data) => {
    try {
      dispatch(clearError());
      await dispatch(login(data)).unwrap();
      dispatch(loadUserWishlist());
      toast.success('Welcome back!');
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header Logo */}
      <div className="py-6 text-center border-b">
        <Link to="/" className="inline-flex items-center">
          <span className="text-3xl mr-2">🛒</span>
          <span className="text-2xl font-bold text-amazon-navy">
            Grocery<span className="text-amazon-orange">Shop</span>
          </span>
        </Link>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-[350px]">
          {/* Login Form Card */}
          <div className="border border-gray-300 rounded-lg p-6 bg-white shadow-sm">
            <h1 className="text-[28px] font-normal text-gray-900 mb-5">Sign in</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-bold text-gray-900 mb-1">
                  Email
                </label>
                <input
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: 'Please enter a valid email address',
                    },
                  })}
                  type="email"
                  id="email"
                  autoComplete="email"
                  autoFocus
                  placeholder="user@example.com"
                  className={`w-full px-3 py-2 text-sm border rounded focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 ${
                    errors.email ? 'border-red-500' : 'border-gray-400'
                  }`}
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="password" className="block text-sm font-bold text-gray-900">
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs text-amazon-blue hover:text-amazon-orange hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    {...register('password', {
                      required: 'Password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters',
                      },
                    })}
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    autoComplete="current-password"
                    className={`w-full px-3 py-2 pr-10 text-sm border rounded focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 ${
                      errors.password ? 'border-red-500' : 'border-gray-400'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-4 w-4" />
                    ) : (
                      <EyeIcon className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
                )}
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2 px-4 bg-gradient-to-b from-amazon-orange to-amazon-orange-dark text-amazon-navy font-medium text-sm rounded hover:brightness-105 focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  'Sign in'
                )}
              </button>

              {/* Keep signed in */}
              <label className="flex items-center text-xs">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-amazon-orange focus:ring-cyan-500 border-gray-400 rounded"
                />
                <span className="ml-2 text-gray-700">Keep me signed in</span>
              </label>
            </form>

            {/* Terms */}
            <p className="text-xs text-gray-600 mt-6">
              By continuing, you agree to GroceryShop's{' '}
              <Link to="/conditions" className="text-amazon-blue hover:text-amazon-orange hover:underline">
                Conditions of Use
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="text-amazon-blue hover:text-amazon-orange hover:underline">
                Privacy Notice
              </Link>
              .
            </p>
          </div>

          {/* Divider */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-white text-gray-500">New to GroceryShop?</span>
            </div>
          </div>

          {/* Create Account Button */}
          <Link
            to="/register"
            className="block w-full py-2 px-4 bg-white border border-gray-300 text-sm text-gray-800 font-medium rounded hover:bg-gray-100 text-center shadow-sm"
          >
            Create your GroceryShop account
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="py-4 border-t bg-gradient-to-b from-transparent to-gray-100">
        <div className="text-center">
          <div className="flex justify-center gap-6 text-xs text-amazon-blue mb-2">
            <Link to="/conditions" className="hover:text-amazon-orange hover:underline">Conditions of Use</Link>
            <Link to="/privacy" className="hover:text-amazon-orange hover:underline">Privacy Notice</Link>
            <Link to="/help" className="hover:text-amazon-orange hover:underline">Help</Link>
          </div>
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} GroceryShop. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}

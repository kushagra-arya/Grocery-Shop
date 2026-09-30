import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  ShoppingCartIcon,
  UserIcon,
  Bars3Icon,
  XMarkIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
  MapPinIcon,
  HeartIcon,
} from '@heroicons/react/24/outline';
import { logout } from '../../store/slices/authSlice';
import { resetCart } from '../../store/slices/cartSlice';
import { loadUserWishlist } from '../../store/slices/wishlistSlice';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(() => {
    return localStorage.getItem('deliveryLocation') || '';
  });
  const profileRef = useRef(null);
  const locationRef = useRef(null);
  
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { itemCount } = useSelector((state) => state.cart);

  // Available delivery locations
  const deliveryLocations = [
    'Mumbai, Maharashtra',
    'Delhi, NCR',
    'Bangalore, Karnataka',
    'Chennai, Tamil Nadu',
    'Hyderabad, Telangana',
    'Pune, Maharashtra',
    'Kolkata, West Bengal',
    'Ahmedabad, Gujarat',
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (locationRef.current && !locationRef.current.contains(event.target)) {
        setIsLocationOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(resetCart());
    dispatch(loadUserWishlist());
    navigate('/');
    setIsProfileOpen(false);
  };

  const handleLocationSelect = (loc) => {
    setSelectedLocation(loc);
    localStorage.setItem('deliveryLocation', loc);
    setIsLocationOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <header className="sticky top-0 z-50">
      {/* Main Navbar */}
      <nav className="bg-amazon-navy">
        <div className="max-w-[1500px] mx-auto">
          <div className="flex items-center h-[60px] px-4">
            {/* Logo */}
            <Link 
              to="/" 
              className="flex items-center mr-4 py-2 px-2 border border-transparent hover:border-white rounded transition-all"
            >
              <span className="text-2xl mr-1">🛒</span>
              <span className="text-white text-xl font-bold tracking-tight">
                Grocery<span className="text-amazon-orange">Shop</span>
              </span>
            </Link>

            {/* Delivery Location - Desktop */}
            <div className="relative hidden lg:block" ref={locationRef}>
              <button 
                onClick={() => setIsLocationOpen(!isLocationOpen)}
                className="flex items-center py-2 px-2 border border-transparent hover:border-white rounded cursor-pointer transition-all"
              >
                <MapPinIcon className="h-5 w-5 text-white" />
                <div className="ml-1">
                  <span className="text-gray-300 text-xs block leading-tight">Deliver to</span>
                  <span className="text-white text-sm font-bold leading-tight flex items-center">
                    {selectedLocation ? selectedLocation.split(',')[0] : 'Select location'}
                    <ChevronDownIcon className="h-3 w-3 ml-1" />
                  </span>
                </div>
              </button>
              
              {/* Location Dropdown */}
              {isLocationOpen && (
                <div className="absolute left-0 mt-1 w-64 bg-white rounded-lg shadow-xl border z-50 animate-fade-in">
                  <div className="p-3 border-b">
                    <p className="text-sm font-semibold text-gray-700">Choose your location</p>
                    <p className="text-xs text-gray-500">Delivery options vary by location</p>
                  </div>
                  <div className="py-2 max-h-64 overflow-y-auto">
                    {deliveryLocations.map((loc) => (
                      <button
                        key={loc}
                        onClick={() => handleLocationSelect(loc)}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between ${
                          selectedLocation === loc 
                            ? 'bg-amazon-orange/10 text-amazon-orange font-medium' 
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <span>{loc}</span>
                        {selectedLocation === loc && (
                          <span className="text-amazon-orange">✓</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex-1 mx-4 hidden md:flex">
              <div className={`flex w-full rounded-md overflow-hidden ${isSearchFocused ? 'ring-2 ring-amazon-orange' : ''}`}>
                <select className="bg-gray-100 border-0 px-3 text-sm text-gray-700 focus:outline-none hidden lg:block">
                  <option>All</option>
                  <option>Fruits</option>
                  <option>Vegetables</option>
                  <option>Dairy</option>
                  <option>Bakery</option>
                </select>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  placeholder="Search GroceryShop"
                  className="flex-1 px-4 py-2.5 text-sm focus:outline-none"
                />
                <button
                  type="submit"
                  className="bg-amazon-orange hover:bg-amazon-orange-dark px-4 transition-colors"
                >
                  <MagnifyingGlassIcon className="h-5 w-5 text-amazon-navy" />
                </button>
              </div>
            </form>

            {/* Right Side Items */}
            <div className="flex items-center gap-1">
              {/* Account & Lists */}
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => isAuthenticated ? setIsProfileOpen(!isProfileOpen) : navigate('/login')}
                  className="flex items-center py-2 px-2 border border-transparent hover:border-white rounded transition-all"
                >
                  <div className="text-left">
                    <span className="text-gray-300 text-xs block leading-tight">
                      Hello, {isAuthenticated ? user?.firstName : 'sign in'}
                    </span>
                    <span className="text-white text-sm font-bold leading-tight flex items-center">
                      Account & Lists
                      <ChevronDownIcon className="h-3 w-3 ml-1" />
                    </span>
                  </div>
                </button>

                {/* Profile Dropdown */}
                {isProfileOpen && isAuthenticated && (
                  <div className="absolute right-0 mt-1 w-56 bg-white rounded-lg shadow-xl border z-50 animate-fade-in">
                    <div className="p-4 border-b">
                      <p className="text-sm text-gray-600">Welcome,</p>
                      <p className="font-semibold text-gray-900">{user?.firstName} {user?.lastName}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    <div className="py-2">
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <UserIcon className="h-4 w-4 mr-3 text-gray-400" />
                        My Profile
                      </Link>
                      <Link
                        to="/orders"
                        className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <svg className="h-4 w-4 mr-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        My Orders
                      </Link>
                      <Link
                        to="/addresses"
                        className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <MapPinIcon className="h-4 w-4 mr-3 text-gray-400" />
                        Addresses
                      </Link>
                      <Link
                        to="/wishlist"
                        className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <HeartIcon className="h-4 w-4 mr-3 text-gray-400" />
                        Wishlist
                      </Link>
                      {user?.role === 'ADMIN' && (
                        <>
                          <div className="border-t my-2"></div>
                          <Link
                            to="/admin"
                            className="flex items-center px-4 py-2.5 text-sm text-primary-600 hover:bg-primary-50 transition-colors font-medium"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <svg className="h-4 w-4 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Admin Dashboard
                          </Link>
                        </>
                      )}
                      <div className="border-t my-2"></div>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <svg className="h-4 w-4 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Orders - Desktop */}
              <Link
                to="/orders"
                className="hidden lg:flex items-center py-2 px-2 border border-transparent hover:border-white rounded transition-all"
              >
                <div className="text-left">
                  <span className="text-gray-300 text-xs block leading-tight">Returns</span>
                  <span className="text-white text-sm font-bold leading-tight">& Orders</span>
                </div>
              </Link>

              {/* Cart */}
              <Link
                to="/cart"
                className="flex items-center py-2 px-2 border border-transparent hover:border-white rounded transition-all"
              >
                <div className="relative">
                  <ShoppingCartIcon className="h-8 w-8 text-white" />
                  <span className="absolute -top-1 right-0 bg-amazon-orange text-amazon-navy text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {itemCount > 99 ? '99+' : itemCount}
                  </span>
                </div>
                <span className="text-white text-sm font-bold ml-1 hidden sm:block">Cart</span>
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden ml-2 p-2 text-white"
              >
                {isMenuOpen ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Secondary Nav Bar */}
      <div className="bg-amazon-navy-light text-white hidden md:block">
        <div className="max-w-[1500px] mx-auto px-4">
          <div className="flex items-center h-[39px] gap-1 text-sm">
            <Link 
              to="/products" 
              className="flex items-center px-2 py-1 hover:border hover:border-white rounded transition-all"
            >
              <Bars3Icon className="h-5 w-5 mr-1" />
              All Products
            </Link>
            <Link to="/products?category=fruits-vegetables" className="px-2 py-1 hover:border hover:border-white rounded transition-all">
              Fruits & Vegetables
            </Link>
            <Link to="/products?category=dairy-eggs" className="px-2 py-1 hover:border hover:border-white rounded transition-all">
              Dairy & Eggs
            </Link>
            <Link to="/products?category=grains-staples" className="px-2 py-1 hover:border hover:border-white rounded transition-all">
              Grains & Staples
            </Link>
            <Link to="/products?category=beverages" className="px-2 py-1 hover:border hover:border-white rounded transition-all">
              Beverages
            </Link>
            <Link to="/products?category=bakery" className="px-2 py-1 hover:border hover:border-white rounded transition-all">
              Bakery
            </Link>
            <Link to="/products?featured=true" className="px-2 py-1 hover:border hover:border-white rounded transition-all text-amazon-orange font-medium">
              Today's Deals
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Search */}
      <div className="bg-amazon-navy px-4 py-2 md:hidden">
        <form onSubmit={handleSearch}>
          <div className="flex rounded-md overflow-hidden">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search GroceryShop"
              className="flex-1 px-4 py-2.5 text-sm focus:outline-none"
            />
            <button
              type="submit"
              className="bg-amazon-orange hover:bg-amazon-orange-dark px-4 transition-colors"
            >
              <MagnifyingGlassIcon className="h-5 w-5 text-amazon-navy" />
            </button>
          </div>
        </form>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setIsMenuOpen(false)}
          />
          <div className="fixed top-0 left-0 w-[300px] h-full bg-white z-50 overflow-y-auto md:hidden">
            {/* Mobile Menu Header */}
            <div className="bg-amazon-navy-light text-white p-4 flex items-center">
              <UserIcon className="h-8 w-8 mr-3" />
              <span className="font-bold text-lg">
                Hello, {isAuthenticated ? user?.firstName : 'Sign in'}
              </span>
            </div>

            {/* Menu Content */}
            <div className="py-4">
              <div className="px-4 pb-4 border-b">
                <h3 className="font-bold text-lg mb-2">Shop By Category</h3>
                <Link to="/products" className="block py-2 hover:text-primary-600" onClick={() => setIsMenuOpen(false)}>
                  All Products
                </Link>
                <Link to="/products?category=fruits-vegetables" className="block py-2 hover:text-primary-600" onClick={() => setIsMenuOpen(false)}>
                  Fruits & Vegetables
                </Link>
                <Link to="/products?category=dairy-eggs" className="block py-2 hover:text-primary-600" onClick={() => setIsMenuOpen(false)}>
                  Dairy & Eggs
                </Link>
                <Link to="/products?category=grains-staples" className="block py-2 hover:text-primary-600" onClick={() => setIsMenuOpen(false)}>
                  Grains & Staples
                </Link>
                <Link to="/products?category=beverages" className="block py-2 hover:text-primary-600" onClick={() => setIsMenuOpen(false)}>
                  Beverages
                </Link>
                <Link to="/products?category=bakery" className="block py-2 hover:text-primary-600" onClick={() => setIsMenuOpen(false)}>
                  Bakery
                </Link>
              </div>

              {isAuthenticated ? (
                <div className="px-4 py-4 border-b">
                  <h3 className="font-bold text-lg mb-2">Your Account</h3>
                  <Link to="/profile" className="block py-2 hover:text-primary-600" onClick={() => setIsMenuOpen(false)}>
                    My Profile
                  </Link>
                  <Link to="/orders" className="block py-2 hover:text-primary-600" onClick={() => setIsMenuOpen(false)}>
                    My Orders
                  </Link>
                  <Link to="/addresses" className="block py-2 hover:text-primary-600" onClick={() => setIsMenuOpen(false)}>
                    Addresses
                  </Link>
                  <Link to="/wishlist" className="block py-2 hover:text-primary-600" onClick={() => setIsMenuOpen(false)}>
                    Wishlist
                  </Link>
                  {user?.role === 'ADMIN' && (
                    <Link to="/admin" className="block py-2 text-primary-600 font-medium" onClick={() => setIsMenuOpen(false)}>
                      Admin Dashboard
                    </Link>
                  )}
                </div>
              ) : (
                <div className="px-4 py-4 border-b">
                  <Link 
                    to="/login" 
                    className="block w-full py-2.5 bg-amazon-orange text-center font-bold rounded-lg mb-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <p className="text-sm text-center text-gray-600">
                    New customer? <Link to="/register" className="text-primary-600" onClick={() => setIsMenuOpen(false)}>Start here</Link>
                  </p>
                </div>
              )}

              {isAuthenticated && (
                <div className="px-4 py-4">
                  <button 
                    onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                    className="text-red-600 font-medium"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </header>
  );
}

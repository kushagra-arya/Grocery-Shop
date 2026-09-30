import { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// Layout Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import Loader from './components/common/Loader';
import ScrollToTop from './components/common/ScrollToTop';

// Route Guards
import PrivateRoute from './routes/PrivateRoute';
import AdminRoute from './routes/AdminRoute';

// Public Pages
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Login from './pages/Login';
import Register from './pages/Register';

// Footer/Info Pages
import About from './pages/About';
import Contact from './pages/Contact';
import Help from './pages/Help';
import Careers from './pages/Careers';
import Returns from './pages/Returns';
import Sustainability from './pages/Sustainability';
import Sell from './pages/Sell';
import Partner from './pages/Partner';
import Advertise from './pages/Advertise';
import Franchise from './pages/Franchise';
import Conditions from './pages/Conditions';
import Privacy from './pages/Privacy';
import InterestAds from './pages/InterestAds';
import JobDetail from './pages/JobDetail';

// Protected User Pages
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import PaymentGateway from './pages/PaymentGateway';
import OrderConfirmation from './pages/OrderConfirmation';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';
import Addresses from './pages/Addresses';
import Wishlist from './pages/Wishlist';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import ManageProducts from './pages/admin/ManageProducts';
import ManageOrders from './pages/admin/ManageOrders';
import ManageCategories from './pages/admin/ManageCategories';
import ManageUsers from './pages/admin/ManageUsers';
import ManageInventory from './pages/admin/ManageInventory';
import ManageReviews from './pages/admin/ManageReviews';
import ManageContactMessages from './pages/admin/ManageContactMessages';

// Auth slice
import { getProfile, refreshToken, logout } from './store/slices/authSlice';
import { loadUserWishlist } from './store/slices/wishlistSlice';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, isLoading, user } = useSelector((state) => state.auth);
  const [appInitialized, setAppInitialized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      // Try to get profile, but set initialized regardless of success
      dispatch(getProfile())
        .unwrap()
        .then(() => {
          console.log('Profile loaded successfully');
          dispatch(loadUserWishlist());
        })
        .catch((error) => {
          console.error('Failed to load profile:', error);
          // Clear invalid tokens from localStorage AND Redux state
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          dispatch(logout()).catch(() => {});
        })
        .finally(() => {
          setAppInitialized(true);
        });
    } else {
      setAppInitialized(true);
    }
  }, [dispatch]);

  useEffect(() => {
    const refreshInterval = setInterval(() => {
      const token = localStorage.getItem('refreshToken');
      if (token) {
        dispatch(refreshToken());
      }
    }, 14 * 60 * 1000);

    return () => clearInterval(refreshInterval);
  }, [dispatch]);

  if (!appInitialized) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f3f4f6' }}>
        <div style={{ textAlign: 'center' }}>
          <Loader size="lg" />
          <p style={{ marginTop: '1rem', color: '#666' }}>Loading application...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <ScrollToTop />
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:slug" element={<ProductDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/wishlist" element={<Wishlist />} />

          {/* Footer/Info Pages */}
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/help" element={<Help />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/returns" element={<Returns />} />
          <Route path="/sustainability" element={<Sustainability />} />
          <Route path="/sell" element={<Sell />} />
          <Route path="/partner" element={<Partner />} />
          <Route path="/advertise" element={<Advertise />} />
          <Route path="/franchise" element={<Franchise />} />
          <Route path="/conditions" element={<Conditions />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/interest-ads" element={<InterestAds />} />
          <Route path="/careers/:jobSlug" element={<JobDetail />} />

          <Route element={<PrivateRoute />}>
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/payment/:orderId" element={<PaymentGateway />} />
            <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/orders/:id" element={<OrderDetail />} />
            <Route path="/addresses" element={<Addresses />} />
          </Route>

          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/products" element={<ManageProducts />} />
            <Route path="/admin/orders" element={<ManageOrders />} />
            <Route path="/admin/categories" element={<ManageCategories />} />
            <Route path="/admin/users" element={<ManageUsers />} />
            <Route path="/admin/inventory" element={<ManageInventory />} />
            <Route path="/admin/reviews" element={<ManageReviews />} />
            <Route path="/admin/messages" element={<ManageContactMessages />} />
          </Route>
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;

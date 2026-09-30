import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  ArrowRightIcon, 
  GiftIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { getFeaturedProducts, getCategories } from '../store/slices/productSlice';
import { getImageUrl } from '../utils';
import ProductGrid from '../components/product/ProductGrid';
import Loader from '../components/common/Loader';

export default function Home() {
  const dispatch = useDispatch();
  const { featuredProducts, categories, isLoading } = useSelector((state) => state.products);
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getFeaturedProducts());
    dispatch(getCategories());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section with Background Image */}
      <section className="relative bg-amazon-navy-light overflow-hidden">
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-100/50 to-gray-100"></div>
        
        <div className="relative max-w-[1500px] mx-auto">
          {/* Hero Content */}
          <div className="relative z-10 px-4 pt-8 pb-32">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              {/* Text Content */}
              <div className="text-center lg:text-left">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                  Fresh Groceries,
                  <br />
                  <span className="text-amazon-orange">Delivered Fast</span>
                </h1>
                <p className="text-lg text-gray-300 mb-8 max-w-lg mx-auto lg:mx-0">
                  Shop from our wide selection of fresh fruits, vegetables, dairy, and daily essentials. 
                  Free delivery on orders over ₹500.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link
                    to="/products"
                    className="inline-flex items-center justify-center px-8 py-3.5 bg-gradient-to-b from-amazon-orange to-amazon-orange-dark text-amazon-navy font-bold rounded-lg hover:brightness-105 transition-all shadow-lg"
                  >
                    Shop Now
                    <ArrowRightIcon className="h-5 w-5 ml-2" />
                  </Link>
                  <Link
                    to="/products?featured=true"
                    className="inline-flex items-center justify-center px-8 py-3.5 bg-white/10 text-white font-medium rounded-lg hover:bg-white/20 transition-all border border-white/20"
                  >
                    <GiftIcon className="h-5 w-5 mr-2" />
                    Today's Deals
                  </Link>
                </div>
              </div>

              {/* Hero Image */}
              <div className="hidden lg:block">
                <img
                  src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=600"
                  alt="Fresh groceries"
                  className="rounded-2xl shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Cards - Overlapping Hero */}
      <section className="relative -mt-24 z-20 px-4">
        <div className="max-w-[1500px] mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-lg p-4 shadow-card">
                  <div className="skeleton h-24 mb-3 rounded"></div>
                  <div className="skeleton h-4 w-3/4 mx-auto rounded"></div>
                </div>
              ))
            ) : Array.isArray(categories) && categories.length > 0 ? (
              categories.slice(0, 6).map((category) => (
                <Link
                  key={category.id}
                  to={`/products?category=${category.slug}`}
                  className="bg-white rounded-lg p-4 shadow-card hover:shadow-card-hover transition-all duration-300 group"
                >
                  <div className="aspect-square rounded-lg bg-gray-50 mb-3 overflow-hidden">
                    <img
                      src={getImageUrl(category.imageUrl, `https://via.placeholder.com/200?text=${category.name}`)}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm text-center group-hover:text-primary-600 transition-colors">
                    {category.name}
                  </h3>
                  {category.productCount && (
                    <p className="text-xs text-gray-500 text-center">{category.productCount} items</p>
                  )}
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500">No categories available</div>
            )}
          </div>
        </div>
      </section>

      {/* Today's Deals */}
      <section className="py-8">
        <div className="max-w-[1500px] mx-auto px-4">
          <div className="bg-white rounded-lg shadow-card p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Today's Deals</h2>
                <p className="text-sm text-gray-500">Limited time offers</p>
              </div>
              <Link
                to="/products?featured=true"
                className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center"
              >
                See all deals
                <ArrowRightIcon className="h-4 w-4 ml-1" />
              </Link>
            </div>
            <ProductGrid products={featuredProducts?.slice(0, 4)} isLoading={isLoading} columns={4} />
          </div>
        </div>
      </section>

      {/* Browse Categories */}
      <section className="py-8">
        <div className="max-w-[1500px] mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Category Promo Cards */}
            <div className="bg-white rounded-lg shadow-card p-6">
              <h3 className="font-bold text-lg text-gray-900 mb-4">Fresh Fruits</h3>
              <div className="grid grid-cols-2 gap-2 mb-4">
                <img src="https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=150" alt="Apples" className="rounded-lg aspect-square object-cover" />
                <img src="https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=150" alt="Oranges" className="rounded-lg aspect-square object-cover" />
                <img src="https://images.unsplash.com/photo-1528825871115-3581a5387919?w=150" alt="Bananas" className="rounded-lg aspect-square object-cover" />
                <img src="https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=150" alt="Grapes" className="rounded-lg aspect-square object-cover" />
              </div>
              <Link to="/products?category=fruits-vegetables" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                Shop now →
              </Link>
            </div>

            <div className="bg-white rounded-lg shadow-card p-6">
              <h3 className="font-bold text-lg text-gray-900 mb-4">Fresh Vegetables</h3>
              <div className="grid grid-cols-2 gap-2 mb-4">
                <img src="https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=150" alt="Tomatoes" className="rounded-lg aspect-square object-cover" />
                <img src="https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=150" alt="Carrots" className="rounded-lg aspect-square object-cover" />
                <img src="https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=150" alt="Broccoli" className="rounded-lg aspect-square object-cover" />
                <img src="https://images.unsplash.com/photo-1596591606975-97ee5cef3a1e?w=150" alt="Peppers" className="rounded-lg aspect-square object-cover" />
              </div>
              <Link to="/products?category=fruits-vegetables" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                Shop now →
              </Link>
            </div>

            <div className="bg-white rounded-lg shadow-card p-6">
              <h3 className="font-bold text-lg text-gray-900 mb-4">Dairy & Eggs</h3>
              <div className="grid grid-cols-2 gap-2 mb-4">
                <img src="https://images.unsplash.com/photo-1563636619-e9143da7973b?w=150" alt="Milk" className="rounded-lg aspect-square object-cover" />
                <img src="https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=150" alt="Eggs" className="rounded-lg aspect-square object-cover" />
                <img src="https://images.unsplash.com/photo-1559561853-08451507cbe7?w=150" alt="Cheese" className="rounded-lg aspect-square object-cover" />
                <img src="https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=150" alt="Butter" className="rounded-lg aspect-square object-cover" />
              </div>
              <Link to="/products?category=dairy-eggs" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                Shop now →
              </Link>
            </div>

            <div className="bg-white rounded-lg shadow-card p-6">
              <h3 className="font-bold text-lg text-gray-900 mb-4">Bakery Fresh</h3>
              <div className="grid grid-cols-2 gap-2 mb-4">
                <img src="https://images.unsplash.com/photo-1509440159596-0249088772ff?w=150" alt="Bread" className="rounded-lg aspect-square object-cover" />
                <img src="https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=150" alt="Croissant" className="rounded-lg aspect-square object-cover" />
                <img src="https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=150" alt="Muffins" className="rounded-lg aspect-square object-cover" />
                <img src="https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=150" alt="Cookies" className="rounded-lg aspect-square object-cover" />
              </div>
              <Link to="/products?category=bakery" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                Shop now →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-8">
        <div className="max-w-[1500px] mx-auto px-4">
          <div className="bg-white rounded-lg shadow-card p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Popular Products</h2>
                <p className="text-sm text-gray-500">Trending items this week</p>
              </div>
              <Link
                to="/products"
                className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center"
              >
                View all products
                <ArrowRightIcon className="h-4 w-4 ml-1" />
              </Link>
            </div>
            <ProductGrid products={featuredProducts} isLoading={isLoading} />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="py-12">
          <div className="max-w-[1500px] mx-auto px-4">
            <div className="bg-gradient-to-r from-amazon-navy to-amazon-navy-light rounded-2xl p-8 md:p-12 text-center text-white">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Sign in for the best experience
              </h2>
              <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                Join thousands of happy customers who trust us for their daily grocery needs.
                Get personalized recommendations and exclusive member deals!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center px-8 py-3 bg-amazon-orange text-amazon-navy font-bold rounded-lg hover:brightness-105 transition-all"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center px-8 py-3 bg-white/10 text-white font-medium rounded-lg hover:bg-white/20 transition-all border border-white/20"
                >
                  Create Account
                  <ArrowRightIcon className="h-5 w-5 ml-2" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

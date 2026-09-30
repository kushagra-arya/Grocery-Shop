import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ShoppingCartIcon, HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon, StarIcon } from '@heroicons/react/24/solid';
import { addToCart } from '../../store/slices/cartSlice';
import { toggleWishlistItem, selectIsWishlisted } from '../../store/slices/wishlistSlice';
import { getImageUrl } from '../../utils';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const isWishlisted = useSelector(selectIsWishlisted(product.id));
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }

    setIsAddingToCart(true);
    try {
      await dispatch(addToCart({ productId: product.id, quantity: 1 })).unwrap();
      toast.success('Added to cart!');
    } catch (error) {
      toast.error(error || 'Failed to add to cart');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error('Please login to add items to wishlist');
      navigate('/login');
      return;
    }
    dispatch(toggleWishlistItem(product));
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  const discount = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <StarIcon key={i} className="h-4 w-4 text-amber-400" />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <div key={i} className="relative">
            <StarIcon className="h-4 w-4 text-gray-200" />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <StarIcon className="h-4 w-4 text-amber-400" />
            </div>
          </div>
        );
      } else {
        stars.push(
          <StarIcon key={i} className="h-4 w-4 text-gray-200" />
        );
      }
    }
    return stars;
  };

  return (
    <Link
      to={`/products/${product.slug || product.id}`}
      className="group bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col"
    >
      {/* Image Container */}
      <div className="relative aspect-square bg-gray-50 overflow-hidden">
        {/* Skeleton loader */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        )}
        <img
          src={getImageUrl(product.primaryImage || product.images?.[0]?.imageUrl, 'https://via.placeholder.com/400')}
          alt={product.name}
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {discount > 0 && (
            <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
              -{discount}%
            </span>
          )}
          {product.isFeatured && (
            <span className="bg-amazon-orange text-amazon-navy text-xs font-bold px-2 py-1 rounded">
              Best Seller
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          className="absolute top-2 right-2 p-2 bg-white/90 hover:bg-white rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-200"
        >
          {isWishlisted ? (
            <HeartSolidIcon className="h-5 w-5 text-red-500" />
          ) : (
            <HeartIcon className="h-5 w-5 text-gray-600" />
          )}
        </button>
        
        {/* Out of Stock Overlay */}
        {product.stockQuantity === 0 && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="bg-white text-gray-900 px-4 py-2 rounded-lg font-semibold text-sm">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Category */}
        {product.category?.name && (
          <p className="text-xs text-primary-600 font-medium mb-1 uppercase tracking-wide">
            {product.category.name}
          </p>
        )}
        
        {/* Name */}
        <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors leading-snug">
          {product.name}
        </h3>
        
        {/* Rating */}
        {product.avgRating > 0 && (
          <div className="flex items-center gap-1 mb-2">
            <div className="flex">{renderStars(product.avgRating)}</div>
            <span className="text-sm text-amazon-blue font-medium ml-1">
              {product.avgRating.toFixed(1)}
            </span>
            <span className="text-sm text-gray-500">
              ({product.reviewCount?.toLocaleString() || 0})
            </span>
          </div>
        )}
        
        {/* Price Section */}
        <div className="mt-auto">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-xl font-bold text-gray-900">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.comparePrice && product.comparePrice > product.price && (
              <>
                <span className="text-sm text-gray-500 line-through">
                  ₹{product.comparePrice.toLocaleString('en-IN')}
                </span>
                <span className="text-sm font-medium text-green-600">
                  Save ₹{(product.comparePrice - product.price).toLocaleString('en-IN')}
                </span>
              </>
            )}
          </div>
          {product.unit && (
            <p className="text-xs text-gray-500 mt-0.5">per {product.unit}</p>
          )}
        </div>

        {/* Stock Status */}
        {product.stockQuantity > 0 && product.stockQuantity <= 5 && (
          <p className="text-xs text-orange-600 font-medium mt-2">
            Only {product.stockQuantity} left in stock
          </p>
        )}
        
        {/* Add to Cart Button */}
        {product.stockQuantity > 0 && (
          <button
            onClick={handleAddToCart}
            disabled={isAddingToCart}
            className="mt-3 w-full py-2.5 bg-gradient-to-b from-amazon-orange to-amazon-orange-dark text-amazon-navy font-semibold rounded-lg hover:brightness-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
          >
            {isAddingToCart ? (
              <span className="spinner border-amazon-navy" />
            ) : (
              <>
                <ShoppingCartIcon className="h-4 w-4" />
                Add to Cart
              </>
            )}
          </button>
        )}
      </div>
    </Link>
  );
}

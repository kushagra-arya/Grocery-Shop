import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  ShoppingCartIcon,
  HeartIcon,
  StarIcon,
  MinusIcon,
  PlusIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CheckIcon,
  TruckIcon,
  ShieldCheckIcon,
  ArrowPathIcon,
  MapPinIcon,
  ShareIcon,
  CheckBadgeIcon,
  HandThumbUpIcon,
} from '@heroicons/react/24/solid';
import { StarIcon as StarOutline, HeartIcon as HeartOutline, HandThumbUpIcon as HandThumbUpOutline } from '@heroicons/react/24/outline';
import { getProductBySlug, clearCurrentProduct, getFeaturedProducts } from '../store/slices/productSlice';
import { addToCart } from '../store/slices/cartSlice';
import { toggleWishlistItem, selectIsWishlisted } from '../store/slices/wishlistSlice';
import Loader from '../components/common/Loader';
import ReviewForm from '../components/product/ReviewForm';
import ProductCard from '../components/product/ProductCard';
import { getImageUrl } from '../utils';
import reviewService from '../services/reviewService';
import toast from 'react-hot-toast';

// Star Rating Component
const StarRating = ({ rating, size = 'md', showText = false }) => {
  const sizes = { sm: 'h-3 w-3', md: 'h-5 w-5', lg: 'h-6 w-6' };
  const sizeClass = sizes[size];
  
  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, index) => {
        const filled = index < Math.floor(rating);
        const halfFilled = index === Math.floor(rating) && rating % 1 >= 0.5;
        
        if (filled) {
          return <StarIcon key={index} className={`${sizeClass} text-amazon-orange`} />;
        } else if (halfFilled) {
          return (
            <div key={index} className="relative">
              <StarOutline className={`${sizeClass} text-gray-300`} />
              <div className="absolute inset-0 overflow-hidden w-1/2">
                <StarIcon className={`${sizeClass} text-amazon-orange`} />
              </div>
            </div>
          );
        }
        return <StarOutline key={index} className={`${sizeClass} text-gray-300`} />;
      })}
      {showText && (
        <span className="ml-1 text-sm text-amazon-blue font-medium">
          {rating?.toFixed(1)}
        </span>
      )}
    </div>
  );
};

// Rating Breakdown Component
const RatingBreakdown = ({ reviews }) => {
  const breakdown = useMemo(() => {
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews?.forEach(r => {
      if (counts[r.rating] !== undefined) counts[r.rating]++;
    });
    const total = reviews?.length || 1;
    return Object.entries(counts).reverse().map(([stars, count]) => ({
      stars: parseInt(stars),
      count,
      percentage: (count / total) * 100
    }));
  }, [reviews]);

  return (
    <div className="space-y-2">
      {breakdown.map(({ stars, count, percentage }) => (
        <div key={stars} className="flex items-center gap-3 text-sm">
          <button className="text-amazon-blue hover:text-amazon-orange hover:underline whitespace-nowrap">
            {stars} star
          </button>
          <div className="flex-1 h-4 bg-gray-200 rounded overflow-hidden">
            <div 
              className="h-full bg-amazon-orange rounded"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <span className="text-gray-600 w-8">{Math.round(percentage)}%</span>
        </div>
      ))}
    </div>
  );
};

// Product Image Gallery Component
const ImageGallery = ({ images, productName }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZooming, setIsZooming] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const currentImage = getImageUrl(images?.[selectedIndex]?.imageUrl || images?.[selectedIndex]?.url);

  const handleMouseMove = (e) => {
    if (!isZooming) return;
    const rect = e.target.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePosition({ x, y });
  };

  const nextImage = () => {
    setSelectedIndex(prev => (prev + 1) % (images?.length || 1));
  };

  const prevImage = () => {
    setSelectedIndex(prev => (prev - 1 + (images?.length || 1)) % (images?.length || 1));
  };

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div 
        className="relative aspect-square bg-white rounded-lg border overflow-hidden cursor-crosshair"
        onMouseEnter={() => setIsZooming(true)}
        onMouseLeave={() => setIsZooming(false)}
        onMouseMove={handleMouseMove}
      >
        <img
          src={currentImage}
          alt={productName}
          className={`w-full h-full object-contain transition-transform duration-200 ${isZooming ? 'scale-150' : ''}`}
          style={isZooming ? { transformOrigin: `${mousePosition.x}% ${mousePosition.y}%` } : {}}
        />
        
        {/* Navigation Arrows */}
        {images?.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all"
            >
              <ChevronLeftIcon className="h-5 w-5 text-gray-700" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all"
            >
              <ChevronRightIcon className="h-5 w-5 text-gray-700" />
            </button>
          </>
        )}

        {/* Image Counter */}
        {images?.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
            {selectedIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images?.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={image.id || index}
              onClick={() => setSelectedIndex(index)}
              onMouseEnter={() => setSelectedIndex(index)}
              className={`flex-shrink-0 w-16 h-16 rounded-lg border-2 overflow-hidden transition-all ${
                selectedIndex === index 
                  ? 'border-amazon-orange shadow-md' 
                  : 'border-gray-200 hover:border-amazon-orange/50'
              }`}
            >
              <img
                src={getImageUrl(image.imageUrl || image.url)}
                alt={`${productName} ${index + 1}`}
                className="w-full h-full object-contain"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Review Card Component
const ReviewCard = ({ review, onHelpful }) => {
  const userName = review.user 
    ? `${review.user.firstName} ${review.user.lastName}`.trim() 
    : 'Anonymous';
  const [helpfulCount, setHelpfulCount] = useState(review.helpfulCount || 0);
  const [markedHelpful, setMarkedHelpful] = useState(() => {
    try {
      const marked = JSON.parse(localStorage.getItem('helpfulReviews') || '[]');
      return marked.includes(review.id);
    } catch { return false; }
  });

  const handleHelpful = async () => {
    if (markedHelpful) return;
    try {
      await reviewService.markHelpful(review.id);
      setHelpfulCount(prev => prev + 1);
      setMarkedHelpful(true);
      try {
        const marked = JSON.parse(localStorage.getItem('helpfulReviews') || '[]');
        marked.push(review.id);
        localStorage.setItem('helpfulReviews', JSON.stringify(marked));
      } catch {}
      toast.success('Thanks for your feedback!');
    } catch (err) {
      toast.error('Failed to mark as helpful');
    }
  };
  
  return (
    <div className="border-b last:border-0 py-6">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-amazon-navy-light flex items-center justify-center flex-shrink-0">
          <span className="text-white font-semibold">
            {userName.charAt(0).toUpperCase()}
          </span>
        </div>
        
        <div className="flex-1 min-w-0">
          {/* User Info */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-gray-900">{userName}</span>
            {review.verifiedPurchase && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">
                <CheckBadgeIcon className="h-3.5 w-3.5" />
                Verified Purchase
              </span>
            )}
          </div>
          
          {/* Rating & Title */}
          <div className="flex items-center gap-2 mt-1">
            <StarRating rating={review.rating} size="sm" />
            {review.title && (
              <span className="font-bold text-gray-900">{review.title}</span>
            )}
          </div>
          
          {/* Date */}
          <p className="text-sm text-gray-500 mt-1">
            Reviewed on {new Date(review.createdAt).toLocaleDateString('en-IN', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
          
          {/* Comment */}
          {review.comment && (
            <p className="mt-3 text-gray-700 leading-relaxed">
              {review.comment}
            </p>
          )}
          
          {/* Helpful Button */}
          <div className="flex items-center gap-4 mt-4">
            <button 
              onClick={handleHelpful}
              disabled={markedHelpful}
              className={`flex items-center gap-1.5 text-sm transition-colors ${
                markedHelpful 
                  ? 'text-amazon-orange cursor-default' 
                  : 'text-gray-600 hover:text-amazon-orange'
              }`}
            >
              {markedHelpful ? (
                <HandThumbUpIcon className="h-4 w-4" />
              ) : (
                <HandThumbUpOutline className="h-4 w-4" />
              )}
              Helpful {helpfulCount > 0 && `(${helpfulCount})`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { currentProduct: product, isProductLoading: isLoading, error, featuredProducts } = useSelector((state) => state.products);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const isWishlisted = useSelector(selectIsWishlisted(product?.id));
  
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    if (slug) {
      dispatch(getProductBySlug(slug));
    }
    dispatch(getFeaturedProducts());
    
    return () => {
      dispatch(clearCurrentProduct());
    };
  }, [dispatch, slug]);

  const handleReviewSubmitted = () => {
    // Refresh product data to show new review
    dispatch(getProductBySlug(slug));
    setShowReviewForm(false);
  };

  const handleQuantityChange = (delta) => {
    const newQuantity = quantity + delta;
    const maxQty = product?.stockQuantity || 10;
    if (newQuantity >= 1 && newQuantity <= maxQty) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      navigate('/login', { state: { from: `/products/${slug}` } });
      return;
    }

    setIsAddingToCart(true);
    try {
      await dispatch(addToCart({ productId: product.id, quantity })).unwrap();
      toast.success(`Added ${quantity} item(s) to cart!`);
    } catch (err) {
      toast.error(err.message || 'Failed to add to cart');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to continue');
      navigate('/login', { state: { from: `/products/${slug}` } });
      return;
    }

    setIsAddingToCart(true);
    try {
      await dispatch(addToCart({ productId: product.id, quantity })).unwrap();
      navigate('/cart');
    } catch (err) {
      toast.error(err.message || 'Failed to proceed');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const toggleWishlist = () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to wishlist');
      navigate('/login', { state: { from: `/products/${slug}` } });
      return;
    }
    dispatch(toggleWishlistItem(product));
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  const shareProduct = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 space-y-4">
              <div className="aspect-square bg-gray-200 rounded-lg"></div>
              <div className="flex gap-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-16 h-16 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
            <div className="lg:col-span-4 space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-6 bg-gray-200 rounded w-1/3"></div>
              <div className="h-24 bg-gray-200 rounded"></div>
            </div>
            <div className="lg:col-span-3">
              <div className="h-64 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center bg-white rounded-lg p-12 shadow-sm max-w-md">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h1>
          <p className="text-gray-600 mb-6">
            Sorry, we couldn't find the product you're looking for.
          </p>
          <button
            onClick={() => navigate('/products')}
            className="px-6 py-3 bg-amazon-orange text-white rounded-lg font-medium hover:bg-amazon-orange-dark transition-colors"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  const stockQty = product.stockQuantity || 0;
  const inStock = stockQty > 0;
  const lowStock = stockQty > 0 && stockQty <= 5;
  const averageRating = product.avgRating || 0;
  const reviewCount = product.reviewCount || product.reviews?.length || 0;
  const discount = product.comparePrice 
    ? Math.round((1 - product.price / product.comparePrice) * 100) 
    : 0;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-2 text-sm flex-wrap">
            <Link to="/" className="text-amazon-blue hover:text-amazon-orange hover:underline">
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <Link to="/products" className="text-amazon-blue hover:text-amazon-orange hover:underline">
              Products
            </Link>
            {product.category && (
              <>
                <span className="text-gray-400">/</span>
                <Link 
                  to={`/products?category=${product.category.slug}`}
                  className="text-amazon-blue hover:text-amazon-orange hover:underline"
                >
                  {product.category.name}
                </Link>
              </>
            )}
            <span className="text-gray-400">/</span>
            <span className="text-gray-600 truncate max-w-[200px]">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Main Product Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Image Gallery - Left Column */}
            <div className="lg:col-span-5">
              <ImageGallery images={product.images} productName={product.name} />
            </div>

            {/* Product Info - Middle Column */}
            <div className="lg:col-span-4 space-y-4">
              {/* Title */}
              <h1 className="text-2xl font-medium text-gray-900 leading-tight">
                {product.name}
              </h1>

              {/* Brand / Category Link */}
              {product.category && (
                <Link 
                  to={`/products?category=${product.category.slug}`}
                  className="text-sm text-amazon-blue hover:text-amazon-orange hover:underline"
                >
                  Visit the {product.category.name} Store
                </Link>
              )}

              {/* Rating */}
              <div className="flex items-center gap-2 pb-4 border-b">
                <StarRating rating={averageRating} showText />
                <span className="text-amazon-blue hover:text-amazon-orange hover:underline cursor-pointer">
                  {reviewCount} {reviewCount === 1 ? 'rating' : 'ratings'}
                </span>
              </div>

              {/* Price Section */}
              <div className="pb-4 border-b">
                {discount > 0 && (
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 bg-red-600 text-white text-sm font-medium rounded">
                      -{discount}%
                    </span>
                    <span className="text-sm text-gray-500">Limited time deal</span>
                  </div>
                )}
                <div className="flex items-baseline gap-2">
                  <span className="text-sm text-gray-600">₹</span>
                  <span className="text-3xl font-medium text-gray-900">
                    {Math.floor(product.price).toLocaleString('en-IN')}
                  </span>
                  <span className="text-gray-900">
                    {(product.price % 1).toFixed(2).substring(1)}
                  </span>
                </div>
                {product.comparePrice && (
                  <p className="text-sm text-gray-500 mt-1">
                    M.R.P.: <span className="line-through">₹{product.comparePrice.toLocaleString('en-IN')}</span>
                  </p>
                )}
                <p className="text-sm text-gray-600 mt-1">
                  Inclusive of all taxes
                </p>
              </div>

              {/* Description */}
              <div className="py-4 border-b">
                <h3 className="font-bold text-gray-900 mb-2">About this item</h3>
                <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                  {product.description}
                </div>
              </div>

              {/* Product Details */}
              <div className="py-4">
                <h3 className="font-bold text-gray-900 mb-3">Product Details</h3>
                <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  {product.sku && (
                    <>
                      <dt className="text-gray-600">SKU</dt>
                      <dd className="text-gray-900">{product.sku}</dd>
                    </>
                  )}
                  {product.unit && (
                    <>
                      <dt className="text-gray-600">Unit</dt>
                      <dd className="text-gray-900 capitalize">{product.unit}</dd>
                    </>
                  )}
                  {product.category && (
                    <>
                      <dt className="text-gray-600">Category</dt>
                      <dd className="text-gray-900">{product.category.name}</dd>
                    </>
                  )}
                </dl>
              </div>
            </div>

            {/* Buy Box - Right Column */}
            <div className="lg:col-span-3">
              <div className="border rounded-lg p-4 sticky top-24 space-y-4">
                {/* Price */}
                <div className="text-2xl font-medium text-gray-900">
                  ₹{product.price.toLocaleString('en-IN')}
                </div>

                {/* Delivery Info */}
                <div className="text-sm space-y-2">
                  <div className="flex items-start gap-2">
                    <TruckIcon className="h-5 w-5 text-gray-600 flex-shrink-0" />
                    <div>
                      <span className="text-amazon-blue">FREE Delivery</span>
                      <span className="text-gray-700"> on orders over ₹499</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPinIcon className="h-5 w-5 flex-shrink-0" />
                    <span>Deliver to your location</span>
                  </div>
                </div>

                {/* Stock Status */}
                <div className="text-lg">
                  {inStock ? (
                    <span className="text-green-600 font-medium">In Stock</span>
                  ) : (
                    <span className="text-red-600 font-medium">Out of Stock</span>
                  )}
                  {lowStock && (
                    <p className="text-sm text-amazon-orange mt-1">
                      Only {stockQty} left - order soon
                    </p>
                  )}
                </div>

                {/* Quantity Selector */}
                {inStock && (
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-700">Qty:</span>
                    <div className="flex items-center border rounded-lg overflow-hidden">
                      <button
                        onClick={() => handleQuantityChange(-1)}
                        disabled={quantity <= 1}
                        className="px-3 py-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <MinusIcon className="h-4 w-4" />
                      </button>
                      <span className="px-4 py-2 font-medium min-w-[50px] text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(1)}
                        disabled={quantity >= stockQty}
                        className="px-3 py-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <PlusIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-2">
                  <button
                    onClick={handleAddToCart}
                    disabled={!inStock || isAddingToCart}
                    className="w-full py-2.5 bg-gradient-to-b from-yellow-300 to-yellow-400 hover:from-yellow-400 hover:to-yellow-500 text-gray-900 font-medium rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                  >
                    {isAddingToCart ? (
                      <Loader size="small" />
                    ) : (
                      <>
                        <ShoppingCartIcon className="h-5 w-5" />
                        Add to Cart
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={handleBuyNow}
                    disabled={!inStock || isAddingToCart}
                    className="w-full py-2.5 bg-gradient-to-b from-amazon-orange to-amazon-orange-dark hover:from-amazon-orange-dark hover:to-amazon-orange-dark text-white font-medium rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    Buy Now
                  </button>
                </div>

                {/* Secure Transaction */}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <ShieldCheckIcon className="h-5 w-5" />
                  <span>Secure transaction</span>
                </div>

                {/* Additional Actions */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <button 
                    onClick={toggleWishlist}
                    className={`flex items-center gap-1 text-sm ${isWishlisted ? 'text-red-500' : 'text-amazon-blue hover:text-amazon-orange'}`}
                  >
                    {isWishlisted ? (
                      <HeartIcon className="h-5 w-5" />
                    ) : (
                      <HeartOutline className="h-5 w-5" />
                    )}
                    {isWishlisted ? 'Wishlisted' : 'Add to List'}
                  </button>
                  <button 
                    onClick={shareProduct}
                    className="flex items-center gap-1 text-sm text-amazon-blue hover:text-amazon-orange"
                  >
                    <ShareIcon className="h-5 w-5" />
                    Share
                  </button>
                </div>

                {/* Trust Badges */}
                <div className="pt-4 border-t space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <ArrowPathIcon className="h-5 w-5" />
                    <span>7 Days Replacement</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheckIcon className="h-5 w-5" />
                    <span>100% Original Product</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Rating Overview */}
            <div className="lg:col-span-1">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Customer Reviews</h2>
              
              <div className="flex items-center gap-2 mb-4">
                <StarRating rating={averageRating} size="lg" />
                <span className="text-lg font-medium">{averageRating.toFixed(1)} out of 5</span>
              </div>
              
              <p className="text-sm text-gray-600 mb-6">
                {reviewCount} global {reviewCount === 1 ? 'rating' : 'ratings'}
              </p>

              {/* Rating Breakdown */}
              {product.reviews && product.reviews.length > 0 && (
                <RatingBreakdown reviews={product.reviews} />
              )}

              {/* Write Review Button */}
              <div className="mt-6 pt-6 border-t">
                <h3 className="font-bold text-gray-900 mb-2">Review this product</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Share your thoughts with other customers
                </p>
                <button 
                  onClick={() => {
                    if (!isAuthenticated) {
                      toast.error('Please login to write a review');
                      navigate('/login', { state: { from: `/products/${slug}` } });
                    } else {
                      setShowReviewForm(true);
                    }
                  }}
                  className="w-full py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Write a customer review
                </button>
              </div>
            </div>

            {/* Reviews List */}
            <div className="lg:col-span-2">
              {product.reviews && product.reviews.length > 0 ? (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-900">
                      Top reviews from India
                    </h3>
                    <select className="text-sm border rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-amazon-orange focus:border-amazon-orange">
                      <option>Most recent</option>
                      <option>Top reviews</option>
                    </select>
                  </div>
                  
                  <div className="divide-y">
                    {product.reviews.map((review) => (
                      <ReviewCard key={review.id} review={review} />
                    ))}
                  </div>
                  
                  {product.reviews.length >= 10 && (
                    <button className="mt-6 text-amazon-blue hover:text-amazon-orange hover:underline font-medium">
                      See all reviews →
                    </button>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <div className="text-4xl mb-4">⭐</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
                  <p className="text-gray-600 mb-4">Be the first to review this product!</p>
                  <button
                    onClick={() => {
                      if (!isAuthenticated) {
                        toast.error('Please login to write a review');
                        navigate('/login', { state: { from: `/products/${slug}` } });
                      } else {
                        setShowReviewForm(true);
                      }
                    }}
                    className="px-6 py-2 bg-amazon-orange text-white rounded-lg font-medium hover:bg-amazon-orange-dark transition-colors"
                  >
                    Write a Review
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* You May Also Like Section */}
        {featuredProducts && featuredProducts.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">You May Also Like</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {featuredProducts
                .filter(p => p.id !== product?.id)
                .slice(0, 4)
                .map((suggestedProduct) => (
                  <ProductCard key={suggestedProduct.id} product={suggestedProduct} />
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Review Form Modal */}
      {showReviewForm && (
        <ReviewForm
          productId={product.id}
          productName={product.name}
          onReviewSubmitted={handleReviewSubmitted}
          onClose={() => setShowReviewForm(false)}
        />
      )}
    </div>
  );
}

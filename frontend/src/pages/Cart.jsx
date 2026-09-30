import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  TrashIcon,
  MinusIcon,
  PlusIcon,
  ShoppingCartIcon,
  GiftIcon,
  TruckIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  HeartIcon,
  ShareIcon,
} from '@heroicons/react/24/outline';
import { CheckIcon } from '@heroicons/react/24/solid';
import { getCart, updateCartItem, removeFromCart, clearCart } from '../store/slices/cartSlice';
import { addToWishlist } from '../store/slices/wishlistSlice';
import { getImageUrl } from '../utils';
import toast from 'react-hot-toast';

// Skeleton loader for cart items
const CartItemSkeleton = () => (
  <div className="bg-white rounded-lg border p-4 animate-pulse">
    <div className="flex gap-4">
      <div className="w-24 h-24 bg-gray-200 rounded-lg"></div>
      <div className="flex-1 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-6 bg-gray-200 rounded w-1/4"></div>
      </div>
    </div>
  </div>
);

// Single cart item component
const CartItem = ({ item, onQuantityChange, onRemove, onSaveForLater, onShare, isUpdating }) => {
  const product = item.product;
  const itemTotal = item.itemTotal || (product.price * item.quantity);
  const hasDiscount = product.comparePrice && product.comparePrice > product.price;
  const discount = hasDiscount 
    ? Math.round((1 - product.price / product.comparePrice) * 100) 
    : 0;
  const lowStock = product.stockQuantity <= 5;
  const outOfStock = product.stockQuantity === 0;

  return (
    <div className={`bg-white rounded-lg border p-4 transition-all ${outOfStock ? 'opacity-60' : ''}`}>
      <div className="flex gap-4">
        {/* Product Image */}
        <Link to={`/products/${product.slug}`} className="flex-shrink-0">
          <img
            src={getImageUrl(product.image || product.primaryImage || product.images?.[0]?.imageUrl)}
            alt={product.name}
            className="w-24 h-24 sm:w-32 sm:h-32 object-contain rounded-lg border bg-gray-50"
          />
        </Link>

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          {/* Title & Price Row */}
          <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
            <div className="flex-1">
              <Link 
                to={`/products/${product.slug}`}
                className="text-lg font-medium text-amazon-navy-light hover:text-amazon-orange transition-colors line-clamp-2"
              >
                {product.name}
              </Link>
              
              {/* Stock Status */}
              {outOfStock ? (
                <p className="text-red-600 text-sm font-medium mt-1 flex items-center gap-1">
                  <ExclamationTriangleIcon className="h-4 w-4" />
                  Out of Stock
                </p>
              ) : lowStock ? (
                <p className="text-amazon-orange text-sm font-medium mt-1">
                  Only {product.stockQuantity} left in stock - order soon
                </p>
              ) : (
                <p className="text-green-600 text-sm mt-1 flex items-center gap-1">
                  <CheckIcon className="h-4 w-4" />
                  In Stock
                </p>
              )}

              {/* Unit */}
              {product.unit && (
                <p className="text-sm text-gray-500 mt-1">
                  Unit: {product.unit}
                </p>
              )}
            </div>

            {/* Price */}
            <div className="text-right">
              <p className="text-lg font-bold text-gray-900">
                ₹{itemTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              {hasDiscount && (
                <div className="flex items-center gap-2 justify-end">
                  <span className="text-sm text-gray-500 line-through">
                    ₹{(product.comparePrice * item.quantity).toLocaleString('en-IN')}
                  </span>
                  <span className="text-sm text-green-600 font-medium">
                    {discount}% off
                  </span>
                </div>
              )}
              <p className="text-xs text-gray-500 mt-1">
                ₹{product.price.toLocaleString('en-IN')} each
              </p>
            </div>
          </div>

          {/* Actions Row */}
          <div className="flex flex-wrap items-center gap-4 mt-4">
            {/* Quantity Selector */}
            {!outOfStock && (
              <div className="flex items-center">
                <span className="text-sm text-gray-600 mr-2">Qty:</span>
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden shadow-sm">
                  <button
                    onClick={() => onQuantityChange(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1 || isUpdating}
                    className="w-9 h-9 flex items-center justify-center bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <MinusIcon className="h-4 w-4" />
                  </button>
                  <span className="w-12 h-9 flex items-center justify-center bg-white font-medium text-sm border-x">
                    {isUpdating ? (
                      <div className="w-4 h-4 border-2 border-amazon-orange border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      item.quantity
                    )}
                  </span>
                  <button
                    onClick={() => onQuantityChange(item.id, item.quantity + 1)}
                    disabled={item.quantity >= product.stockQuantity || isUpdating}
                    className="w-9 h-9 flex items-center justify-center bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <PlusIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Divider */}
            <span className="hidden sm:block text-gray-300">|</span>

            {/* Delete Button */}
            <button
              onClick={() => onRemove(item.id, product.name)}
              className="text-amazon-blue hover:text-amazon-orange hover:underline text-sm font-medium flex items-center gap-1 transition-colors"
            >
              <TrashIcon className="h-4 w-4" />
              Delete
            </button>

            {/* Save for Later */}
            <span className="hidden sm:block text-gray-300">|</span>
            <button
              onClick={() => onSaveForLater(item, product)}
              className="text-amazon-blue hover:text-amazon-orange hover:underline text-sm font-medium transition-colors flex items-center gap-1"
            >
              <HeartIcon className="h-4 w-4" />
              Save for later
            </button>

            {/* Share */}
            <span className="hidden sm:block text-gray-300">|</span>
            <button
              onClick={() => onShare(product)}
              className="text-amazon-blue hover:text-amazon-orange hover:underline text-sm font-medium transition-colors flex items-center gap-1"
            >
              <ShareIcon className="h-4 w-4" />
              Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Cart() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items, isLoading, subtotal, itemCount } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [showClearModal, setShowClearModal] = useState(false);
  const [updatingItemId, setUpdatingItemId] = useState(null);
  const [isGift, setIsGift] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getCart());
    }
  }, [dispatch, isAuthenticated]);

  const handleQuantityChange = async (cartItemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setUpdatingItemId(cartItemId);
    try {
      await dispatch(updateCartItem({ cartItemId, quantity: newQuantity })).unwrap();
    } catch (err) {
      toast.error(err || 'Failed to update quantity');
    } finally {
      setUpdatingItemId(null);
    }
  };

  const handleRemoveItem = async (cartItemId, productName) => {
    try {
      await dispatch(removeFromCart(cartItemId)).unwrap();
      toast.success(`${productName} removed from cart`);
    } catch (err) {
      toast.error(err || 'Failed to remove item');
    }
  };

  const handleClearCart = async () => {
    try {
      await dispatch(clearCart()).unwrap();
      toast.success('Cart cleared');
      setShowClearModal(false);
    } catch (err) {
      toast.error(err || 'Failed to clear cart');
    }
  };

  const handleSaveForLater = async (item, product) => {
    dispatch(addToWishlist({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      comparePrice: product.comparePrice,
      primaryImage: product.image || product.primaryImage,
      category: product.category,
      avgRating: product.avgRating,
      reviewCount: product.reviewCount,
      stockQuantity: product.stockQuantity,
      unit: product.unit,
      isFeatured: product.isFeatured,
    }));
    try {
      await dispatch(removeFromCart(item.id)).unwrap();
      toast.success(`${product.name} saved to wishlist`);
    } catch (err) {
      toast.success(`${product.name} added to wishlist`);
    }
  };

  const handleShare = async (product) => {
    const url = `${window.location.origin}/products/${product.slug}`;
    const text = `Check out ${product.name} - ₹${product.price.toLocaleString('en-IN')} on GroceryShop!`;

    if (navigator.share) {
      try {
        await navigator.share({ title: product.name, text, url });
      } catch (err) {
        if (err.name !== 'AbortError') {
          await navigator.clipboard.writeText(url);
          toast.success('Link copied to clipboard!');
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        toast.success('Link copied to clipboard!');
      } catch {
        toast.error('Could not copy link');
      }
    }
  };

  // Calculate totals
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const deliveryThreshold = 499;
  const deliveryCharge = subtotal >= deliveryThreshold ? 0 : 40;
  const amountForFreeDelivery = Math.max(0, deliveryThreshold - subtotal);
  const giftPackagingCharge = isGift ? 25 : 0;
  const grandTotal = subtotal + deliveryCharge + giftPackagingCharge;

  // Check for any out of stock items
  const hasOutOfStock = items.some(item => item.product.stockQuantity === 0);
  const validItems = items.filter(item => item.product.stockQuantity > 0);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <ShoppingCartIcon className="h-20 w-20 text-gray-300 mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Your Shopping Cart</h1>
            <p className="text-gray-600 mb-8">
              Please sign in to view your cart items
            </p>
            <Link
              to="/login"
              className="inline-block px-8 py-3 bg-gradient-to-b from-yellow-300 to-yellow-400 hover:from-yellow-400 hover:to-yellow-500 text-gray-900 font-medium rounded-lg transition-all"
            >
              Sign in to your account
            </Link>
            <p className="text-sm text-gray-500 mt-4">
              New customer? <Link to="/register" className="text-amazon-blue hover:text-amazon-orange hover:underline">Start here</Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading && items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white rounded-lg p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
              </div>
              {[1, 2, 3].map((i) => (
                <CartItemSkeleton key={i} />
              ))}
            </div>
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
                <div className="h-10 bg-gray-200 rounded mb-4"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <ShoppingCartIcon className="h-20 w-20 text-gray-300 mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Your Amazon Cart is empty</h1>
            <p className="text-gray-600 mb-8">
              Your shopping cart is waiting. Give it purpose – fill it with groceries, clothes, electronics, and more.
            </p>
            <Link
              to="/products"
              className="inline-block px-8 py-3 bg-gradient-to-b from-yellow-300 to-yellow-400 hover:from-yellow-400 hover:to-yellow-500 text-gray-900 font-medium rounded-lg transition-all"
            >
              Continue Shopping
            </Link>
          </div>
          
          {/* Recommendations placeholder */}
          <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Recommended for you</h2>
            <p className="text-gray-500">Based on your browsing history</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Free Delivery Banner */}
      {amountForFreeDelivery > 0 && (
        <div className="bg-green-50 border-b border-green-200">
          <div className="max-w-7xl mx-auto px-4 py-3 text-center">
            <p className="text-sm text-green-800">
              <TruckIcon className="h-5 w-5 inline mr-2" />
              Add <strong>₹{amountForFreeDelivery.toFixed(2)}</strong> more to qualify for <strong>FREE Delivery</strong>
            </p>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items Section */}
          <div className="lg:col-span-2 space-y-4">
            {/* Cart Header */}
            <div className="bg-white rounded-lg p-6">
              <div className="flex items-center justify-between border-b pb-4">
                <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
                <button
                  onClick={() => setShowClearModal(true)}
                  className="text-amazon-blue hover:text-amazon-orange hover:underline text-sm"
                >
                  Deselect all items
                </button>
              </div>
              <div className="pt-4 text-right text-sm text-gray-600">
                Price
              </div>
            </div>

            {/* Out of Stock Warning */}
            {hasOutOfStock && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
                <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">
                    Some items in your cart are out of stock
                  </p>
                  <p className="text-sm text-yellow-700 mt-1">
                    Please remove them before proceeding to checkout.
                  </p>
                </div>
              </div>
            )}

            {/* Cart Items */}
            <div className="space-y-4">
              {items.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onQuantityChange={handleQuantityChange}
                  onRemove={handleRemoveItem}
                  onSaveForLater={handleSaveForLater}
                  onShare={handleShare}
                  isUpdating={updatingItemId === item.id}
                />
              ))}
            </div>

            {/* Subtotal at bottom */}
            <div className="bg-white rounded-lg p-6 text-right">
              <p className="text-lg">
                Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'items'}): {' '}
                <span className="font-bold text-gray-900">
                  ₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </p>
            </div>

            {/* Continue Shopping */}
            <div className="flex items-center gap-4">
              <Link
                to="/products"
                className="text-amazon-blue hover:text-amazon-orange hover:underline text-sm font-medium"
              >
                ← Continue Shopping
              </Link>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 sticky top-24 space-y-4">
              {/* Free Delivery Message */}
              {amountForFreeDelivery <= 0 && (
                <div className="flex items-start gap-2 text-green-700 bg-green-50 rounded-lg p-3">
                  <CheckCircleIcon className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">
                      Your order qualifies for FREE Delivery.
                    </p>
                    <p className="text-xs text-green-600 mt-1">
                      Choose this option at checkout.
                    </p>
                  </div>
                </div>
              )}

              {/* Subtotal */}
              <div className="text-lg">
                Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'items'}): {' '}
                <span className="font-bold">
                  ₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>

              {/* Gift Option */}
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isGift}
                  onChange={(e) => setIsGift(e.target.checked)}
                  className="rounded border-gray-300 text-amazon-orange focus:ring-amazon-orange"
                />
                <GiftIcon className="h-4 w-4" />
                This order contains a gift
              </label>
              {isGift && (
                <p className="text-xs text-gray-500 ml-6">Gift packaging charge of ₹25.00 will be added.</p>
              )}

              {/* Checkout Button */}
              <button
                onClick={() => navigate('/checkout', { state: { isGift } })}
                disabled={hasOutOfStock || validItems.length === 0}
                className="w-full py-2.5 bg-gradient-to-b from-yellow-300 to-yellow-400 hover:from-yellow-400 hover:to-yellow-500 text-gray-900 font-medium rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Proceed to checkout
              </button>

              {/* Price Breakdown */}
              <div className="border-t pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Items ({totalItems}):</span>
                  <span>₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery:</span>
                  {deliveryCharge === 0 ? (
                    <span className="text-green-600">FREE</span>
                  ) : (
                    <span>₹{deliveryCharge.toFixed(2)}</span>
                  )}
                </div>
                {isGift && (
                  <div className="flex justify-between text-gray-600">
                    <span>Gift Packaging:</span>
                    <span>₹{giftPackagingCharge.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-gray-900 text-base pt-2 border-t">
                  <span>Order Total:</span>
                  <span>₹{grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>

              {/* EMI Option */}
              <div className="border-t pt-4">
                <p className="text-sm text-amazon-blue hover:text-amazon-orange cursor-pointer">
                  EMI Available
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Your order qualifies for EMI with valid credit cards.
                </p>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="bg-white rounded-lg p-4 mt-4">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <ShieldCheckIcon className="h-5 w-5 text-gray-400" />
                <span>Safe and Secure Payments</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600 mt-2">
                <TruckIcon className="h-5 w-5 text-gray-400" />
                <span>100% Authentic Products</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Clear Cart Modal */}
      {showClearModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Clear Shopping Cart?</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to remove all {totalItems} items from your cart? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowClearModal(false)}
                className="flex-1 py-2.5 border border-gray-300 rounded-full font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleClearCart}
                className="flex-1 py-2.5 bg-red-600 text-white rounded-full font-medium hover:bg-red-700 transition-colors"
              >
                Clear Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  HeartIcon,
  TrashIcon,
  ShoppingCartIcon,
  ShoppingBagIcon,
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon, StarIcon } from '@heroicons/react/24/solid';
import { removeFromWishlist, clearWishlist } from '../store/slices/wishlistSlice';
import { addToCart } from '../store/slices/cartSlice';
import { getImageUrl } from '../utils';
import toast from 'react-hot-toast';

export default function Wishlist() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items } = useSelector((state) => state.wishlist);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const handleRemove = (productId, productName) => {
    dispatch(removeFromWishlist(productId));
    toast.success(`${productName} removed from wishlist`);
  };

  const handleAddToCart = async (product) => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }
    try {
      await dispatch(addToCart({ productId: product.id, quantity: 1 })).unwrap();
      dispatch(removeFromWishlist(product.id));
      toast.success(`${product.name} moved to cart!`);
    } catch (error) {
      toast.error(error || 'Failed to add to cart');
    }
  };

  const handleMoveAllToCart = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }
    let added = 0;
    const movedIds = [];
    for (const item of items) {
      if (item.stockQuantity > 0) {
        try {
          await dispatch(addToCart({ productId: item.id, quantity: 1 })).unwrap();
          movedIds.push(item.id);
          added++;
        } catch {
          // Skip failed items
        }
      }
    }
    movedIds.forEach((id) => dispatch(removeFromWishlist(id)));
    if (added > 0) {
      toast.success(`${added} item${added > 1 ? 's' : ''} moved to cart`);
    }
  };

  const handleClearWishlist = () => {
    dispatch(clearWishlist());
    toast.success('Wishlist cleared');
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating || 0);
    for (let i = 0; i < 5; i++) {
      stars.push(
        <StarIcon
          key={i}
          className={`h-4 w-4 ${i < fullStars ? 'text-amber-400' : 'text-gray-200'}`}
        />
      );
    }
    return stars;
  };

  return (
    <div className="min-h-screen bg-[#EAEDED]">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <nav className="flex items-center text-sm text-gray-500 mb-2">
            <Link to="/" className="hover:text-[#C45500] hover:underline">Home</Link>
            <span className="mx-2">›</span>
            <span className="text-[#C45500]">Your Wishlist</span>
          </nav>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <HeartSolidIcon className="h-7 w-7 text-red-500" />
              <h1 className="text-[28px] font-normal text-[#0F1111]">
                Your Wishlist
                {items.length > 0 && (
                  <span className="text-lg text-[#565959] ml-2">({items.length} items)</span>
                )}
              </h1>
            </div>
            {items.length > 0 && (
              <div className="flex gap-3">
                <button
                  onClick={handleMoveAllToCart}
                  className="px-4 py-2 bg-[#FFD814] hover:bg-[#F7CA00] text-[#0F1111] text-sm font-medium rounded-lg flex items-center gap-2"
                >
                  <ShoppingCartIcon className="h-4 w-4" />
                  Add All to Cart
                </button>
                <button
                  onClick={handleClearWishlist}
                  className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-[#0F1111] text-sm font-medium rounded-lg"
                >
                  Clear Wishlist
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {items.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm border">
            <div className="w-24 h-24 mx-auto bg-[#F5F5F5] rounded-full flex items-center justify-center mb-6">
              <HeartIcon className="h-12 w-12 text-gray-400" />
            </div>
            <h2 className="text-xl font-medium text-[#0F1111] mb-2">Your wishlist is empty</h2>
            <p className="text-[#565959] mb-6 max-w-md mx-auto">
              Add items you love to your wishlist. Review them anytime and easily move them to your cart.
            </p>
            <Link to="/products">
              <button className="px-6 py-3 bg-[#FFD814] hover:bg-[#F7CA00] text-[#0F1111] font-medium rounded-lg flex items-center gap-2 mx-auto">
                <ShoppingBagIcon className="h-5 w-5" />
                Continue Shopping
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((product) => {
              const discount = product.comparePrice
                ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
                : 0;

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-lg shadow-sm border overflow-hidden"
                >
                  <div className="p-4 flex gap-4">
                    {/* Product Image */}
                    <Link to={`/products/${product.slug}`} className="flex-shrink-0">
                      <img
                        src={getImageUrl(product.primaryImage || product.images?.[0]?.imageUrl, 'https://via.placeholder.com/150')}
                        alt={product.name}
                        className="w-32 h-32 object-contain rounded-lg border hover:opacity-80 transition-opacity"
                      />
                    </Link>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/products/${product.slug}`}
                        className="text-lg text-[#007185] hover:text-[#C7511F] hover:underline font-medium line-clamp-2"
                      >
                        {product.name}
                      </Link>

                      {product.category?.name && (
                        <p className="text-xs text-gray-500 mt-1 uppercase tracking-wide">
                          {product.category.name}
                        </p>
                      )}

                      {/* Rating */}
                      {product.avgRating > 0 && (
                        <div className="flex items-center gap-1 mt-1">
                          <div className="flex">{renderStars(product.avgRating)}</div>
                          <span className="text-sm text-[#007185] ml-1">
                            {product.avgRating?.toFixed(1)}
                          </span>
                          <span className="text-sm text-gray-500">
                            ({product.reviewCount || 0})
                          </span>
                        </div>
                      )}

                      {/* Price */}
                      <div className="flex items-baseline gap-2 mt-2">
                        <span className="text-xl font-bold text-[#0F1111]">
                          ₹{product.price?.toLocaleString('en-IN')}
                        </span>
                        {product.comparePrice && product.comparePrice > product.price && (
                          <>
                            <span className="text-sm text-gray-500 line-through">
                              ₹{product.comparePrice?.toLocaleString('en-IN')}
                            </span>
                            <span className="text-sm font-medium text-green-600">
                              ({discount}% off)
                            </span>
                          </>
                        )}
                      </div>

                      {/* Stock Status */}
                      {product.stockQuantity > 0 ? (
                        <p className="text-sm text-[#007600] mt-1">In Stock</p>
                      ) : (
                        <p className="text-sm text-red-600 mt-1">Out of Stock</p>
                      )}

                      {/* Added date */}
                      {product.addedAt && (
                        <p className="text-xs text-[#565959] mt-1">
                          Added on {new Date(product.addedAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={product.stockQuantity === 0}
                        className="px-4 py-2 bg-[#FFD814] hover:bg-[#F7CA00] text-[#0F1111] text-sm font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        <ShoppingCartIcon className="h-4 w-4" />
                        Add to Cart
                      </button>
                      <button
                        onClick={() => handleRemove(product.id, product.name)}
                        className="px-4 py-2 border border-gray-300 hover:bg-red-50 hover:border-red-300 text-[#0F1111] hover:text-red-600 text-sm font-medium rounded-lg flex items-center gap-2 transition-colors"
                      >
                        <TrashIcon className="h-4 w-4" />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

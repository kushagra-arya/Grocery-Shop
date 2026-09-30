import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  TrashIcon,
  StarIcon,
  EyeIcon,
  EyeSlashIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import api from '../../services/api';
import Loader from '../../components/common/Loader';
import { toast } from 'react-hot-toast';

export default function ManageReviews() {
  const [reviews, setReviews] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRating, setFilterRating] = useState('ALL');
  const [selectedProduct, setSelectedProduct] = useState('ALL');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      // Load all reviews via admin endpoint (includes hidden reviews)
      const reviewsRes = await api.get('/reviews/admin/all?limit=500');
      const allReviews = reviewsRes.data?.data?.reviews || reviewsRes.data?.reviews || [];
      setReviews(allReviews);

      // Extract unique products for filter dropdown
      const productMap = {};
      allReviews.forEach((r) => {
        if (r.productId && r.productName) {
          productMap[r.productId] = { id: r.productId, name: r.productName, slug: r.productSlug };
        }
      });
      setProducts(Object.values(productMap));
    } catch (err) {
      console.error('Failed to load reviews:', err);
      toast.error('Failed to load reviews');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await api.delete(`/reviews/${reviewId}`);
      setReviews((prev) => prev.filter((r) => r.id !== reviewId));
      setDeleteConfirm(null);
      toast.success('Review deleted successfully');
    } catch (err) {
      console.error('Failed to delete review:', err);
      toast.error('Failed to delete review');
    }
  };

  const handleToggleVisibility = async (reviewId) => {
    try {
      const response = await api.put(`/reviews/${reviewId}/visibility`);
      const updated = response.data?.data || response.data;
      setReviews((prev) =>
        prev.map((r) =>
          r.id === reviewId ? { ...r, isVisible: updated.isVisible ?? !r.isVisible } : r
        )
      );
      toast.success('Review visibility updated');
    } catch (err) {
      console.error('Failed to toggle visibility:', err);
      toast.error('Failed to update review visibility');
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star}>
            {star <= rating ? (
              <StarSolidIcon className="h-4 w-4 text-yellow-400" />
            ) : (
              <StarIcon className="h-4 w-4 text-gray-300" />
            )}
          </span>
        ))}
      </div>
    );
  };

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch =
      searchQuery === '' ||
      review.productName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.user?.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.user?.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.comment?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRating = filterRating === 'ALL' || review.rating === parseInt(filterRating);
    const matchesProduct = selectedProduct === 'ALL' || review.productId === selectedProduct;

    return matchesSearch && matchesRating && matchesProduct;
  });

  const reviewStats = {
    total: reviews.length,
    avgRating: reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : '0.0',
    fiveStars: reviews.filter((r) => r.rating === 5).length,
    oneStars: reviews.filter((r) => r.rating === 1).length,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader size="large" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <Link
        to="/admin"
        className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
      >
        <ArrowLeftIcon className="h-4 w-4 mr-1" />
        Back to Dashboard
      </Link>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Manage Reviews</h1>
        <p className="text-gray-600 mt-1">View, moderate, and delete product reviews</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-sm border p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">{reviewStats.total}</p>
          <p className="text-sm text-gray-500">Total Reviews</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4 text-center">
          <p className="text-2xl font-bold text-yellow-500">{reviewStats.avgRating} ★</p>
          <p className="text-sm text-gray-500">Average Rating</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{reviewStats.fiveStars}</p>
          <p className="text-sm text-gray-500">5-Star Reviews</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4 text-center">
          <p className="text-2xl font-bold text-red-600">{reviewStats.oneStars}</p>
          <p className="text-sm text-gray-500">1-Star Reviews</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by product, reviewer, or content..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Rating Filter */}
          <div className="flex items-center gap-2">
            <FunnelIcon className="h-5 w-5 text-gray-400" />
            <select
              value={filterRating}
              onChange={(e) => setFilterRating(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>

          {/* Product Filter */}
          <select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">All Products</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Reviews List */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="p-4 border-b bg-gray-50">
          <p className="text-sm text-gray-600">
            Showing {filteredReviews.length} of {reviews.length} reviews
          </p>
        </div>

        {filteredReviews.length === 0 ? (
          <div className="p-12 text-center">
            <StarIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No reviews found</p>
          </div>
        ) : (
          <div className="divide-y">
            {filteredReviews.map((review) => (
              <div
                key={review.id}
                className={`p-4 hover:bg-gray-50 transition-colors ${
                  review.isVisible === false ? 'opacity-60 bg-gray-50' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    {/* Product Name */}
                    <Link
                      to={`/products/${review.productSlug}`}
                      className="text-sm font-medium text-blue-600 hover:underline"
                    >
                      {review.productName}
                    </Link>

                    {/* Rating and Title */}
                    <div className="flex items-center gap-3 mt-1">
                      {renderStars(review.rating)}
                      <span className="font-semibold text-gray-900 text-sm">
                        {review.title}
                      </span>
                    </div>

                    {/* Comment */}
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{review.comment}</p>

                    {/* Meta */}
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span>
                        By{' '}
                        <span className="font-medium text-gray-700">
                          {review.user?.firstName} {review.user?.lastName}
                        </span>
                      </span>
                      <span>
                        {new Date(review.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                      {review.verifiedPurchase && (
                        <span className="text-green-600 font-medium">✓ Verified Purchase</span>
                      )}
                      {review.isVisible === false && (
                        <span className="text-red-500 font-medium">Hidden</span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleToggleVisibility(review.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        review.isVisible === false
                          ? 'text-red-500 hover:bg-red-50'
                          : 'text-gray-400 hover:bg-gray-100'
                      }`}
                      title={review.isVisible === false ? 'Show review' : 'Hide review'}
                    >
                      {review.isVisible === false ? (
                        <EyeSlashIcon className="h-5 w-5" />
                      ) : (
                        <EyeIcon className="h-5 w-5" />
                      )}
                    </button>

                    {deleteConfirm === review.id ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleDeleteReview(review.id)}
                          className="px-3 py-1 bg-red-600 text-white text-xs font-medium rounded-lg hover:bg-red-700"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="px-3 py-1 bg-gray-200 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-300"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirm(review.id)}
                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete review"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

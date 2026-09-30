import { useState, useEffect } from 'react';
import { StarIcon, CheckBadgeIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutline, XMarkIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import reviewService from '../../services/reviewService';

export default function ReviewForm({ productId, productName, onReviewSubmitted, onClose }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [canReviewInfo, setCanReviewInfo] = useState(null);
  const [isCheckingEligibility, setIsCheckingEligibility] = useState(true);

  useEffect(() => {
    checkReviewEligibility();
  }, [productId]);

  const checkReviewEligibility = async () => {
    try {
      const response = await reviewService.canReviewProduct(productId);
      setCanReviewInfo(response.data);
    } catch (err) {
      console.error('Error checking review eligibility:', err);
    } finally {
      setIsCheckingEligibility(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    setIsSubmitting(true);
    try {
      await reviewService.createReview({
        productId,
        rating,
        title: title.trim(),
        comment: comment.trim(),
      });
      
      toast.success('Review submitted successfully!');
      onReviewSubmitted?.();
      onClose?.();
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to submit review';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const ratingLabels = {
    1: 'Poor',
    2: 'Fair',
    3: 'Good',
    4: 'Very Good',
    5: 'Excellent',
  };

  // Show loading while checking eligibility
  if (isCheckingEligibility) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-8 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-amazon-orange border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Checking review eligibility...</p>
        </div>
      </div>
    );
  }

  // Show message if user already reviewed
  if (canReviewInfo && !canReviewInfo.canReview && canReviewInfo.reason === 'already_reviewed') {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg w-full max-w-md p-6 text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckBadgeIcon className="h-8 w-8 text-yellow-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Already Reviewed</h3>
          <p className="text-gray-600 mb-6">You have already submitted a review for this product.</p>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-amazon-orange text-white rounded-lg font-medium hover:bg-amazon-orange-dark"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold text-gray-900">Write a Review</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Product Info & Verified Badge */}
          <div className="text-center">
            <h3 className="font-medium text-gray-900 mb-2">{productName}</h3>
            {canReviewInfo?.verifiedPurchase ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                <CheckBadgeIcon className="h-4 w-4" />
                Verified Purchase - Your review will be marked as verified
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                Not a verified purchase
              </span>
            )}
          </div>

          {/* Star Rating */}
          <div className="text-center">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Overall Rating
            </label>
            <div className="flex items-center justify-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 transition-transform hover:scale-110"
                >
                  {(hoverRating || rating) >= star ? (
                    <StarIcon className="h-10 w-10 text-amazon-orange" />
                  ) : (
                    <StarOutline className="h-10 w-10 text-gray-300" />
                  )}
                </button>
              ))}
            </div>
            {(hoverRating || rating) > 0 && (
              <p className="mt-2 text-sm font-medium text-amazon-orange">
                {ratingLabels[hoverRating || rating]}
              </p>
            )}
          </div>

          {/* Title */}
          <div>
            <label htmlFor="review-title" className="block text-sm font-medium text-gray-700 mb-2">
              Add a headline
            </label>
            <input
              type="text"
              id="review-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What's most important to know?"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amazon-orange focus:border-amazon-orange"
              maxLength={100}
            />
          </div>

          {/* Comment */}
          <div>
            <label htmlFor="review-comment" className="block text-sm font-medium text-gray-700 mb-2">
              Add a written review
            </label>
            <textarea
              id="review-comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What did you like or dislike? What did you use this product for?"
              rows={4}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amazon-orange focus:border-amazon-orange resize-none"
              maxLength={1000}
            />
            <p className="text-xs text-gray-500 mt-1 text-right">
              {comment.length}/1000
            </p>
          </div>

          {/* Guidelines */}
          <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
            <h4 className="font-medium text-gray-900 mb-2">Review Guidelines</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Focus on the product and your experience</li>
              <li>Avoid inappropriate language</li>
              <li>Don't include personal information</li>
            </ul>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || rating === 0}
              className="flex-1 py-2.5 bg-gradient-to-b from-amazon-orange to-amazon-orange-dark text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:from-amazon-orange-dark hover:to-amazon-orange-dark transition-all"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

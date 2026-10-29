// ReviewsContainer.jsx - CLEAN VERSION
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Star } from "lucide-react";
import { DeleteReview, PostReview } from "../../store/slices/productSlice";

const ReviewsContainer = ({ product, productReviews }) => {
  const { authUser } = useSelector((state) => state.auth);
  const { isPostingReview, isReviewDeleting } = useSelector(
    (state) => state.product,
  );
  const dispatch = useDispatch();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) {
      alert("Please select a rating");
    }
    if (!comment.trim()) {
      alert("Please write a comment");
    }
    const review = {
      ratings: rating,
      comments: comment,
    };
    dispatch(PostReview({ productId: product.id, review }));
  };

  // If productReviews is undefined or empty
  const reviews = productReviews || [];

  return (
    <>
      {authUser && (
        <form className="mb-8 space-y-4" onSubmit={handleReviewSubmit}>
          <h4 className="text-lg font-semibold">Leave a Review</h4>
          <div className="flex items-center space-x-2">
            {[...Array(5)].map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setRating(i + 1)}
                className={`text-2xl ${
                  i < rating ? "text-yellow-400" : "text-gray-300"
                }`}
              >
                ☆
              </button>
            ))}
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            placeholder="Write your review..."
            className="w-full p-3 rounded-md border-border bg-background text-foreground"
          />
          <button
            className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors"
            type="submit"
            disabled={isPostingReview}
          >
            {isPostingReview ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      )}

      <h3 className="text-xl font-semibold text-foreground mb-6">
        Customer Reviews ({reviews.length})
      </h3>

      {reviews.length > 0 ? (
        <div className="space-y-6">
          {reviews.map((review) => {
            const reviewRating = parseFloat(
              review.rating || review.ratings || 0,
            );

            return (
              <div className="glass-card p-6" key={review.review_id}>
                <div className="flex items-center space-x-4">
                  <img
                    src={review.reviewer?.avatar?.url || "/avatar-holder.avif"}
                    alt={review.reviewer?.name || "Anonymous"}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-2">
                      <h4 className="font-semibold text-foreground">
                        {review.reviewer?.name || "Anonymous"}
                      </h4>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(reviewRating)
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-muted-foreground mb-2">
                      {review.comment || review.comments || ""}
                    </p>
                    {authUser?.id === review.reviewer?.id && (
                      <button
                        onClick={() =>
                          dispatch(
                            DeleteReview({
                              productId: product.id,
                              reviewId: review.review_id,
                            }),
                          )
                        }
                        disabled={isReviewDeleting}
                        className="mt-4 px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 disabled:opacity-50"
                      >
                        {isReviewDeleting ? "Deleting..." : "Delete Review"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="glass-card p-6 text-center">
          <p className="text-muted-foreground">
            No reviews yet. Be the first one to review this product!
          </p>
        </div>
      )}
    </>
  );
};

export default ReviewsContainer;

import { useState } from 'react';
import { removeReview } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import React from 'react';

const ReviewItem = ({ review, movieId, onReviewRemoved }) => {
  const { user } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleDeleteReview = async () => {
    if (!window.confirm('Are you sure you want to delete this review?')) {
      return;
    }
    
    setIsDeleting(true);
    
    try {
      await removeReview(review.movieId, review._id);
      toast.success('Review removed successfully');
      
      // Call the callback to refresh reviews
      if (onReviewRemoved) {
        onReviewRemoved();
      }
    } catch (error) {
      toast.error(error.message || 'Failed to remove review');
      console.error('Error removing review:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Generate star rating
  const renderStars = () => {
    const stars = [];
    const rating = review.rating;
    
    for (let i = 1; i <= 5; i++) {
      if (i * 2 <= rating) {
        // Full star
        stars.push(
          React.createElement('i', { 
            key: i, 
            className: "fas fa-star text-imdb-yellow text-sm" 
          })
        );
      } else if (i * 2 - 1 <= rating) {
        // Half star
        stars.push(
          React.createElement('i', { 
            key: i, 
            className: "fas fa-star-half-alt text-imdb-yellow text-sm" 
          })
        );
      } else {
        // Empty star
        stars.push(
          React.createElement('i', { 
            key: i, 
            className: "far fa-star text-gray-500 text-sm" 
          })
        );
      }
    }
    
    return React.createElement(
      'div', 
      { className: "ml-3 flex" },
      stars,
      React.createElement(
        'span', 
        { className: "ml-2 text-white font-medium" },
        `${rating}/10`
      )
    );
  };

  return React.createElement(
    'div', 
    { className: "bg-imdb-gray rounded-lg p-4" },
    React.createElement(
      'div', 
      { className: "flex justify-between items-start mb-3" },
      React.createElement(
        'div',
        null,
        React.createElement(
          'div', 
          { className: "flex items-center" },
          React.createElement('h4', { className: "text-white font-medium" }, review.username),
          renderStars()
        ),
        React.createElement(
          'p', 
          { className: "text-gray-400 text-sm" },
          `Posted on ${formatDate(review.created_at)}`
        )
      ), 
    ),
    React.createElement('p', { className: "text-gray-300" }, review.comment)
  );
};

export default ReviewItem;

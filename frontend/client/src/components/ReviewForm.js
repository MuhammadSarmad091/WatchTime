import { useState } from 'react';
import { addReview } from '../lib/api';
import { toast } from 'react-toastify';
import React from 'react';

const ReviewForm = ({ movieId, onReviewAdded }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!comment.trim()) {
      toast.error('Please add a comment to your review');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await addReview(movieId, rating, comment);
      toast.success('Review added successfully');
      setRating(5);
      setComment('');
      
      // Call the callback to refresh reviews
      if (onReviewAdded) {
        onReviewAdded();
      }
    } catch (error) {
      toast.error(error.message || 'Failed to add review');
      console.error('Error adding review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStarRating = () => {
    const stars = [];
    
    for (let i = 1; i <= 10; i++) {
      stars.push(
        React.createElement(
          'button',
          {
            key: i,
            type: "button",
            onClick: () => setRating(i),
            className: "focus:outline-none"
          },
          React.createElement('i', { 
            className: `${i <= rating ? 'fas' : 'far'} fa-star ${i <= rating ? 'text-imdb-yellow' : 'text-gray-500'}`
          })
        )
      );
    }
    
    return React.createElement(
      'div', 
      { className: "flex space-x-1" },
      stars,
      React.createElement('span', { className: "ml-2 text-white" }, `${rating}/10`)
    );
  };

  return React.createElement(
    'div', 
    { className: "bg-imdb-gray rounded-lg p-5 mt-6" },
    React.createElement('h3', { className: "text-lg font-medium text-white mb-4" }, "Add Your Review"),
    React.createElement(
      'form', 
      { onSubmit: handleSubmit },
      React.createElement(
        'div', 
        { className: "mb-4" },
        React.createElement('label', { className: "block text-white mb-2" }, "Your Rating:"),
        renderStarRating()
      ),
      React.createElement(
        'div', 
        { className: "mb-4" },
        React.createElement(
          'label', 
          { htmlFor: "comment", className: "block text-white mb-2" }, 
          "Your Review:"
        ),
        React.createElement('textarea', {
          id: "comment",
          rows: "4",
          value: comment,
          onChange: (e) => setComment(e.target.value),
          className: "w-full px-3 py-2 bg-black bg-opacity-50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-imdb-yellow",
          placeholder: "What did you think of the movie?",
          required: true
        })
      ),
      React.createElement(
        'button',
        {
          type: "submit",
          disabled: isSubmitting,
          className: `w-full py-2 px-4 rounded-lg font-bold ${isSubmitting ? 'bg-gray-500 cursor-not-allowed' : 'bg-imdb-yellow text-black hover:bg-yellow-500'} transition`
        },
        isSubmitting ? 
          React.createElement(
            'span', 
            { className: "flex items-center justify-center" },
            React.createElement('i', { className: "fas fa-spinner fa-spin mr-2" }),
            " Submitting..."
          ) 
          : 'Submit Review'
      )
    )
  );
};

export default ReviewForm;

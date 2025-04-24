// models/Review.js
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  movie_id: {
    type: Number, // TMDB movie ID
    required: true
  },
  results: [
    {
      username: {
        type: String,
        required: true
      },
      rating: {
        type: Number,
        required: true,
        min: 0,
        max: 10
      },
      comment: {
        type: String,
        required: true
      },
      created_at: {
        type: Date,
        default: Date.now
      }
    }
  ]
});

module.exports = mongoose.model('Review', reviewSchema);

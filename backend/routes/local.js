const express = require('express');

const router = express.Router();
const jwt = require('jsonwebtoken');
const authorize = require('../routes/auth');


// Import your Mongoose models
const Movie = require('../models/Movie');
const Cast = require('../models/Cast');
const Video = require('../models/Video');
const Review = require('../models/Review');
const Favourite = require('../models/Favourite');

// JWT secret from environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'abcdef';

/**
 * Helper function: getUserFromRequest
 * Extracts and verifies the JWT token from the request headers.
 * Returns the decoded user (e.g., { username, role }) if valid, or null otherwise.
 */
function getUserFromRequest(req) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      return decoded;
    } catch (err) {
      console.error('JWT verification error in helper:', err.message);
    }
  }
  return null;
}

/**
 * GET /local/movies
 * Query params: query (string; part of title), page (number), limit (number)
 * Responds with an object: { page, results, total_pages, total_results }
 */
router.get('/movies', async (req, res) => {
  try {
    const { query, page = 1, limit = 10 } = req.query;
    let filter = {};
    if (query) {
      // Case-insensitive regex for title search
      filter.title = { $regex: query, $options: 'i' };
    }

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    const totalResults = await Movie.countDocuments(filter);
    const totalPages = Math.ceil(totalResults / limitNumber);

    const movies = await Movie.find(filter)
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    res.json({
      page: pageNumber,
      results: movies,
      total_pages: totalPages,
      total_results: totalResults,
    });
  } catch (err) {
    console.error('Error getting movies:', err);
    res.status(500).json({ message: 'Error retrieving movies' });
  }
});

/**
 * GET /local/movie/:movieId
 * Retrieves a single movie from local DB along with its cast, videos, and reviews.
 * Also returns a "favourite" boolean indicating whether the movie is in the current user's favourites.
 * The returned object format is:
 * {
 *   movie: <movie document>,
 *   cast: <cast array>,
 *   videos: <videos array>,
 *   reviews: <reviews array>,
 *   favourite: <boolean>
 * }
 */
router.get('/movie/:movieId', async (req, res) => {
  try {
    const { movieId } = req.params;
    // Lookup the movie by the TMDB ID stored as "id" in our schema
    const movie = await Movie.findOne({ id: movieId });
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found in local database' });
    }

    // Retrieve associated cast and videos
    const castDoc = await Cast.findOne({ movieId: movieId });
    const cast = castDoc ? castDoc.cast : [];

    const videoDoc = await Video.findOne({ movieId: movieId });
    const videos = videoDoc ? videoDoc.results : [];

    // Retrieve reviews (if exist)
    const reviewDoc = await Review.findOne({ movie_id: movieId });
    const reviews = reviewDoc ? reviewDoc.results : [];

    const currentUser = getUserFromRequest(req);
    let favourite = false;
    if (currentUser) {
      const favDoc = await Favourite.findOne({ username: currentUser.username, movie_id: movie.id });
      if (favDoc) {
        favourite = true;
      }
    }

    res.json({
      movie,
      cast,
      videos,
      reviews,
      favourite,
    });
  } catch (err) {
    console.error('Error fetching movie details:', err);
    res.status(500).json({ message: 'Error retrieving movie details' });
  }
});

/**
 * POST /local/toggleFavourite
 * Toggles a movie in the current user's favourite list.
 * Request body: { movieId: <TMDB movie id> }
 * Requires a logged in user (role 'user').
 */
router.post('/toggleFavourite', authorize('user'), async (req, res) => {
    try {
      const { movieId } = req.body;
      if (!movieId) {
        return res.status(400).json({ message: 'movieId is required' });
      }
      // Current user information is available from the auth middleware in req.user
      const username = req.user.username;
      
      // Check if this movie is already in the user's favourites
      const favDoc = await Favourite.findOne({ username, movie_id: movieId });
      
      if (favDoc) {
        // Remove the favourite if it exists
        await Favourite.deleteOne({ _id: favDoc._id });
        return res.json({ message: 'Movie removed from favourites' });
      } else {
        // Add a new favourite entry
        const newFavourite = new Favourite({
          username,
          movie_id: movieId
        });
        await newFavourite.save();
        return res.json({ message: 'Movie added to favourites' });
      }
    } catch (err) {
      console.error('Error toggling favourite:', err);
      res.status(500).json({ message: 'Error toggling favourite' });
    }
  });
  
  /**
   * POST /local/addReview
   * Adds a review for a movie from the current user, if one doesn't already exist.
   * Request body should include:
   *   - movieId: TMDB movie id
   *   - rating: Number (e.g., 0-10)
   *   - comment: String
   * Requires a logged in user (role 'user').
   */
  router.post('/addReview', authorize('user'), async (req, res) => {
    try {
      const { movieId, rating, comment } = req.body;
      if (!movieId || rating === undefined || !comment) {
        return res.status(400).json({ message: 'movieId, rating, and comment are required' });
      }
      
      const username = req.user.username;
      
      // Find the review document for this movie (if it exists)
      let reviewDoc = await Review.findOne({ movie_id: movieId });
      
      // Check if the current user has already added a review
      if (reviewDoc && reviewDoc.results.some(r => r.username === username)) {
        return res.status(400).json({ message: 'You have already reviewed this movie' });
      }
      
      const newReview = { username, rating, comment };
      
      if (reviewDoc) {
        // If exists, push the new review into the results array
        reviewDoc.results.push(newReview);
        await reviewDoc.save();
      } else {
        // Otherwise, create a new document for reviews on this movie
        reviewDoc = new Review({
          movie_id: movieId,
          results: [newReview]
        });
        await reviewDoc.save();
      }
      
      return res.json({ message: 'Review added successfully', review: newReview });
    } catch (err) {
      console.error('Error adding review:', err);
      res.status(500).json({ message: 'Error adding review' });
    }
  });
  
  /**
   * DELETE /local/removeReview
   * Removes a review for a movie.
   * Request body should include:
   *   - movieId: TMDB movie id
   *   - reviewId: the _id of the review subdocument to remove
   * Requires admin privileges.
   */
  router.delete('/removeReview', authorize('admin'), async (req, res) => {
    try {
      const { movieId, reviewId } = req.body;
      if (!movieId || !reviewId) {
        return res.status(400).json({ message: 'movieId and reviewId are required' });
      }
      
      // Remove the review from the review document using MongoDB's $pull operator
      const result = await Review.updateOne(
        { movie_id: movieId },
        { $pull: { results: { _id: reviewId } } }
      );
      
      if (result.modifiedCount === 0) {
        return res.status(404).json({ message: 'Review not found or already removed' });
      }
      
      return res.json({ message: 'Review removed successfully' });
    } catch (err) {
      console.error('Error removing review:', err);
      res.status(500).json({ message: 'Error removing review' });
    }
  });

module.exports = router;

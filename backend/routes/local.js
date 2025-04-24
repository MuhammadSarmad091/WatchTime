const express = require('express');
const dotenv = require('dotenv');
const router = express.Router();
dotenv.config()
const jwt = require('jsonwebtoken');
const authorize = require('../routes/auth');


// Import your Mongoose models
const Movie = require('../models/Movie');
const Cast = require('../models/Cast');
const Video = require('../models/Video');
const Review = require('../models/Review');
const Favourite = require('../models/Favourite');
const User = require('../models/User')

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

router.get('/getMainPage', async (req, res) => {
  try {
    // Define an array of typical genres you want to show on the main page
    const genresList = ["Action", "Comedy", "Drama", "Adventure", "Horror"];

    // Use Promise.all to run all queries in parallel
    const mainPageData = await Promise.all(
      genresList.map(async (genre) => {
        // Query for movies that include a genre with a matching name.
        // This assumes each movie document has a `genres` array with objects like { id, name }.
        const movies = await Movie.find({ "genres.name": genre }).limit(5);
        return { genre, movies };
      })
    );

    // Return the categorized movies array
    res.json(mainPageData);
  } catch (err) {
    console.error("Error fetching main page movies:", err);
    res.status(500).json({ message: "Error retrieving main page movies", error: err.message });
  }
});

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

    const username = req.user.username;

    const favDoc = await Favourite.findOne({ username, movie_id: movieId });

    if (favDoc) {
      await Favourite.deleteOne({ _id: favDoc._id });
      return res.json({
        message: 'Movie removed from favourites',
        favourited: false,
      });
    } else {
      const newFavourite = new Favourite({
        username,
        movie_id: movieId,
      });
      await newFavourite.save();
      return res.json({
        message: 'Movie added to favourites',
        favourited: true,
      });
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

  /**
 * DELETE /admin/removeMovie
 * Removes a movie and its related data (cast, videos, reviews) from the local database, 
 * and also deletes any favourites referencing that movie.
 * Request body: { movieId: <TMDB movie id> }
 * Returns a response with a message and details of deletion.
 */
router.delete('/removeMovie', authorize('admin'), async (req, res) => {
  try {
    const { movieId } = req.body;
    if (!movieId) {
      return res.status(400).json({ message: 'movieId is required' });
    }

    // Remove the movie document (assuming TMDB movie id is stored in 'id')
    const movieDel = await Movie.deleteOne({ id: movieId });
    // Remove the cast document
    const castDel = await Cast.deleteOne({ movieId: movieId });
    // Remove the video document
    const videoDel = await Video.deleteOne({ movieId: movieId });
    // Remove the review document
    const reviewDel = await Review.deleteOne({ movie_id: movieId });
    // Remove the favourite documents (there can be more than one if multiple users added it)
    const favDel = await Favourite.deleteMany({ movie_id: movieId });

    return res.json({
      message: 'Movie and related data removed successfully',
      details: { movieDel, castDel, videoDel, reviewDel, favDel }
    });
  } catch (err) {
    console.error('Error removing movie:', err);
    res.status(500).json({ message: 'Error removing movie', error: err.message });
  }
});

/**
 * GET /admin/getUsers
 * Retrieves a list of all registered users in the database.
 * Returns all user info so that the UI can display/manage users.
 */
router.get('/getUsers', authorize('admin'), async (req, res) => {
  try {
    const users = await User.find();
    return res.json({ message: 'Users retrieved successfully', users });
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Error fetching users', error: err.message });
  }
});

/**
 * POST /admin/toggleBlockUser
 * Toggles the block status of a specific user.
 * Request body: { username: <username> }
 * If the user is currently 'active', it will be changed to 'blocked', and vice versa.
 * Returns the updated user document and a message to allow the UI to update accordingly.
 */
router.post('/toggleBlockUser', authorize('admin'), async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) {
      return res.status(400).json({ message: 'Username is required' });
    }
    
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Toggle status between 'active' and 'blocked'
    user.status = user.status === 'active' ? 'blocked' : 'active';
    await user.save();
    
    return res.json({ 
      message: `User status updated to ${user.status}`, 
      user 
    });
  } catch (err) {
    console.error('Error toggling user block status:', err);
    res.status(500).json({ message: 'Error toggling user status', error: err.message });
  }
});



module.exports = router;

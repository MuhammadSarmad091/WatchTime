const express = require('express');
const axios = require('axios');
const router = express.Router();
const authorize = require('./auth');

const Movie = require('../models/Movie');
const Cast = require('../models/Cast');
const Video = require('../models/Video');

// Load TMDB API key and Base URL from env or fallback
const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = process.env.TMDB_BASE_URL;


router.get('/search', authorize('admin') ,async (req, res) => {
  try {
    const { query, page = 1 } = req.query;
    if (!query) {
      return res.status(400).json({ message: 'Query parameter is required' });
    }

    // Call TMDB search endpoint
    const response = await axios.get(`${TMDB_BASE_URL}/search/movie`, {
      params: {
        api_key: TMDB_API_KEY,
        query,
        page,
      },
    });

    // Return TMDB's response (which includes page, results, total_pages, total_results)
    res.json(response.data);
  } catch (error) {
    console.error('TMDB search error:', error.message);
    res.status(500).json({ message: 'Failed to search TMDB' });
  }
});


router.post('/addMovie',  authorize('admin') , async (req, res) => {
  try {
    const { movieId } = req.body;
    if (!movieId) {
      return res.status(400).json({ message: 'movieId is required in request body' });
    }

    const existingMovie = await Movie.findOne({ id: movieId });
    if (existingMovie) {
      return res.status(400).json({ message: 'Movie already exists in local database' });
    }

    const movieResponse = await axios.get(`${TMDB_BASE_URL}/movie/${movieId}`, {
      params: { api_key: TMDB_API_KEY },
    });
    const movieData = movieResponse.data;

    const newMovie = new Movie({
      adult: movieData.adult,
      backdrop_path: movieData.backdrop_path,
      budget: movieData.budget,
      genres: movieData.genres,
      homepage: movieData.homepage,
      id: movieData.id, // TMDB movie ID
      imdb_id: movieData.imdb_id,
      origin_country: movieData.origin_country,
      original_language: movieData.original_language,
      original_title: movieData.original_title,
      overview: movieData.overview,
      popularity: movieData.popularity,
      poster_path: movieData.poster_path,
      production_companies: movieData.production_companies,
      production_countries: movieData.production_countries,
      release_date: movieData.release_date,
      revenue: movieData.revenue,
      runtime: movieData.runtime,
      spoken_languages: movieData.spoken_languages,
      status: movieData.status,
      tagline: movieData.tagline,
      title: movieData.title,
      video: movieData.video,
      vote_average: movieData.vote_average,
      vote_count: movieData.vote_count
    });
    const savedMovie = await newMovie.save();

    // Fetch cast info and keep only the first 10 records
    const castResponse = await axios.get(`${TMDB_BASE_URL}/movie/${movieId}/credits`, {
      params: { api_key: TMDB_API_KEY },
    });
    const castData = castResponse.data;
    const trimmedCast = (castData.cast || []).slice(0, 10);

    const newCast = new Cast({
      id: movieData.id,
      cast: trimmedCast
    });
    const savedCast = await newCast.save();

     const videoResponse = await axios.get(`${TMDB_BASE_URL}/movie/${movieId}/videos`, {
      params: { api_key: TMDB_API_KEY }
    });
    let videos = (videoResponse.data.results || []).filter(video => video.site === 'YouTube');

    let selectedVideos = [];
    const trailerIndex = videos.findIndex(
      video => video.type === 'Trailer' && video.official === true
    );

    if (trailerIndex !== -1) {
      const trailer = videos.splice(trailerIndex, 1)[0];
      selectedVideos.push(trailer);
    }
    selectedVideos = selectedVideos.concat(videos.slice(0, 5 - selectedVideos.length));
    selectedVideos = selectedVideos.slice(0, 5);

    const newVideo = new Video({
      id: movieData.id,
      results: selectedVideos
    });
    const savedVideo = await newVideo.save();

    console.log(savedVideo)


    res.status(200).json({
      message: 'Movie added successfully',
      movie: savedMovie,
      cast: savedCast,
      video: savedVideo,
    });
  } catch (error) {
    console.error('Error in adding movie:', error.message);
    res.status(500).json({ message: 'Failed to add movie to local database' });
  }
});

router.get('/openMovie/:movieId',authorize('admin'), async (req, res) => {
  try {
    const { movieId } = req.params;
    const movieResponse = await axios.get(`${TMDB_BASE_URL}/movie/${movieId}`, {
      params: { api_key: TMDB_API_KEY }
    });
    const movieData = movieResponse.data;

    const castResponse = await axios.get(`${TMDB_BASE_URL}/movie/${movieId}/credits`, {
      params: { api_key: TMDB_API_KEY }
    });
    const castData = (castResponse.data.cast || []).slice(0, 10);

    const videoResponse = await axios.get(`${TMDB_BASE_URL}/movie/${movieId}/videos`, {
      params: { api_key: TMDB_API_KEY }
    });
    let videos = (videoResponse.data.results || []).filter(video => video.site === 'YouTube');

    let selectedVideos = [];
    const trailerIndex = videos.findIndex(
      video => video.type === 'Trailer' && video.official === true
    );
    if (trailerIndex !== -1) {
      const trailer = videos.splice(trailerIndex, 1)[0];
      selectedVideos.push(trailer);
    }
    selectedVideos = selectedVideos.concat(videos.slice(0, 5 - selectedVideos.length));
    selectedVideos = selectedVideos.slice(0, 5);

    const responseObj = {
      movie: movieData,
      cast: castData,
      videos: selectedVideos
    };

    res.status(200).json(responseObj);

  } catch (error) {
    console.error('Error fetching movie data:', error.message);
    res.status(500).json({ message: 'Failed to fetch movie data from TMDB' });
  }
});

module.exports = router;

import { useState, useEffect } from 'react';
import { useRoute } from 'wouter';
import { getMovieDetails, toggleFavorite } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CastList from '../components/CastList';
import ReviewItem from '../components/ReviewItem';
import ReviewForm from '../components/ReviewForm';
import React from 'react';

const MovieDetailsPage = () => {
  const [, params] = useRoute('/movie/:id');
  const movieId = params?.id;
  
  const [movieDetails, setMovieDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);
  const [trailerKey, setTrailerKey] = useState('');
  
  const { user } = useAuth();
  
  // TMDB image URL base
  const TMDB_IMG_BASE = "https://image.tmdb.org/t/p/w500";

  useEffect(() => {
    const fetchMovieDetails = async () => {
      if (!movieId) return;
      
      setLoading(true);
      try {
        const data = await getMovieDetails(movieId);
        setMovieDetails(data);
        setIsFavorite(data.favourite);
        
        // Find trailer video if exists
        const trailer = data.videos.find(
          video => video.type === 'Trailer' && video.site === 'YouTube'
        );
        if (trailer) {
          setTrailerKey(trailer.key);
        }
      } catch (err) {
        console.error('Error fetching movie details:', err);
        setError(err.message || 'Failed to load movie details');
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [movieId]);

  const handleToggleFavorite = async () => {
    if (!user) {
      toast.error('Please log in to add movies to favorites');
      return;
    }
    
    try {
      const response = await toggleFavorite(movieId);
      setIsFavorite(response.favourited);
      
      toast.success(response.message);
    } catch (err) {
      console.error('Error toggling favorite:', err);
      toast.error(err.message || 'Failed to update favorites');
    }
  };

  const handleWatchTrailer = () => {
    if (trailerKey) {
      setShowTrailer(true);
    } else {
      toast.info('No trailer available for this movie');
    }
  };

  const refreshMovieDetails = async () => {
    try {
      const data = await getMovieDetails(movieId);
      setMovieDetails(data);
    } catch (err) {
      console.error('Error refreshing movie details:', err);
    }
  };

  if (loading) {
    return React.createElement(
      'div', 
      { className: "min-h-screen flex flex-col bg-imdb-dark" },
      React.createElement(Navbar, null),
      React.createElement(
        'main', 
        { className: "flex-grow flex justify-center items-center" },
        React.createElement('div', { 
          className: "animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-imdb-yellow" 
        })
      ),
      React.createElement(Footer, null)
    );
  }

  if (error || !movieDetails) {
    return React.createElement(
      'div', 
      { className: "min-h-screen flex flex-col bg-imdb-dark" },
      React.createElement(Navbar, null),
      React.createElement(
        'main', 
        { className: "flex-grow flex justify-center items-center" },
        React.createElement(
          'div', 
          { className: "text-center py-10" },
          React.createElement(
            'div', 
            { className: "text-red-500 mb-4" },
            React.createElement('i', { className: "fas fa-exclamation-circle text-4xl" })
          ),
          React.createElement(
            'h2', 
            { className: "text-2xl font-bold text-white mb-2" },
            "Error Loading Movie"
          ),
          React.createElement(
            'p', 
            { className: "text-gray-400 mb-6" },
            error || 'Movie not found'
          ),
          React.createElement(
            'button',
            {
              onClick: () => window.history.back(),
              className: "px-6 py-3 bg-imdb-yellow text-black font-bold rounded-lg hover:bg-yellow-400 transition"
            },
            "Go Back"
          )
        )
      ),
      React.createElement(Footer, null)
    );
  }

  const { movie, cast, videos, reviews } = movieDetails;

  // Format runtime to hours and minutes
  const formatRuntime = (minutes) => {
    if (!minutes) return 'Unknown duration';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours > 0 ? `${hours}h` : ''} ${mins > 0 ? `${mins}min` : ''}`;
  };

  // Get release year
  const releaseYear = movie.release_date ? movie.release_date.substring(0, 4) : '';

  // Format genres as a string
  const genresString = movie.genres ? movie.genres.map(genre => genre.name).join(', ') : '';

  return React.createElement(
    'div', 
    { className: "min-h-screen flex flex-col bg-imdb-dark" },
    React.createElement(Navbar, null),
    
    React.createElement(
      'main', 
      { className: "flex-grow" },
      React.createElement(
        'section', 
        { className: "py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" },
        // Movie Header
        React.createElement(
          'div', 
          { className: "flex flex-col md:flex-row" },
          // Movie Poster
          React.createElement(
            'div', 
            { className: "md:w-1/3 lg:w-1/4 flex-shrink-0" },
            React.createElement('img', {
              src: movie.poster_path 
                ? `${TMDB_IMG_BASE}${movie.poster_path}` 
                : 'https://via.placeholder.com/500x750?text=No+Poster',
              alt: `${movie.title} poster`,
              className: "w-full h-auto rounded-lg shadow-lg"
            }),
            React.createElement(
              'div', 
              { className: "mt-4 flex flex-col space-y-3" },
              React.createElement(
                'button',
                {
                  onClick: handleToggleFavorite,
                  className: `${isFavorite 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-imdb-yellow hover:bg-yellow-500'} 
                    text-black font-bold py-2 px-4 rounded-lg w-full flex justify-center items-center transition`
                },
                React.createElement('i', { 
                  className: `${isFavorite ? 'fas' : 'far'} fa-heart mr-2` 
                }),
                isFavorite ? 'Remove from Favorites' : 'Add to Favorites'
              ),
              trailerKey && React.createElement(
                'button',
                {
                  onClick: handleWatchTrailer,
                  className: "bg-imdb-gray text-white font-bold py-2 px-4 rounded-lg w-full flex justify-center items-center hover:bg-gray-700 transition"
                },
                React.createElement('i', { className: "fas fa-play mr-2" }),
                " Watch Trailer"
              )
            )
          ),
          
          // Movie Info
          React.createElement(
            'div', 
            { className: "md:w-2/3 lg:w-3/4 md:pl-8 mt-6 md:mt-0" },
            React.createElement(
              'div', 
              { className: "flex flex-col sm:flex-row sm:items-center justify-between mb-4" },
              React.createElement(
                'h1', 
                { className: "text-3xl md:text-4xl font-bold font-heading text-white" },
                movie.title
              ),
              React.createElement(
                'div', 
                { className: "flex items-center mt-2 sm:mt-0" },
                movie.adult && React.createElement(
                  'div', 
                  { className: "bg-red-600 text-white font-bold py-1 px-2 rounded text-sm mr-2" },
                  "R"
                ),
                React.createElement(
                  'div', 
                  { className: "flex items-center" },
                  React.createElement('i', { className: "fas fa-star text-imdb-yellow mr-1" }),
                  React.createElement('span', { className: "font-bold" }, movie.vote_average.toFixed(1)),
                  React.createElement('span', { className: "text-gray-400 ml-1" }, "/10")
                )
              )
            ),
            
            React.createElement(
              'div', 
              { className: "flex flex-wrap text-sm text-gray-400 mb-4" },
              React.createElement('span', null, releaseYear),
              movie.runtime && [
                React.createElement('span', { className: "mx-2", key: "dot1" }, "•"),
                React.createElement('span', { key: "runtime" }, formatRuntime(movie.runtime))
              ],
              genresString && [
                React.createElement('span', { className: "mx-2", key: "dot2" }, "•"),
                React.createElement('span', { key: "genres" }, genresString)
              ]
            ),
            
            React.createElement(
              'div', 
              { className: "mb-6" },
              React.createElement('h2', { className: "text-xl font-semibold text-white mb-2" }, 'Overview'),
              React.createElement('p', { className: "text-gray-300" }, movie.overview)
            ),
            
            // Cast List
            React.createElement(
              'div', 
              { className: "mb-6" },
              React.createElement('h2', { className: "text-xl font-semibold text-white mb-2" }, 'Cast'),
              React.createElement(CastList, { cast: cast })
            ),
            
            // Trailer Section
trailerKey && React.createElement(
  'div',
  { className: "mt-8" },
  React.createElement(
    'h2',
    { className: "text-xl font-semibold text-white mb-4" },
    "Trailer"
  ),
  React.createElement(
    'div',
    { className: "aspect-w-16 aspect-h-9" },
    React.createElement('iframe', {
      className: "w-full h-72 md:h-96 rounded-lg shadow-lg",
      src: `https://www.youtube.com/embed/${trailerKey}`,
      title: "Movie Trailer",
      allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
      allowFullScreen: true
    })
  )
),

            
            // Reviews Section
            React.createElement(
              'div', 
              { className: "mb-6" },
              React.createElement('h2', { className: "text-xl font-semibold text-white mb-2" }, 'Reviews'),
              reviews?.length ? 
                reviews.map((review, index) => React.createElement(ReviewItem, { key: index, review })) :
                React.createElement('p', { className: "text-gray-400" }, "No reviews available")
            ),
            
            // Review Form
            React.createElement(ReviewForm, { movieId: movieId, refreshMovieDetails: refreshMovieDetails })
          )
        )
      )
    ),
    
    React.createElement(Footer, null)
  );
};

export default MovieDetailsPage;

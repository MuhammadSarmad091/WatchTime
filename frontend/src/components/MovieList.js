import { useState, useEffect } from 'react';
import MovieCard from './MovieCard';
import { getMovies } from '../lib/api';
import React from 'react';

const MovieList = ({ query, genreFilter }) => {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const data = await getMovies(query, page);
        setMovies(data.results);
        setTotalPages(data.total_pages);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching movies:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [query, page, genreFilter]);

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
      window.scrollTo(0, 0);
    }
  };

  // Filter movies by genre if genreFilter is provided
  const filteredMovies = genreFilter 
    ? movies.filter(movie => 
        movie.genres && movie.genres.some(genre => 
          genre.name.toLowerCase() === genreFilter.toLowerCase()
        )
      )
    : movies;

  if (loading) {
    return React.createElement(
      'div', 
      { className: "flex justify-center items-center h-64" },
      React.createElement('div', { className: "animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-imdb-yellow" })
    );
  }

  if (error) {
    return React.createElement(
      'div', 
      { className: "text-center py-10" },
      React.createElement(
        'div', 
        { className: "text-red-500 mb-4" },
        React.createElement('i', { className: "fas fa-exclamation-circle text-2xl" })
      ),
      React.createElement(
        'h3', 
        { className: "text-xl font-medium text-white mb-2" }, 
        "Error Loading Movies"
      ),
      React.createElement('p', { className: "text-gray-400" }, error)
    );
  }

  if (filteredMovies.length === 0) {
    return React.createElement(
      'div', 
      { className: "text-center py-10" },
      React.createElement(
        'div', 
        { className: "text-gray-500 mb-4" },
        React.createElement('i', { className: "fas fa-film text-2xl" })
      ),
      React.createElement(
        'h3', 
        { className: "text-xl font-medium text-white mb-2" }, 
        "No Movies Found"
      ),
      React.createElement('p', { className: "text-gray-400" }, "Try adjusting your search criteria")
    );
  }

  return React.createElement(
    'div',
    null,
    React.createElement(
      'div', 
      { className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4" },
      filteredMovies.map(movie => 
        React.createElement(MovieCard, { key: movie.id, movie: movie })
      )
    ),
    
    // Pagination
    totalPages > 1 && React.createElement(
      'div', 
      { className: "flex justify-between items-center mt-8" },
      React.createElement(
        'button', 
        {
          onClick: handlePrevPage,
          disabled: page === 1,
          className: `px-4 py-2 rounded-lg ${page === 1 ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-imdb-gray text-white hover:bg-gray-700'}`
        },
        React.createElement('i', { className: "fas fa-chevron-left mr-2" }),
        " Previous"
      ),
      React.createElement(
        'span', 
        { className: "text-white" },
        `Page ${page} of ${totalPages}`
      ),
      React.createElement(
        'button', 
        {
          onClick: handleNextPage,
          disabled: page === totalPages,
          className: `px-4 py-2 rounded-lg ${page === totalPages ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-imdb-gray text-white hover:bg-gray-700'}`
        },
        "Next ",
        React.createElement('i', { className: "fas fa-chevron-right ml-2" })
      )
    )
  );
};

export default MovieList;

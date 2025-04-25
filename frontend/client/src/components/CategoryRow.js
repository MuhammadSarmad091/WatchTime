import { Link } from 'wouter';
import MovieCard from './MovieCard';
import React from 'react';

const CategoryRow = ({ title, movies, genreName }) => {
  if (!movies || movies.length === 0) {
    return null;
  }
  
  // Create a URL-friendly genre name
  const genreParam = genreName.toLowerCase().replace(/\s+/g, '-');

  return React.createElement(
    'section', 
    { className: "py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" },
    React.createElement(
      'div', 
      { className: "flex justify-between items-center mb-6" },
      React.createElement(
        'h2', 
        { className: "text-2xl font-heading font-bold text-white" }, 
        title
      ),
      React.createElement(
        Link,
        {
          href: `/movies?genre=${genreParam}`,
          className: "text-imdb-yellow hover:text-yellow-400 font-medium flex items-center"
        },
        "See all ",
        React.createElement('i', { className: "fas fa-chevron-right ml-1 text-sm" })
      )
    ),
    
    React.createElement(
      'div', 
      { className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4" },
      movies.map(movie => 
        React.createElement(MovieCard, { key: movie.id, movie: movie })
      )
    )
  );
};

export default CategoryRow;

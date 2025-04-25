import { Link } from 'wouter';
import React from 'react';

const MovieCard = ({ movie }) => {
  // Format release year from release_date
  const releaseYear = movie.release_date ? movie.release_date.substring(0, 4) : '';
  
  // Construct genres string
  const genreNames = movie.genres ? movie.genres.map(genre => genre.name).join(', ') : '';

  // TMDB image URL base
  const imgBaseUrl = "https://image.tmdb.org/t/p/w500";

  return React.createElement(
    Link, 
    { href: `/movie/${movie.id}` },
    React.createElement(
      'div', 
      { className: "movie-card bg-imdb-gray rounded-lg overflow-hidden shadow-lg cursor-pointer h-full flex flex-col" },
      React.createElement(
        'div', 
        { className: "relative" },
        React.createElement('img', {
          src: movie.poster_path ? `${imgBaseUrl}${movie.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Image',
          alt: `${movie.title} poster`,
          className: "w-full h-64 object-cover",
          loading: "lazy"
        }),
        movie.vote_average && React.createElement(
          'div', 
          { className: "absolute top-2 right-2 bg-black bg-opacity-70 rounded-full p-1 px-2 text-xs font-medium flex items-center" },
          React.createElement('i', { className: "fas fa-star text-imdb-yellow mr-1" }),
          movie.vote_average.toFixed(1)
        )
      ),
      React.createElement(
        'div', 
        { className: "p-4 flex flex-col flex-grow" },
        React.createElement(
          'h3', 
          { className: "font-medium text-white truncate", title: movie.title },
          movie.title
        ),
        React.createElement(
          'p', 
          { className: "text-gray-400 text-sm mt-1" },
          releaseYear,
          genreNames && ' • ',
          genreNames
        )
      )
    )
  );
};

export default MovieCard;

import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MovieList from '../components/MovieList';
import React from 'react';

const MoviesPage = () => {
  const [location] = useLocation();
  const [searchParams, setSearchParams] = useState({ query: '', genre: '' });
  const [searchInput, setSearchInput] = useState('');

  // Parse URL search parameters
  useEffect(() => {
    const url = new URL(window.location.href);
    const query = url.searchParams.get('query') || '';
    const genre = url.searchParams.get('genre') || '';
    
    setSearchParams({ query, genre });
    setSearchInput(query);
  }, [location]);

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    
    // Update URL with search parameter
    const url = new URL(window.location.href);
    
    if (searchInput.trim()) {
      url.searchParams.set('query', searchInput.trim());
    } else {
      url.searchParams.delete('query');
    }
    
    // Remove genre filter when searching
    url.searchParams.delete('genre');
    
    window.history.pushState({}, '', url.toString());
    
    // Update local state
    setSearchParams({ 
      query: searchInput.trim(), 
      genre: '' 
    });
  };

  const clearFilters = () => {
    setSearchInput('');
    setSearchParams({ query: '', genre: '' });
    
    // Update URL
    const url = new URL(window.location.href);
    url.searchParams.delete('query');
    url.searchParams.delete('genre');
    window.history.pushState({}, '', url.toString());
  };

  // Format genre name for display
  const formatGenreName = (genre) => {
    if (!genre) return '';
    return genre
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return React.createElement(
    'div', 
    { className: "min-h-screen flex flex-col bg-imdb-dark" },
    React.createElement(Navbar, null),
    
    React.createElement(
      'main', 
      { className: "flex-grow" },
      React.createElement(
        'div', 
        { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" },
        React.createElement(
          'div', 
          { className: "flex flex-col md:flex-row justify-between items-start md:items-center mb-8" },
          React.createElement(
            'h1', 
            { className: "text-3xl font-bold text-white mb-4 md:mb-0" },
            searchParams.genre 
              ? `${formatGenreName(searchParams.genre)} Movies` 
              : searchParams.query 
                ? `Search Results: "${searchParams.query}"` 
                : 'All Movies'
          ),
          
          React.createElement(
            'form', 
            { 
              onSubmit: handleSearchSubmit, 
              className: "w-full md:w-auto flex" 
            },
            React.createElement('input', {
              type: "text",
              placeholder: "Search movies...",
              className: "flex-grow md:w-64 px-4 py-2 rounded-l-lg bg-black bg-opacity-50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-imdb-yellow",
              value: searchInput,
              onChange: handleSearchChange
            }),
            React.createElement(
              'button', 
              {
                type: "submit",
                className: "px-4 py-2 bg-imdb-yellow text-black font-medium rounded-r-lg hover:bg-yellow-400 transition"
              },
              React.createElement('i', { className: "fas fa-search" })
            )
          )
        ),
        
        // Active filters
        (searchParams.query || searchParams.genre) && 
          React.createElement(
            'div', 
            { className: "mb-6 flex items-center" },
            React.createElement('span', { className: "text-gray-400 mr-2" }, "Active filters:"),
            React.createElement(
              'div', 
              { className: "flex flex-wrap gap-2" },
              searchParams.query && 
                React.createElement(
                  'span', 
                  { className: "bg-imdb-gray px-3 py-1 rounded-full text-sm text-white flex items-center" },
                  `Search: ${searchParams.query}`
                ),
              searchParams.genre && 
                React.createElement(
                  'span', 
                  { className: "bg-imdb-gray px-3 py-1 rounded-full text-sm text-white flex items-center" },
                  `Genre: ${formatGenreName(searchParams.genre)}`
                ),
              React.createElement(
                'button', 
                {
                  onClick: clearFilters,
                  className: "bg-red-600 hover:bg-red-700 px-3 py-1 rounded-full text-sm text-white flex items-center"
                },
                React.createElement('i', { className: "fas fa-times mr-1" }),
                " Clear"
              )
            )
          ),
        
        React.createElement(MovieList, {
          query: searchParams.query,
          genreFilter: formatGenreName(searchParams.genre)
        })
      )
    ),
    
    React.createElement(Footer, null)
  );
};

export default MoviesPage;

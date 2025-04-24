import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { getMainPage } from '../lib/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CategoryRow from '../components/CategoryRow';
import React from 'react';

const HomePage = () => {
  const [mainPageData, setMainPageData] = useState({
    featured: [],
    trending: [],
    topRated: [],
    categories: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [, setLocation] = useLocation();

  useEffect(() => {
    const fetchMainPageMovies = async () => {
      try {
        const data = await getMainPage();
        setMainPageData(data || {
          featured: [],
          trending: [],
          topRated: [],
          categories: []
        });
      } catch (err) {
        console.error('Error fetching main page data:', err);
        setError('Failed to load movies. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMainPageMovies();
  }, []);

  const handleSearchInput = (e) => {
    setSearchInput(e.target.value);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setLocation(`/movies?query=${encodeURIComponent(searchInput.trim())}`);
    }
  };

  return React.createElement(
    'div', 
    { className: "min-h-screen flex flex-col bg-imdb-dark" },
    React.createElement(Navbar, null),
    React.createElement(
      'main', 
      { className: "flex-grow" },
      // Hero Section
      React.createElement(
        'section', 
        { className: "relative" },
        React.createElement(
          'div', 
          { className: "w-full h-96 md:h-[500px] overflow-hidden relative" },
          React.createElement('img', {
            src: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
            alt: "Movie backdrop",
            className: "w-full h-full object-cover object-center"
          }),
          React.createElement('div', { 
            className: "absolute inset-0 bg-gradient-to-t from-imdb-dark to-transparent" 
          }),
          React.createElement('div', { 
            className: "absolute inset-0 bg-gradient-to-r from-imdb-dark to-transparent opacity-60" 
          }),
          React.createElement(
            'div', 
            { className: "absolute bottom-0 left-0 p-6 md:p-12 max-w-3xl" },
            React.createElement(
              'h1', 
              { className: "text-4xl md:text-5xl font-bold text-white mb-4 font-heading" }, 
              "Welcome to WatchTime"
            ),
            React.createElement(
              'p', 
              { className: "text-xl text-gray-300 mb-6" },
              "Your personal movie database for discovering, rating, and tracking your favorite films."
            ),
            React.createElement(
              'form', 
              { 
                onSubmit: handleSearch, 
                className: "flex flex-col sm:flex-row gap-2" 
              },
              React.createElement('input', {
                type: "text",
                placeholder: "Search for a movie...",
                className: "flex-grow px-4 py-3 rounded-lg bg-black bg-opacity-50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-imdb-yellow",
                value: searchInput,
                onChange: handleSearchInput
              }),
              React.createElement(
                'button',
                {
                  type: "submit",
                  className: "px-6 py-3 bg-imdb-yellow text-black font-bold rounded-lg hover:bg-yellow-400 transition"
                },
                React.createElement('i', { className: "fas fa-search mr-2" }),
                "Search"
              )
            )
          )
        )
      ),
      
      // Movie Categories
      isLoading ? 
        React.createElement(
          'div', 
          { className: "py-20 flex justify-center" },
          React.createElement('div', { 
            className: "animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-imdb-yellow" 
          })
        ) 
      : error ? 
        React.createElement(
          'div', 
          { className: "py-20 text-center" },
          React.createElement(
            'div', 
            { className: "text-red-500 mb-4" },
            React.createElement('i', { className: "fas fa-exclamation-circle text-4xl" })
          ),
          React.createElement(
            'h2', 
            { className: "text-2xl font-bold text-white mb-2" }, 
            "Something went wrong"
          ),
          React.createElement('p', { className: "text-gray-400 mb-6" }, error),
          React.createElement(
            'button',
            {
              onClick: () => window.location.reload(),
              className: "px-6 py-3 bg-imdb-yellow text-black font-bold rounded-lg hover:bg-yellow-400 transition"
            },
            "Try Again"
          )
        ) 
      : (!mainPageData || !mainPageData.categories || mainPageData.categories.length === 0) ? 
        React.createElement(
          'div', 
          { className: "py-20 text-center" },
          React.createElement(
            'div', 
            { className: "text-gray-500 mb-4" },
            React.createElement('i', { className: "fas fa-film text-4xl" })
          ),
          React.createElement(
            'h2', 
            { className: "text-2xl font-bold text-white mb-2" }, 
            "No movies available"
          ),
          React.createElement(
            'p', 
            { className: "text-gray-400 mb-6" }, 
            "There are currently no movies in our database."
          ),
          React.createElement(
            Link,
            {
              href: "/movies",
              className: "px-6 py-3 bg-imdb-yellow text-black font-bold rounded-lg hover:bg-yellow-400 transition"
            },
            "Browse Movies"
          )
        ) 
      : mainPageData.categories.map((category, index) => 
          React.createElement(CategoryRow, {
            key: index,
            title: `${category.genre} Movies`,
            movies: category.movies,
            genreName: category.genre
          })
        )
    ),
    React.createElement(Footer, null)
  );
};

export default HomePage;

import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '../context/AuthContext';
import { getMovieDetails } from '../lib/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MovieCard from '../components/MovieCard';
import ReviewItem from '../components/ReviewItem';
import React from 'react';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [favorites, setFavorites] = useState([]);
  const [userReviews, setUserReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Redirect if not logged in
    if (!user) {
      setLocation('/login');
      return;
    }

    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        
        // This is a mock implementation as the backend doesn't have endpoints
        // to directly get user favorites and reviews
        // In a real implementation, these would be separate API calls
        
        // For now, we'll simulate by keeping an empty state
        setFavorites([]);
        setUserReviews([]);
        
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError(err.message || 'Failed to load user data');
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [user, setLocation]);

  const handleSignout = async () => {
    await logout();
  };

  const handleRemoveFavorite = async (movieId) => {
    try {
      // Simulate removing a favorite
      setFavorites(favorites.filter(movie => movie.id !== movieId));
    } catch (err) {
      console.error('Error removing favorite:', err);
      setError(err.message || 'Failed to remove favorite');
    }
  }

  if (!user) {
    return null; // Redirecting in useEffect
  }

  return React.createElement(
    'div', 
    { className: "min-h-screen flex flex-col bg-imdb-dark" },
    React.createElement(Navbar, null),
    
    React.createElement(
      'main', 
      { className: "flex-grow" },
      React.createElement(
        'div', 
        { className: "py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" },
        React.createElement(
          'h1', 
          { className: "text-3xl font-bold text-white mb-8 font-heading" }, 
          "My Profile"
        ),
        
        React.createElement(
          'div', 
          { className: "grid grid-cols-1 md:grid-cols-3 gap-8" },
          // Left column
          React.createElement(
            'div', 
            { className: "md:col-span-1" },
            React.createElement(
              'div', 
              { className: "bg-imdb-gray rounded-lg p-6" },
              React.createElement(
                'div', 
                { className: "flex flex-col items-center text-center" },
                React.createElement(
                  'div', 
                  { className: "w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center mb-4" },
                  React.createElement('i', { className: "fas fa-user-circle text-5xl text-gray-500" })
                ),
                React.createElement(
                  'h2', 
                  { className: "text-xl font-bold text-white mb-1" }, 
                  user.username
                ),
                React.createElement(
                  'p', 
                  { className: "text-gray-400 mb-4" }, 
                  "@" + user.username
                ),
                React.createElement(
                  'div', 
                  { className: "flex space-x-2 text-gray-400 text-sm" },
                  React.createElement(
                    'div', 
                    { className: "flex items-center" },
                    React.createElement('i', { className: "fas fa-film mr-1" }),
                    React.createElement('span', null, favorites.length + " favorites")
                  ),
                  React.createElement(
                    'div', 
                    { className: "flex items-center" },
                    React.createElement('i', { className: "fas fa-star mr-1" }),
                    React.createElement('span', null, userReviews.length + " reviews")
                  )
                )
              ),
              
              React.createElement(
                'div', 
                { className: "mt-6 pt-6 border-t border-gray-700" },
                React.createElement(
                  'h3', 
                  { className: "text-lg font-medium text-white mb-3" }, 
                  "Account Settings"
                ),
                React.createElement(
                  Link, 
                  { 
                    href: "/profile/edit", 
                    className: "text-imdb-yellow text-sm hover:text-yellow-400 flex items-center mb-2" 
                  },
                  React.createElement('i', { className: "fas fa-user-edit mr-2" }),
                  " Edit Profile"
                ),
                React.createElement(
                  Link, 
                  { 
                    href: "/profile/change-password", 
                    className: "text-imdb-yellow text-sm hover:text-yellow-400 flex items-center mb-2" 
                  },
                  React.createElement('i', { className: "fas fa-lock mr-2" }),
                  " Change Password"
                ),
                React.createElement(
                  'button',
                  {
                    onClick: handleSignout,
                    className: "text-red-500 text-sm hover:text-red-400 flex items-center"
                  },
                  React.createElement('i', { className: "fas fa-sign-out-alt mr-2" }),
                  " Sign Out"
                )
              )
            )
          ),
          
          // Right column
          React.createElement(
            'div', 
            { className: "md:col-span-2" },
            // Favorites section
            React.createElement(
              'div', 
              { className: "bg-imdb-gray rounded-lg p-6 mb-8" },
              React.createElement(
                'h2', 
                { className: "text-xl font-bold text-white mb-4" }, 
                "My Favorites"
              ),
              
              isLoading ? 
                React.createElement(
                  'div', 
                  { className: "flex justify-center items-center h-32" },
                  React.createElement('div', { 
                    className: "animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-imdb-yellow" 
                  })
                ) 
              : error ? 
                React.createElement(
                  'div', 
                  { className: "text-center py-6" },
                  React.createElement('p', { className: "text-red-500" }, error)
                ) 
              : favorites.length === 0 ? 
                React.createElement(
                  'div', 
                  { className: "text-center py-6" },
                  React.createElement(
                    'div', 
                    { className: "text-gray-500 mb-3" },
                    React.createElement('i', { className: "far fa-heart text-3xl" })
                  ),
                  React.createElement(
                    'p', 
                    { className: "text-gray-400" }, 
                    "You haven't added any movies to your favorites yet."
                  ),
                  React.createElement(
                    Link,
                    {
                      href: "/movies",
                      className: "mt-3 inline-block px-4 py-2 bg-imdb-yellow text-black font-medium rounded-lg hover:bg-yellow-400 transition"
                    },
                    "Browse Movies"
                  )
                ) 
              : React.createElement(
                  'div', 
                  { className: "grid grid-cols-2 sm:grid-cols-3 gap-4" },
                  favorites.map(movie => 
                    React.createElement(
                      'div', 
                      { 
                        key: movie.id, 
                        className: "movie-card bg-black bg-opacity-50 rounded-lg overflow-hidden shadow-lg cursor-pointer relative group" 
                      },
                      React.createElement(MovieCard, { movie: movie }),
                      React.createElement(
                        'div', 
                        { className: "absolute top-2 right-2" },
                        React.createElement(
                          'button',
                          {
                            className: "text-red-500 bg-black bg-opacity-70 rounded-full p-1 w-8 h-8 flex items-center justify-center",
                            onClick: () => handleRemoveFavorite(movie.id)
                          },
                          React.createElement('i', { className: "fas fa-heart" })
                        )
                      )
                    )
                  )
                )
            ),
            
            // Reviews section
            React.createElement(
              'div', 
              { className: "bg-imdb-gray rounded-lg p-6" },
              React.createElement(
                'h2', 
                { className: "text-xl font-bold text-white mb-4" }, 
                "My Reviews"
              ),
              
              isLoading ? 
                React.createElement(
                  'div', 
                  { className: "flex justify-center items-center h-32" },
                  React.createElement('div', { 
                    className: "animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-imdb-yellow" 
                  })
                ) 
              : error ? 
                React.createElement(
                  'div', 
                  { className: "text-center py-6" },
                  React.createElement('p', { className: "text-red-500" }, error)
                ) 
              : userReviews.length === 0 ? 
                React.createElement(
                  'div', 
                  { className: "text-center py-6" },
                  React.createElement(
                    'div', 
                    { className: "text-gray-500 mb-3" },
                    React.createElement('i', { className: "far fa-star text-3xl" })
                  ),
                  React.createElement(
                    'p', 
                    { className: "text-gray-400" }, 
                    "You haven't reviewed any movies yet."
                  ),
                  React.createElement(
                    Link,
                    {
                      href: "/movies",
                      className: "mt-3 inline-block px-4 py-2 bg-imdb-yellow text-black font-medium rounded-lg hover:bg-yellow-400 transition"
                    },
                    "Browse Movies to Review"
                  )
                ) 
              : React.createElement(
                  'div', 
                  { className: "space-y-4" },
                  userReviews.map(review => 
                    React.createElement(
                      'div', 
                      { 
                        key: review.id, 
                        className: "bg-black bg-opacity-30 rounded-lg p-4" 
                      },
                      React.createElement(
                        'div', 
                        { className: "flex justify-between items-start mb-2" },
                        React.createElement(
                          'div', 
                          null,
                          React.createElement(
                            Link,
                            {
                              href: `/movie/${review.movieId}`,
                              className: "text-imdb-yellow font-medium hover:text-yellow-400"
                            },
                            review.movieTitle
                          )
                        ),
                        React.createElement(
                          'div', 
                          { className: "flex" },
                          // Stars rendering would go here
                          React.createElement(
                            'span', 
                            { className: "ml-2 text-white text-sm font-medium" }, 
                            review.rating + "/10"
                          )
                        )
                      ),
                      React.createElement('p', { className: "text-gray-300 text-sm" }, review.comment),
                      React.createElement(
                        'p', 
                        { className: "text-gray-400 text-xs mt-2" }, 
                        "Posted on " + new Date(review.created_at).toLocaleDateString()
                      )
                    )
                  )
                )
            )
          )
        )
      )
    ),
    
    React.createElement(Footer, null)
  );
};

export default ProfilePage;

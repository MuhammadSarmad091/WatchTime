import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useLocation } from 'wouter';
import { searchTMDB, addMovieFromTMDB, getUsers, toggleBlockUser, removeMovie } from '../lib/api';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import React from 'react';

const AdminPanel = () => {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);
  
  const [usersList, setUsersList] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [usersError, setUsersError] = useState(null);
  
  // Check if user is admin, redirect if not
  useEffect(() => {
    if (!user) {
      setLocation('/login');
      return;
    }
    
    if (user.role !== 'admin') 
    {
      toast.error('Access denied. Admin privileges required.');
      setLocation('/');
      return;
    }
    
    // Load users on mount
    fetchUsers();
  }, [user, setLocation]);
  
  const fetchUsers = async () => {
    try {
      setIsLoadingUsers(true);
      const response = await getUsers();
      setUsersList(response.users || []);
      setUsersError(null);
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsersError(error.message || 'Failed to load users');
    } finally {
      setIsLoadingUsers(false);
    }
  };
  
  const handleMovieSearch = async (e) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      toast.error('Please enter a search term');
      return;
    }
    
    try {
      setIsSearching(true);
      setSearchError(null);
      
      const response = await searchTMDB(searchQuery);
      setSearchResults(response.results || []);
      
      if (response.results?.length === 0) {
        toast.info('No movies found for your search');
      }
    } catch (error) {
      console.error('TMDB search error:', error);
      setSearchError(error.message || 'Failed to search TMDB');
      toast.error(error.message || 'Failed to search TMDB');
    } finally {
      setIsSearching(false);
    }
  };
  
  const handleImportMovie = async (movieId) => {
    try {
      toast.info('Importing movie...');
      await addMovieFromTMDB(movieId);
      toast.success('Movie imported successfully');
      
      // Remove the movie from search results to indicate it's been imported
      setSearchResults(searchResults.filter(movie => movie.id !== movieId));
    } catch (error) {
      console.error('Error importing movie:', error);
    }
  };
  
  const handleToggleUserBlock = async (username, currentStatus) => {
    try {
      const action = currentStatus === 'blocked' ? 'unblock' : 'block';
      
      if (!window.confirm(`Are you sure you want to ${action} user ${username}?`)) {
        return;
      }
      
      await toggleBlockUser(username);
      toast.success(`User ${action}ed successfully`);
      
      // Refresh users list
      fetchUsers();
    } catch (error) {
      console.error('Error toggling user block status:', error);
      toast.error(error.message || 'Failed to update user status');
    }
  };
  
  const handleRemoveMovie = async (movieId, movieTitle) => {
    try {
      if (!window.confirm(`Are you sure you want to remove "${movieTitle}" from the database?`)) {
        return;
      }
      
      await removeMovie(movieId);
      toast.success(`Movie "${movieTitle}" removed successfully`);
    } catch (error) {
      console.error('Error removing movie:', error);
      toast.error(error.message || 'Failed to remove movie');
    }
  };
  
  if (!user || user.role !== 'admin') {
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
          "Admin Panel"
        ),
        
        // Import Movies from TMDB Section
        React.createElement(
          'div', 
          { className: "bg-imdb-gray rounded-lg p-6 mb-8" },
          React.createElement(
            'h2', 
            { className: "text-xl font-bold text-white mb-4" }, 
            "Import Movies from TMDB"
          ),
          React.createElement(
            'form', 
            { 
              className: "flex flex-col sm:flex-row gap-4", 
              onSubmit: handleMovieSearch 
            },
            React.createElement('input', {
              type: "text",
              placeholder: "Search for a movie to import...",
              className: "flex-grow px-4 py-2 rounded-lg bg-black bg-opacity-50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-imdb-yellow",
              value: searchQuery,
              onChange: (e) => setSearchQuery(e.target.value),
              disabled: isSearching
            }),
            React.createElement(
              'button',
              {
                type: "submit",
                className: `px-4 py-2 bg-imdb-yellow text-black font-bold rounded-lg hover:bg-yellow-400 transition ${isSearching ? 'opacity-70 cursor-not-allowed' : ''}`,
                disabled: isSearching
              },
              isSearching ? 
                React.createElement(
                  'span', 
                  null,
                  React.createElement('i', { className: "fas fa-spinner fa-spin mr-2" }),
                  "Searching..."
                ) : 
                React.createElement(
                  'span', 
                  null,
                  React.createElement('i', { className: "fas fa-search mr-2" }),
                  "Search TMDB"
                )
            )
          ),
          
          React.createElement(
            'div', 
            { className: "mt-6" },
            searchError && React.createElement(
              'div', 
              { className: "bg-red-900 bg-opacity-50 text-white p-3 rounded-md mb-4" },
              React.createElement('p', null, searchError)
            ),
            
            searchResults.length > 0 && [
              React.createElement(
                'h3', 
                { className: "text-white font-medium mb-3", key: "search-results-title" }, 
                "Search Results:"
              ),
              React.createElement(
                'div', 
                { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4", key: "search-results-grid" },
                searchResults.map(movie => 
                  React.createElement(
                    'div', 
                    { 
                      key: movie.id, 
                      className: "bg-black bg-opacity-50 rounded-lg overflow-hidden flex" 
                    },
                    React.createElement('img', {
                      src: movie.poster_path 
                        ? `https://image.tmdb.org/t/p/w92${movie.poster_path}` 
                        : 'https://via.placeholder.com/92x138?text=No+Image',
                      alt: `${movie.title} poster`,
                      className: "w-16 h-24 object-cover flex-shrink-0"
                    }),
                    React.createElement(
                      'div', 
                      { className: "p-3 flex flex-col justify-between flex-grow" },
                      React.createElement(
                        'div', 
                        null,
                        React.createElement(
                          'h4', 
                          { className: "font-medium text-white text-sm" }, 
                          movie.title
                        ),
                        React.createElement(
                          'p', 
                          { className: "text-gray-400 text-xs" },
                          movie.release_date ? movie.release_date.substring(0, 4) : 'Unknown year'
                        )
                      ),
                      React.createElement(
                        'div',
                        { className: "flex space-x-2 mt-2" },
                        React.createElement(
                          Link,
                          {
                            to: `/tmdb/movie/${movie.id}`,
                            className: "bg-blue-600 text-white text-xs font-medium py-1 px-2 rounded hover:bg-blue-700 transition"
                          },
                          "View Details"
                        ),
                        React.createElement(
                          'button',
                          {
                            className: "bg-green-600 text-white text-xs font-medium py-1 px-2 rounded hover:bg-green-700 transition",
                            onClick: () => handleImportMovie(movie.id)
                          },
                          "Import"
                        )
                      )
                    )
                  )
                )
              )
            ]
          )
        ),
        
        // User Management Section
        React.createElement(
          'div', 
          { className: "bg-imdb-gray rounded-lg p-6 mb-8" },
          React.createElement(
            'h2', 
            { className: "text-xl font-bold text-white mb-4" }, 
            "User Management"
          ),
          
          isLoadingUsers ? 
            React.createElement(
              'div', 
              { className: "flex justify-center items-center h-32" },
              React.createElement('div', { 
                className: "animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-imdb-yellow" 
              })
            ) 
          : usersError ? 
            React.createElement(
              'div', 
              { className: "bg-red-900 bg-opacity-50 text-white p-3 rounded-md" },
              React.createElement('p', null, usersError)
            ) 
          : usersList.length === 0 ? 
            React.createElement(
              'div', 
              { className: "text-center py-6" },
              React.createElement('p', { className: "text-gray-400" }, "No users found in the database.")
            ) 
          : React.createElement(
              'div', 
              { className: "overflow-x-auto" },
              React.createElement(
                'table', 
                { className: "min-w-full divide-y divide-gray-700" },
                React.createElement(
                  'thead', 
                  { className: "bg-gray-800" },
                  React.createElement(
                    'tr', 
                    null,
                    React.createElement(
                      'th', 
                      { 
                        scope: "col", 
                        className: "px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider" 
                      }, 
                      "Username"
                    ),
                    React.createElement(
                      'th', 
                      { 
                        scope: "col", 
                        className: "px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider" 
                      }, 
                      "Email"
                    ),
                    React.createElement(
                      'th', 
                      { 
                        scope: "col", 
                        className: "px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider" 
                      }, 
                      "Role"
                    ),
                    React.createElement(
                      'th', 
                      { 
                        scope: "col", 
                        className: "px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider" 
                      }, 
                      "Status"
                    ),
                    React.createElement(
                      'th', 
                      { 
                        scope: "col", 
                        className: "px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider" 
                      }, 
                      "Actions"
                    )
                  )
                ),
                React.createElement(
                  'tbody', 
                  { className: "divide-y divide-gray-700" },
                  usersList.map(user => 
                    React.createElement(
                      'tr', 
                      { key: user.username },
                      React.createElement(
                        'td', 
                        { className: "px-6 py-4 whitespace-nowrap text-sm text-white" }, 
                        user.username
                      ),
                      React.createElement(
                        'td', 
                        { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-300" }, 
                        user.mail
                      ),
                      React.createElement(
                        'td', 
                        { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-300" }, 
                        user.role
                      ),
                      React.createElement(
                        'td', 
                        { className: "px-6 py-4 whitespace-nowrap" },
                        React.createElement(
                          'span', 
                          { 
                            className: `px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              user.status === 'active' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }` 
                          },
                          user.status
                        )
                      ),
                      React.createElement(
                        'td', 
                        { className: "px-6 py-4 whitespace-nowrap text-sm font-medium" },
                        user.role !== 'admin' && React.createElement(
                          'button',
                          {
                            className: `${
                              user.status === 'active' 
                                ? 'text-red-500 hover:text-red-700' 
                                : 'text-green-500 hover:text-green-700'
                            } mr-3`,
                            onClick: () => handleToggleUserBlock(user.username, user.status)
                          },
                          user.status === 'active' ? 'Block' : 'Unblock'
                        )
                      )
                    )
                  )
                )
              )
            )
        ),
        
        // Recent Activity Section
        React.createElement(
          'div', 
          { className: "bg-imdb-gray rounded-lg p-6" },
          React.createElement(
            'h2', 
            { className: "text-xl font-bold text-white mb-4" }, 
            "Recent Activity"
          ),
          React.createElement(
            'ul', 
            { className: "space-y-3" },
            React.createElement(
              'li', 
              { className: "bg-black bg-opacity-30 p-3 rounded" },
              React.createElement(
                'div', 
                { className: "flex justify-between" },
                React.createElement('span', { className: "text-white" }, "Admin panel viewed"),
                React.createElement('span', { className: "text-gray-400 text-sm" }, "Just now")
              )
            )
          )
        )
      )
    ),
    
    React.createElement(Footer, null)
  );
};

export default AdminPanel;

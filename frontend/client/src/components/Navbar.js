import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '../context/AuthContext';
import React from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = async () => {
    await logout();
    setMobileMenuOpen(false);
  };

  const isActive = (path) => {
    return location === path ? 'border-imdb-yellow text-white' : 'border-transparent text-gray-300 hover:border-gray-300 hover:text-white';
  };

  const isMobileActive = (path) => {
    return location === path ? 'bg-imdb-gray text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white';
  };

  return React.createElement(
    'nav', 
    { className: "bg-imdb-dark border-b border-gray-800" },
    React.createElement(
      'div', 
      { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" },
      React.createElement(
        'div', 
        { className: "flex justify-between h-16" },
        // Left section - Logo and main nav
        React.createElement(
          'div', 
          { className: "flex" },
          // Logo
          React.createElement(
            'div', 
            { className: "flex-shrink-0 flex items-center" },
            React.createElement(
              Link, 
              { href: "/", className: "text-imdb-yellow font-heading font-bold text-xl" },
              React.createElement('i', { className: "fas fa-film mr-2" }),
              "WatchTime"
            )
          ),
          // Desktop Navigation Links
          React.createElement(
            'div', 
            { className: "hidden sm:ml-6 sm:flex sm:space-x-8" },
            React.createElement(
              Link, 
              { href: "/", className: `${isActive('/')} px-1 pt-1 border-b-2 font-medium` },
              "Home"
            ),
            React.createElement(
              Link, 
              { href: "/movies", className: `${isActive('/movies')} px-1 pt-1 border-b-2 font-medium` },
              "Movies"
            ),
            user && React.createElement(
              Link, 
              { href: "/profile", className: `${isActive('/profile')} px-1 pt-1 border-b-2 font-medium` },
              "My Favorites"
            )
          )
        ),
        
        // Right section - User profile/auth buttons
        React.createElement(
          'div', 
          { className: "hidden sm:ml-6 sm:flex sm:items-center" },
          user ? 
            React.createElement(
              'div', 
              { className: "ml-3 relative flex items-center" },
              React.createElement(
                Link, 
                { href: "/profile", className: "bg-imdb-gray p-1 rounded-full text-gray-300 hover:text-white mr-3" },
                React.createElement('span', { className: "sr-only" }, "View profile"),
                React.createElement('i', { className: "fas fa-user-circle text-xl" })
              ),
              React.createElement('span', { className: "text-white mr-3" }, user.username),
              React.createElement(
                'button', 
                {
                  onClick: handleLogout,
                  className: "text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                },
                "Sign out"
              ),
              user.role === 'admin' && React.createElement(
                Link, 
                { href: "/admin", className: "ml-2 text-imdb-yellow hover:text-yellow-400 px-3 py-2 rounded-md text-sm font-medium" },
                "Admin Panel"
              )
            )
          : React.createElement(
              'div', 
              { className: "flex space-x-2" },
              React.createElement(
                Link, 
                { href: "/login", className: "text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium" },
                "Sign in"
              ),
              React.createElement(
                Link, 
                { href: "/signup", className: "bg-imdb-yellow text-black px-3 py-2 rounded-md text-sm font-medium hover:bg-yellow-400" },
                "Sign up"
              )
            )
        ),
        
        // Mobile menu button
        React.createElement(
          'div', 
          { className: "-mr-2 flex items-center sm:hidden" },
          React.createElement(
            'button',
            {
              onClick: toggleMobileMenu,
              type: "button",
              className: "inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none",
              "aria-expanded": "false"
            },
            React.createElement('span', { className: "sr-only" }, "Open main menu"),
            React.createElement('i', { className: "fas fa-bars" })
          )
        )
      )
    ),

    // Mobile menu
    React.createElement(
      'div', 
      { className: `sm:hidden ${mobileMenuOpen ? '' : 'hidden'}` },
      React.createElement(
        'div', 
        { className: "pt-2 pb-3 space-y-1" },
        React.createElement(
          Link, 
          {
            href: "/",
            className: `${isMobileActive('/')} block px-3 py-2 rounded-md text-base font-medium`,
            onClick: () => setMobileMenuOpen(false)
          },
          "Home"
        ),
        React.createElement(
          Link, 
          {
            href: "/movies",
            className: `${isMobileActive('/movies')} block px-3 py-2 rounded-md text-base font-medium`,
            onClick: () => setMobileMenuOpen(false)
          },
          "Movies"
        ),
        user && React.createElement(
          Link, 
          {
            href: "/profile",
            className: `${isMobileActive('/profile')} block px-3 py-2 rounded-md text-base font-medium`,
            onClick: () => setMobileMenuOpen(false)
          },
          "My Favorites"
        )
      ),
      
      // Mobile user section
      user ? 
        React.createElement(
          'div', 
          { className: "pt-4 pb-3 border-t border-gray-700" },
          React.createElement(
            'div', 
            { className: "flex items-center px-5" },
            React.createElement(
              'div', 
              { className: "flex-shrink-0" },
              React.createElement('i', { className: "fas fa-user-circle text-2xl text-gray-300" })
            ),
            React.createElement(
              'div', 
              { className: "ml-3" },
              React.createElement('div', { className: "text-base font-medium text-white" }, user.username)
            ),
            React.createElement(
              'button',
              {
                onClick: handleLogout,
                className: "ml-auto bg-gray-700 flex-shrink-0 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none"
              },
              React.createElement('span', { className: "sr-only" }, "Sign out"),
              React.createElement('i', { className: "fas fa-sign-out-alt text-lg" })
            ),
            user.role === 'admin' && React.createElement(
              Link, 
              {
                href: "/admin",
                className: "ml-3 bg-imdb-yellow text-black p-2 rounded-md font-medium text-xs",
                onClick: () => setMobileMenuOpen(false)
              },
              "Admin"
            )
          )
        )
      : React.createElement(
          'div', 
          { className: "pt-4 pb-3 border-t border-gray-700 px-5 flex space-x-4" },
          React.createElement(
            Link,
            {
              href: "/login",
              className: "text-gray-300 hover:text-white px-3 py-2 rounded-md text-base font-medium",
              onClick: () => setMobileMenuOpen(false)
            },
            "Sign in"
          ),
          React.createElement(
            Link,
            {
              href: "/signup",
              className: "bg-imdb-yellow text-black px-3 py-2 rounded-md text-base font-medium",
              onClick: () => setMobileMenuOpen(false)
            },
            "Sign up"
          )
        )
    )
  );
};

export default Navbar;

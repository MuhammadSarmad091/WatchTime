import { Link } from 'wouter';
import React from 'react';

const Footer = () => {
  return React.createElement(
    'footer', 
    { className: "bg-imdb-dark border-t border-gray-800 py-8" },
    React.createElement(
      'div', 
      { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" },
      React.createElement(
        'div', 
        { className: "flex flex-col md:flex-row justify-between items-center" },
        React.createElement(
          'div', 
          { className: "mb-6 md:mb-0" },
          React.createElement(
            Link, 
            { href: "/", className: "text-imdb-yellow font-heading font-bold text-xl" },
            React.createElement('i', { className: "fas fa-film mr-2" }),
            "WatchTime"
          ),
          React.createElement(
            'p', 
            { className: "text-gray-400 mt-2" }, 
            "Your personal movie database"
          )
        ),
        React.createElement(
          'div', 
          { className: "flex space-x-6" },
          React.createElement(
            'a', 
            { href: "#", className: "text-gray-400 hover:text-white" },
            React.createElement('i', { className: "fab fa-facebook-f" })
          ),
          React.createElement(
            'a', 
            { href: "#", className: "text-gray-400 hover:text-white" },
            React.createElement('i', { className: "fab fa-twitter" })
          ),
          React.createElement(
            'a', 
            { href: "#", className: "text-gray-400 hover:text-white" },
            React.createElement('i', { className: "fab fa-instagram" })
          ),
          React.createElement(
            'a', 
            { href: "#", className: "text-gray-400 hover:text-white" },
            React.createElement('i', { className: "fab fa-github" })
          )
        )
      ),
      React.createElement(
        'div', 
        { className: "mt-8 border-t border-gray-700 pt-4 flex flex-col md:flex-row justify-between items-center" },
        React.createElement(
          'div', 
          { className: "flex space-x-4 mb-4 md:mb-0" },
          React.createElement(
            'a', 
            { href: "#", className: "text-gray-400 hover:text-white text-sm" }, 
            "About"
          ),
          React.createElement(
            'a', 
            { href: "#", className: "text-gray-400 hover:text-white text-sm" }, 
            "Privacy"
          ),
          React.createElement(
            'a', 
            { href: "#", className: "text-gray-400 hover:text-white text-sm" }, 
            "Terms"
          ),
          React.createElement(
            'a', 
            { href: "#", className: "text-gray-400 hover:text-white text-sm" }, 
            "Contact"
          )
        ),
        React.createElement(
          'p', 
          { className: "text-gray-400 text-sm" }, 
          `© ${new Date().getFullYear()} WatchTime. All rights reserved.`
        )
      )
    )
  );
};

export default Footer;

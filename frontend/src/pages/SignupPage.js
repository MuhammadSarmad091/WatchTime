import { useState } from 'react';
import { Link } from 'wouter';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import React from 'react';


const SignupPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    email: ''
  });
  const [formError, setFormError] = useState('');
  const { signup, isLoading } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    // Basic form validation
    if (!formData.username.trim() || !formData.password.trim() || 
        !formData.name.trim() || !formData.email.trim()) {
      setFormError('All fields are required');
      return;
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setFormError('Please enter a valid email address');
      return;
    }

    // Password length check
    if (formData.password.length < 6) {
      setFormError('Password must be at least 6 characters long');
      return;
    }

    try {
      await signup(formData.username, formData.password, formData.name, formData.email);
    } catch (error) {
      setFormError(error.message || 'Failed to create account. Please try again.');
    }
  };

  return React.createElement(
    'div', 
    { className: "min-h-screen flex flex-col bg-imdb-dark" },
    React.createElement(Navbar, null),
    
    React.createElement(
      'main', 
      { className: "flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8" },
      React.createElement(
        'div', 
        { className: "max-w-md w-full space-y-8 bg-imdb-gray p-8 rounded-lg shadow-lg" },
        React.createElement(
          'div', 
          null,
          React.createElement(
            'h2', 
            { className: "mt-6 text-center text-3xl font-extrabold text-white" }, 
            "Create a new account"
          ),
          React.createElement(
            'p', 
            { className: "mt-2 text-center text-sm text-gray-400" },
            "Or ",
            React.createElement(
              Link, 
              { 
                href: "/login", 
                className: "font-medium text-imdb-yellow hover:text-yellow-400" 
              },
              "sign in to existing account"
            )
          )
        ),
        
        React.createElement(
          'form', 
          { 
            className: "mt-8 space-y-6", 
            onSubmit: handleSubmit 
          },
          formError && React.createElement(
            'div', 
            { className: "bg-red-900 bg-opacity-50 text-white p-3 rounded-md" },
            React.createElement('p', null, formError)
          ),
          
          React.createElement(
            'div', 
            { className: "rounded-md shadow-sm space-y-4" },
            React.createElement(
              'div', 
              null,
              React.createElement(
                'label', 
                { htmlFor: "name", className: "sr-only" }, 
                "Full Name"
              ),
              React.createElement('input', {
                id: "name",
                name: "name",
                type: "text",
                required: true,
                className: "appearance-none relative block w-full px-3 py-2 border border-gray-700 placeholder-gray-500 text-white rounded-md bg-gray-800 focus:outline-none focus:ring-imdb-yellow focus:border-imdb-yellow focus:z-10 sm:text-sm",
                placeholder: "Full Name",
                value: formData.name,
                onChange: handleChange
              })
            ),
            
            React.createElement(
              'div', 
              null,
              React.createElement(
                'label', 
                { htmlFor: "email", className: "sr-only" }, 
                "Email"
              ),
              React.createElement('input', {
                id: "email",
                name: "email",
                type: "email",
                required: true,
                className: "appearance-none relative block w-full px-3 py-2 border border-gray-700 placeholder-gray-500 text-white rounded-md bg-gray-800 focus:outline-none focus:ring-imdb-yellow focus:border-imdb-yellow focus:z-10 sm:text-sm",
                placeholder: "Email Address",
                value: formData.email,
                onChange: handleChange
              })
            ),
            
            React.createElement(
              'div', 
              null,
              React.createElement(
                'label', 
                { htmlFor: "username", className: "sr-only" }, 
                "Username"
              ),
              React.createElement('input', {
                id: "username",
                name: "username",
                type: "text",
                required: true,
                className: "appearance-none relative block w-full px-3 py-2 border border-gray-700 placeholder-gray-500 text-white rounded-md bg-gray-800 focus:outline-none focus:ring-imdb-yellow focus:border-imdb-yellow focus:z-10 sm:text-sm",
                placeholder: "Username",
                value: formData.username,
                onChange: handleChange
              })
            ),
            
            React.createElement(
              'div', 
              null,
              React.createElement(
                'label', 
                { htmlFor: "password", className: "sr-only" }, 
                "Password"
              ),
              React.createElement('input', {
                id: "password",
                name: "password",
                type: "password",
                required: true,
                className: "appearance-none relative block w-full px-3 py-2 border border-gray-700 placeholder-gray-500 text-white rounded-md bg-gray-800 focus:outline-none focus:ring-imdb-yellow focus:border-imdb-yellow focus:z-10 sm:text-sm",
                placeholder: "Password",
                value: formData.password,
                onChange: handleChange
              })
            )
          ),

          React.createElement(
            'div', 
            null,
            React.createElement(
              'button', 
              {
                type: "submit",
                disabled: isLoading,
                className: `group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-black bg-imdb-yellow hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-imdb-yellow ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`
              },
              React.createElement(
                'span', 
                { className: "absolute left-0 inset-y-0 flex items-center pl-3" },
                React.createElement('i', { className: "fas fa-user-plus" })
              ),
              isLoading ? 'Creating Account...' : 'Sign up'
            )
          )
        )
      )
    ),
    
    React.createElement(Footer, null)
  );
};

export default SignupPage;

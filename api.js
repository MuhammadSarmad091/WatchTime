// All API functions for communicating with the backend

// Base URLs for API endpoints
const ACCOUNT_URL = 'http://localhost:5000/account';
const TMDB_URL = 'http://localhost:5000/tmdb';
const LOCAL_URL = 'http://localhost:5000/local';

// Error handling helper function
const handleApiError = async (response) => {
  const text = await response.text();
  let message = '';
  try {
    const data = JSON.parse(text);
    message = data.message || 'Unknown error occurred';
  } catch (e) {
    message = text || 'Unknown error occurred';
  }
  throw new Error(message);
};

// Authentication API calls
export const loginUser = async (username, password) => {
  try {
    const response = await fetch(`${ACCOUNT_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      await handleApiError(response);
    }

    const data = await response.json();
    // Store token in localStorage
    localStorage.setItem('token', data.token);
    
    // Store user data in localStorage to avoid decoding JWT on every page
    if (data.user) {
      localStorage.setItem('userData', JSON.stringify(data.user));
    }
    
    // Return the user data directly
    return data.user;
  } catch (error) {
    throw error;
  }
};

export const signupUser = async (username, password, name, email) => {
  try {
    const response = await fetch(`${ACCOUNT_URL}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        username, 
        password, 
        name, 
        mail: email 
      }),
    });

    if (!response.ok) {
      await handleApiError(response);
    }

    const data = await response.json();
    // Store token in localStorage
    localStorage.setItem('token', data.token);
    
    // Store user data in localStorage
    if (data.user) {
      localStorage.setItem('userData', JSON.stringify(data.user));
    }
    
    // Return the user data directly
    return data.user;
  } catch (error) {
    throw error;
  }
};

export const logoutUser = async () => {
  // Clear token and user data from localStorage
  localStorage.removeItem('token');
  localStorage.removeItem('userData');
  return true;
};

export const getCurrentUser = async () => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    // First try to get the stored user data
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      return JSON.parse(storedUserData);
    }
    
    // Fallback: Decode the JWT if user data is not stored
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    const { username, role } = JSON.parse(jsonPayload);
    
    // Create minimal user object
    const userData = {
      username,
      role
    };
    
    // Store it for future use
    localStorage.setItem('userData', JSON.stringify(userData));
    
    return userData;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};

// Local movie database API calls
export const getMainPage = async () => {
  try {
    const response = await fetch(`${LOCAL_URL}/getMainPage`);
    
    if (!response.ok) {
      await handleApiError(response);
    }
    
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const getMovies = async (query = '', page = 1, limit = 10) => {
  try {
    const url = `${LOCAL_URL}/movies?query=${query}&page=${page}&limit=${limit}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      await handleApiError(response);
    }
    
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const getMovieDetails = async (movieId) => {
  try {
    const token = localStorage.getItem('token');
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
    
    const response = await fetch(`${LOCAL_URL}/movie/${movieId}`, { headers });
    
    if (!response.ok) {
      await handleApiError(response);
    }
    
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const toggleFavorite = async (movieId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Authentication required');
    
    const response = await fetch(`${LOCAL_URL}/toggleFavourite`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ movieId }),
    });
    
    if (!response.ok) {
      await handleApiError(response);
    }
    
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const addReview = async (movieId, rating, comment) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Authentication required');
    
    const response = await fetch(`${LOCAL_URL}/addReview`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ movieId, rating, comment }),
    });
    
    if (!response.ok) {
      await handleApiError(response);
    }
    
    return await response.json();
  } catch (error) {
    throw error;
  }
};

// Admin API calls
export const searchTMDB = async (query, page = 1) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Authentication required');
    
    const response = await fetch(`${TMDB_URL}/search?query=${query}&page=${page}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      await handleApiError(response);
    }
    
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const addMovieFromTMDB = async (movieId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Authentication required');
    
    const response = await fetch(`${TMDB_URL}/addMovie`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ movieId }),
    });
    
    if (!response.ok) {
      await handleApiError(response);
    }
    
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const getMovieFromTMDB = async (movieId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Authentication required');
    
    const response = await fetch(`${TMDB_URL}/movie/${movieId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      await handleApiError(response);
    }
    
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const getUsers = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Authentication required');
    
    const response = await fetch(`${LOCAL_URL}/getUsers`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      await handleApiError(response);
    }
    
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const toggleBlockUser = async (username) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Authentication required');
    
    const response = await fetch(`${LOCAL_URL}/toggleBlockUser`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ username }),
    });
    
    if (!response.ok) {
      await handleApiError(response);
    }
    
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const removeMovie = async (movieId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Authentication required');
    
    const response = await fetch(`${LOCAL_URL}/removeMovie`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ movieId }),
    });
    
    if (!response.ok) {
      await handleApiError(response);
    }
    
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const removeReview = async (movieId, reviewId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Authentication required');
    
    const response = await fetch(`${LOCAL_URL}/removeReview`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ movieId, reviewId }),
    });
    
    if (!response.ok) {
      await handleApiError(response);
    }
    
    return await response.json();
  } catch (error) {
    throw error;
  }
};

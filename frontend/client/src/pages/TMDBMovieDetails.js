import React, { useEffect, useState } from 'react';
import { useRoute, useLocation } from 'wouter';
import { getMovieFromTMDB, addMovieFromTMDB } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import CastList from '../components/CastList';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function TMDBMovieDetails() {
  const [, params] = useRoute('/tmdb/movie/:id');
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingMovie, setAddingMovie] = useState(false);
  const [addSuccess, setAddSuccess] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }

    let mounted = true;
    const fetchMovie = async () => {
      if (!params?.id) return;

      try {
        setLoading(true);
        setError(null);
        const response = await getMovieFromTMDB(params.id);
        if (mounted && response) {
          setMovie(response.movie);
          setCast(response.cast || []);
          setVideos(response.videos || []);
        }
      } catch (err) {
        console.error('Error fetching TMDB movie:', err);
        if (mounted) {
          setError(err.message || 'Failed to fetch movie details');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchMovie();
    return () => {
      mounted = false;
    };
  }, [params?.id, user, navigate]);

  const handleAddMovie = async () => {
    try {
      setAddingMovie(true);
      setError(null);
      await addMovieFromTMDB(params.id);
      setAddSuccess(true);
    } catch (err) {
      console.error('Error adding movie:', err);
      setError(err.message || 'Failed to add movie to database');
    } finally {
      setAddingMovie(false);
    }
  };

  if (loading) {
    return React.createElement('div', { className: 'min-h-screen bg-imdb-dark' },
      React.createElement(Navbar),
      React.createElement('div', { className: 'container mx-auto p-4 flex justify-center items-center min-h-[70vh]' },
        React.createElement('div', {
          className: 'text-xl font-semibold text-white animate-pulse'
        }, 'Loading movie details...')
      ),
      React.createElement(Footer)
    );
  }

  if (error) {
    return React.createElement('div', { className: 'min-h-screen bg-imdb-dark' },
      React.createElement(Navbar),
      React.createElement('div', { className: 'container mx-auto p-4' }, [
        React.createElement('div', {
          className: 'bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded',
          key: 'error-msg'
        }, React.createElement('p', null, error)),
        React.createElement('button', {
          key: 'back-button',
          className: 'mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600',
          onClick: () => navigate('/admin')
        }, 'Back to Admin Panel')
      ]),
      React.createElement(Footer)
    );
  }

  if (addSuccess) {
    return React.createElement('div', { className: 'min-h-screen bg-imdb-dark' },
      React.createElement(Navbar),
      React.createElement('div', { className: 'container mx-auto p-4' }, [
        React.createElement('div', {
          key: 'success-msg',
          className: 'bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded'
        }, React.createElement('p', null, `Movie "${movie.title}" has been successfully added to the database!`)),

        React.createElement('div', { key: 'button-group', className: 'mt-4 flex space-x-4' }, [
          React.createElement('button', {
            key: 'back-btn',
            className: 'bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600',
            onClick: () => navigate('/admin')
          }, 'Back to Admin Panel'),

          React.createElement('button', {
            key: 'view-btn',
            className: 'bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600',
            onClick: () => navigate(`/movie/${params.id}`)
          }, 'View Movie Page')
        ])
      ]),
      React.createElement(Footer)
    );
  }

  return React.createElement('div', { className: 'min-h-screen bg-imdb-dark' }, [
    React.createElement(Navbar),
    React.createElement('div', { className: 'container mx-auto p-4' }, [

      React.createElement('div', {
        key: 'top-section',
        className: 'relative rounded-lg overflow-hidden mb-6 bg-imdb-gray'
      }, [
        React.createElement('div', {
          key: 'bg-img',
          className: 'absolute inset-0 opacity-30',
          style: {
            backgroundImage: movie?.backdrop_path ?
              `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})` :
              'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(2px)'
          }
        }),

        React.createElement('div', {
          key: 'top-content',
          className: 'relative z-10 flex flex-col md:flex-row p-6'
        }, [
          React.createElement('div', {
            key: 'poster',
            className: 'flex-shrink-0 mb-4 md:mb-0 md:mr-6'
          }, React.createElement('img', {
            src: movie?.poster_path ?
              `https://image.tmdb.org/t/p/w500${movie.poster_path}` :
              'https://via.placeholder.com/500x750?text=No+Poster',
            alt: movie?.title,
            className: 'w-full max-w-[300px] rounded-lg shadow-lg'
          })),

          React.createElement('div', {
            key: 'movie-info',
            className: 'flex-grow text-white'
          }, [

            React.createElement('div', { key: 'title-rating', className: 'flex items-center gap-4 mb-4' }, [
              React.createElement('h1', { key: 'title', className: 'text-4xl font-bold' }, movie?.title),
              React.createElement('div', { key: 'rating', className: 'flex items-center' }, [
                React.createElement('span', { className: 'text-yellow-400 text-2xl mr-2' },
                  `★ ${movie?.vote_average?.toFixed(1)}`),
                React.createElement('span', { className: 'text-gray-400' },
                  `(${movie?.vote_count} votes)`)
              ])
            ]),

            movie?.tagline && React.createElement('p', {
              key: 'tagline',
              className: 'text-xl italic text-gray-300 mb-4'
            }, `"${movie.tagline}"`),

            React.createElement('div', { key: 'details', className: 'space-y-4 mb-6' }, [

              React.createElement('div', { key: 'release' }, [
                React.createElement('h3', {
                  className: 'text-gray-400 font-medium'
                }, 'Release Date'),
                React.createElement('p', null, movie?.release_date || 'Unknown')
              ]),

              movie?.genres && React.createElement('div', { key: 'genres' }, [
                React.createElement('h3', {
                  className: 'text-gray-400 font-medium'
                }, 'Genres'),
                React.createElement('div', {
                  className: 'flex flex-wrap gap-2 mt-1'
                }, movie.genres.map(genre =>
                  React.createElement('span', {
                    key: genre.id,
                    className: 'bg-imdb-yellow text-black px-3 py-1 rounded-full text-sm font-medium'
                  }, genre.name)
                ))
              ]),

              React.createElement('div', { key: 'overview' }, [
                React.createElement('h3', {
                  className: 'text-gray-400 font-medium'
                }, 'Overview'),
                React.createElement('p', { className: 'text-gray-200' }, movie?.overview)
              ])
            ]),

            React.createElement('button', {
              className: 'bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors',
              onClick: handleAddMovie,
              disabled: addingMovie
            }, addingMovie ? 'Adding to Database...' : 'Add to Database')
          ])
        ])
      ]),

      cast.length > 0 && React.createElement(CastList, { cast }),

      videos.length > 0 && React.createElement('div', { className: 'mt-8' }, [
        React.createElement('h2', {
          key: 'vid-heading',
          className: 'text-2xl font-bold text-white mb-4'
        }, 'Videos'),
        React.createElement('div', {
          key: 'vid-grid',
          className: 'grid grid-cols-1 md:grid-cols-2 gap-4'
        }, videos.slice(0, 4).map(video =>
          React.createElement('div', {
            key: video.id,
            className: 'aspect-video'
          }, React.createElement('iframe', {
            src: `https://www.youtube.com/embed/${video.key}`,
            title: video.name,
            className: 'w-full h-full rounded',
            allowFullScreen: true
          }))
        ))
      ]),

      React.createElement('button', {
        key: 'final-back',
        className: 'mt-8 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors',
        onClick: () => navigate('/admin')
      }, 'Back to Admin Panel')
    ]),
    React.createElement(Footer)
  ]);
}

export default TMDBMovieDetails;

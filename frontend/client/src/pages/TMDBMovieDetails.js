
import React from 'react';
import { useEffect, useState } from 'react';
import { useRoute, useLocation } from 'wouter';
import { getMovieFromTMDB, addMovieFromTMDB } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import CastList from '../components/CastList';

function TMDBMovieDetails() {
  const [, params] = useRoute('/tmdb/movie/:id');
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const [movie, setMovie] = useState(null);
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
        const data = await getMovieFromTMDB(params.id);
        if (mounted) {
          setMovie(data);
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
    return (
      <div className="min-h-screen bg-imdb-dark">
        <div className="container mx-auto p-4 flex justify-center items-center min-h-[70vh]">
          <div className="text-xl font-semibold text-white animate-pulse">Loading movie details...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-imdb-dark">
        <div className="container mx-auto p-4">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p>{error}</p>
          </div>
          <button
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={() => navigate('/admin')}
          >
            Back to Admin Panel
          </button>
        </div>
      </div>
    );
  }

  if (addSuccess) {
    return (
      <div className="min-h-screen bg-imdb-dark">
        <div className="container mx-auto p-4">
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            <p>Movie "{movie.title}" has been successfully added to the database!</p>
          </div>
          <div className="mt-4 flex space-x-4">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={() => navigate('/admin')}
            >
              Back to Admin Panel
            </button>
            <button
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              onClick={() => navigate(`/movie/${params.id}`)}
            >
              View Movie Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-imdb-dark">
      <div className="container mx-auto p-4">
        <div className="relative rounded-lg overflow-hidden mb-6 bg-imdb-gray">
          <div 
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: movie?.backdrop_path ? 
                `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})` : 
                'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'blur(2px)'
            }}
          />
          
          <div className="relative z-10 flex flex-col md:flex-row p-6">
            <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
              <img
                src={movie?.poster_path ? 
                  `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 
                  'https://via.placeholder.com/500x750?text=No+Poster'
                }
                alt={movie?.title}
                className="w-full max-w-[300px] rounded-lg shadow-lg"
              />
            </div>

            <div className="flex-grow text-white">
              <div className="flex items-center gap-4 mb-4">
                <h1 className="text-4xl font-bold">{movie?.title}</h1>
                <div className="flex items-center">
                  <span className="text-yellow-400 text-2xl mr-2">★ {movie?.vote_average?.toFixed(1)}</span>
                  <span className="text-gray-400">({movie?.vote_count} votes)</span>
                </div>
              </div>

              {movie?.tagline && (
                <p className="text-xl italic text-gray-300 mb-4">"{movie.tagline}"</p>
              )}

              <div className="space-y-4 mb-6">
                <div>
                  <h3 className="text-gray-400 font-medium">Release Date</h3>
                  <p>{movie?.release_date || 'Unknown'}</p>
                </div>

                {movie?.genres && (
                  <div>
                    <h3 className="text-gray-400 font-medium">Genres</h3>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {movie.genres.map(genre => (
                        <span 
                          key={genre.id}
                          className="bg-imdb-yellow text-black px-3 py-1 rounded-full text-sm font-medium"
                        >
                          {genre.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="text-gray-400 font-medium">Overview</h3>
                  <p className="text-gray-200">{movie?.overview}</p>
                </div>
              </div>

              <button
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                onClick={handleAddMovie}
                disabled={addingMovie}
              >
                {addingMovie ? 'Adding to Database...' : 'Add to Database'}
              </button>
            </div>
          </div>
        </div>

        {movie?.credits?.cast && <CastList cast={movie.credits.cast} />}

        {movie?.videos?.results && movie.videos.results.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-white mb-4">Videos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {movie.videos.results.slice(0, 4).map(video => (
                <div key={video.id} className="aspect-video">
                  <iframe
                    src={`https://www.youtube.com/embed/${video.key}`}
                    title={video.name}
                    className="w-full h-full rounded"
                    allowFullScreen
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          className="mt-8 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
          onClick={() => navigate('/admin')}
        >
          Back to Admin Panel
        </button>
      </div>
    </div>
  );
}

export default TMDBMovieDetails;

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { StarFilledIcon, HeartFilledIcon, HeartIcon, PlusIcon, CheckIcon } from '@radix-ui/react-icons';
import { getMovieById } from '../api/movieApi';
import useAuth from '../hooks/useAuth';

const MovieDetails = () => {
  const { id } = useParams();
  const { user, addToFavorites, removeFromFavorites, addToWatchlist, removeFromWatchlist } = useAuth();
  const [isInFavorites, setIsInFavorites] = useState(false);
  const [isInWatchlist, setIsInWatchlist] = useState(false);

  // Fetch movie details
  const { data: movieData, isLoading, isError, error } = useQuery({
    queryKey: ['movie', id],
    queryFn: () => getMovieById(id),
  });

  // Check if movie is in user's favorites or watchlist
  useEffect(() => {
    if (user && user.favorites && movieData?.data) {
      setIsInFavorites(user.favorites.includes(movieData.data.imdbId));
    }
    if (user && user.watchlist && movieData?.data) {
      setIsInWatchlist(user.watchlist.includes(movieData.data.imdbId));
    }
  }, [user, movieData]);

  const handleFavoriteToggle = async () => {
    if (!user) return;
    
    if (isInFavorites) {
      await removeFromFavorites(movieData.data.imdbId);
      setIsInFavorites(false);
    } else {
      await addToFavorites(movieData.data.imdbId);
      setIsInFavorites(true);
    }
  };

  const handleWatchlistToggle = async () => {
    if (!user) return;
    
    if (isInWatchlist) {
      await removeFromWatchlist(movieData.data.imdbId);
      setIsInWatchlist(false);
    } else {
      await addToWatchlist(movieData.data.imdbId);
      setIsInWatchlist(true);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Error loading movie details</h2>
        <p className="text-red-500 mb-6">{error?.message || 'Failed to load movie details'}</p>
        <Link to="/" className="btn btn-primary">
          Go Back Home
        </Link>
      </div>
    );
  }

  const movie = movieData?.data;

  if (!movie) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Movie not found</h2>
        <Link to="/" className="btn btn-primary">
          Go Back Home
        </Link>
      </div>
    );
  }

  // Default image if poster is not available
  const posterUrl = movie.poster === 'N/A' 
    ? 'https://via.placeholder.com/300x450?text=No+Poster+Available' 
    : movie.poster;

  return (
    <div className="bg-primary">
      {/* Movie Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/80 to-transparent"></div>
        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Movie Poster */}
            <div className="w-full md:w-1/3 lg:w-1/4">
              <div className="rounded-lg overflow-hidden shadow-lg">
                <img
                  src={posterUrl}
                  alt={`${movie.title} poster`}
                  className="w-full h-auto"
                />
              </div>
            </div>

            {/* Movie Info */}
            <div className="w-full md:w-2/3 lg:w-3/4">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                {movie.title} <span className="text-gray-400">({movie.year})</span>
              </h1>

              {/* Movie Meta */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-6">
                {movie.genre && <span>{movie.genre}</span>}
                {movie.rating && movie.rating !== 'N/A' && (
                  <div className="flex items-center">
                    <StarFilledIcon className="text-yellow-400 mr-1" />
                    <span className="text-yellow-400">{movie.rating}/10</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              {user && (
                <div className="flex flex-wrap gap-4 mb-8">
                  <button
                    onClick={handleFavoriteToggle}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-light rounded-md hover:bg-gray-800 transition-colors"
                  >
                    {isInFavorites ? (
                      <>
                        <HeartFilledIcon className="text-red-500" /> Remove from Favorites
                      </>
                    ) : (
                      <>
                        <HeartIcon /> Add to Favorites
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleWatchlistToggle}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-light rounded-md hover:bg-gray-800 transition-colors"
                  >
                    {isInWatchlist ? (
                      <>
                        <CheckIcon className="text-green-500" /> In Watchlist
                      </>
                    ) : (
                      <>
                        <PlusIcon /> Add to Watchlist
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Overview */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-2">Overview</h2>
                <p className="text-gray-300">{movie.plot}</p>
              </div>

              {/* Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {movie.director && movie.director !== 'N/A' && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Director</h3>
                    <p className="text-gray-300">{movie.director}</p>
                  </div>
                )}
                {movie.actors && movie.actors !== 'N/A' && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Cast</h3>
                    <p className="text-gray-300">{movie.actors}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-white mb-6">Reviews</h2>
        
        {movie.reviews && movie.reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {movie.reviews.map((review, index) => (
              <div key={index} className="bg-primary-light p-6 rounded-lg">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {review.user?.username || 'Anonymous'}
                    </h3>
                    <div className="flex items-center mt-1">
                      <StarFilledIcon className="text-yellow-400 mr-1" />
                      <span className="text-yellow-400">{review.rating}/10</span>
                    </div>
                  </div>
                  <span className="text-sm text-gray-400">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-300">{review.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No reviews yet. Be the first to review this movie!</p>
        )}

        {user && (
          <div className="mt-8 bg-primary-light p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-white mb-4">Add Your Review</h3>
            <form className="space-y-4">
              <div>
                <label htmlFor="rating" className="block text-sm font-medium text-gray-300 mb-1">
                  Rating
                </label>
                <select
                  id="rating"
                  className="input"
                  defaultValue=""
                >
                  <option value="" disabled>Select a rating</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="comment" className="block text-sm font-medium text-gray-300 mb-1">
                  Comment
                </label>
                <textarea
                  id="comment"
                  rows="4"
                  className="input"
                  placeholder="Write your review here..."
                ></textarea>
              </div>
              <button
                type="submit"
                className="btn btn-primary"
              >
                Submit Review
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetails; 
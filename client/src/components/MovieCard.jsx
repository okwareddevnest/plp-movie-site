import { Link } from 'react-router-dom';
import { StarFilledIcon } from '@radix-ui/react-icons';

const MovieCard = ({ movie }) => {
  // Default image if poster is not available
  const posterUrl = movie.poster === 'N/A' 
    ? 'https://via.placeholder.com/300x450?text=No+Poster+Available' 
    : movie.poster;

  return (
    <div className="card overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-xl">
      <Link to={`/movie/${movie.imdbId}`}>
        <div className="relative aspect-[2/3] overflow-hidden">
          <img
            src={posterUrl}
            alt={`${movie.title} poster`}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="text-white font-bold text-lg line-clamp-2">{movie.title}</h3>
              <p className="text-gray-300 text-sm">{movie.year}</p>
              {movie.rating && movie.rating !== 'N/A' && (
                <div className="flex items-center mt-1">
                  <StarFilledIcon className="text-yellow-400 mr-1" />
                  <span className="text-yellow-400">{movie.rating}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default MovieCard; 
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { searchMovies } from '../api/movieApi';
import MovieCard from '../components/MovieCard';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('query') || '');
  const [currentPage, setCurrentPage] = useState(1);

  // Get query from URL
  const query = searchParams.get('query') || '';

  // Reset page when query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [query]);

  // Fetch search results
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['searchMovies', query, currentPage],
    queryFn: () => searchMovies(query, currentPage),
    enabled: !!query,
  });

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ query: searchQuery.trim() });
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo(0, 0);
  };

  return (
    <div className="bg-primary min-h-screen py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-white mb-8">Search Movies</h1>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-12 max-w-2xl mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-primary-light text-white px-5 py-4 pr-12 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-secondary"
            />
            <button
              type="submit"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
            >
              <MagnifyingGlassIcon className="w-6 h-6" />
            </button>
          </div>
        </form>

        {/* Search Results */}
        {query ? (
          <>
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
              </div>
            ) : isError ? (
              <div className="text-center py-12">
                <p className="text-red-500 mb-4">{error?.message || 'Failed to search movies'}</p>
                <button
                  onClick={() => setCurrentPage(1)}
                  className="bg-secondary hover:bg-secondary-dark text-white px-4 py-2 rounded-md transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <>
                {data?.data?.Search && data.data.Search.length > 0 ? (
                  <>
                    <p className="text-gray-400 mb-6">
                      Found {data.data.totalResults} results for "{query}"
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                      {data.data.Search.map((movie) => (
                        <MovieCard
                          key={movie.imdbID}
                          movie={{
                            imdbId: movie.imdbID,
                            title: movie.Title,
                            year: movie.Year,
                            poster: movie.Poster,
                          }}
                        />
                      ))}
                    </div>

                    {/* Pagination */}
                    {data.data.totalResults > 10 && (
                      <div className="flex justify-center mt-12">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-4 py-2 rounded-md bg-primary-light text-white disabled:opacity-50"
                          >
                            Previous
                          </button>
                          <span className="px-4 py-2 rounded-md bg-secondary text-white">
                            {currentPage}
                          </span>
                          <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage * 10 >= data.data.totalResults}
                            className="px-4 py-2 rounded-md bg-primary-light text-white disabled:opacity-50"
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-400 mb-4">No results found for "{query}"</p>
                    <p className="text-gray-500">Try a different search term</p>
                  </div>
                )}
              </>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400 mb-4">Enter a search term to find movies</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search; 
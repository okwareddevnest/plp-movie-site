const axios = require('axios');

// Base URL for OMDB API (which provides IMDB data)
const OMDB_API_URL = 'http://www.omdbapi.com/';
const API_KEY = process.env.IMDB_API_KEY;

// Search movies by title
const searchMovies = async (query, page = 1) => {
  try {
    const response = await axios.get(OMDB_API_URL, {
      params: {
        apikey: API_KEY,
        s: query,
        page,
        type: 'movie',
      },
    });

    if (response.data.Response === 'False') {
      return { success: false, message: response.data.Error || 'No results found' };
    }

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Error searching movies:', error.message);
    return { success: false, message: 'Failed to search movies' };
  }
};

// Get movie details by IMDB ID
const getMovieById = async (imdbId) => {
  try {
    const response = await axios.get(OMDB_API_URL, {
      params: {
        apikey: API_KEY,
        i: imdbId,
        plot: 'full',
      },
    });

    if (response.data.Response === 'False') {
      return { success: false, message: response.data.Error || 'Movie not found' };
    }

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Error fetching movie details:', error.message);
    return { success: false, message: 'Failed to fetch movie details' };
  }
};

module.exports = {
  searchMovies,
  getMovieById,
}; 
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/movies';

// Search movies
export const searchMovies = async (query, page = 1) => {
  try {
    const { data } = await axios.get(`${API_URL}/search`, {
      params: { query, page },
    });
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to search movies',
    };
  }
};

// Get movie details
export const getMovieById = async (id) => {
  try {
    const { data } = await axios.get(`${API_URL}/${id}`);
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to get movie details',
    };
  }
};

// Get trending movies
export const getTrendingMovies = async () => {
  try {
    const { data } = await axios.get(`${API_URL}/trending`);
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to get trending movies',
    };
  }
};

// Add review to movie
export const addReview = async (id, reviewData) => {
  try {
    const { data } = await axios.post(`${API_URL}/${id}/reviews`, reviewData);
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to add review',
    };
  }
}; 
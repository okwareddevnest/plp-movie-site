const express = require('express');
const router = express.Router();
const {
  searchMovies,
  getMovieById,
  addMovieReview,
  getTrendingMovies,
} = require('../controllers/movieController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/search', searchMovies);
router.get('/trending', getTrendingMovies);
router.get('/:id', getMovieById);

// Protected routes
router.post('/:id/reviews', protect, addMovieReview);

module.exports = router; 
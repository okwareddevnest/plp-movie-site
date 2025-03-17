const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  addToFavorites,
  removeFromFavorites,
  addToWatchlist,
  removeFromWatchlist,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.post('/', registerUser);
router.post('/login', loginUser);

// Protected routes
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router.route('/favorites')
  .post(protect, addToFavorites);

router.route('/favorites/:imdbId')
  .delete(protect, removeFromFavorites);

router.route('/watchlist')
  .post(protect, addToWatchlist);

router.route('/watchlist/:imdbId')
  .delete(protect, removeFromWatchlist);

module.exports = router; 
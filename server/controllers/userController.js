const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ $or: [{ email }, { username }] });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const user = await User.create({
      username,
      email,
      password,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user email
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
        favorites: user.favorites,
        watchlist: user.watchlist,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.username = req.body.username || user.username;
      user.email = req.body.email || user.email;

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Add movie to favorites
// @route   POST /api/users/favorites
// @access  Private
const addToFavorites = async (req, res) => {
  try {
    const { imdbId } = req.body;
    
    if (!imdbId) {
      return res.status(400).json({ message: 'IMDB ID is required' });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if movie is already in favorites
    if (user.favorites.includes(imdbId)) {
      return res.status(400).json({ message: 'Movie already in favorites' });
    }

    user.favorites.push(imdbId);
    await user.save();

    res.status(200).json({ favorites: user.favorites });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Remove movie from favorites
// @route   DELETE /api/users/favorites/:imdbId
// @access  Private
const removeFromFavorites = async (req, res) => {
  try {
    const { imdbId } = req.params;
    
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if movie is in favorites
    if (!user.favorites.includes(imdbId)) {
      return res.status(400).json({ message: 'Movie not in favorites' });
    }

    user.favorites = user.favorites.filter(id => id !== imdbId);
    await user.save();

    res.status(200).json({ favorites: user.favorites });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Add movie to watchlist
// @route   POST /api/users/watchlist
// @access  Private
const addToWatchlist = async (req, res) => {
  try {
    const { imdbId } = req.body;
    
    if (!imdbId) {
      return res.status(400).json({ message: 'IMDB ID is required' });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if movie is already in watchlist
    if (user.watchlist.includes(imdbId)) {
      return res.status(400).json({ message: 'Movie already in watchlist' });
    }

    user.watchlist.push(imdbId);
    await user.save();

    res.status(200).json({ watchlist: user.watchlist });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Remove movie from watchlist
// @route   DELETE /api/users/watchlist/:imdbId
// @access  Private
const removeFromWatchlist = async (req, res) => {
  try {
    const { imdbId } = req.params;
    
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if movie is in watchlist
    if (!user.watchlist.includes(imdbId)) {
      return res.status(400).json({ message: 'Movie not in watchlist' });
    }

    user.watchlist = user.watchlist.filter(id => id !== imdbId);
    await user.save();

    res.status(200).json({ watchlist: user.watchlist });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  addToFavorites,
  removeFromFavorites,
  addToWatchlist,
  removeFromWatchlist,
}; 
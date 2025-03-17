const Movie = require('../models/Movie');
const imdbApi = require('../config/imdbApi');

// @desc    Search movies
// @route   GET /api/movies/search
// @access  Public
const searchMovies = async (req, res) => {
  try {
    const { query, page = 1 } = req.query;

    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const result = await imdbApi.searchMovies(query, page);

    if (!result.success) {
      return res.status(404).json({ message: result.message });
    }

    res.json(result.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get movie by ID
// @route   GET /api/movies/:id
// @access  Public
const getMovieById = async (req, res) => {
  try {
    const imdbId = req.params.id;

    // Check if movie exists in our database and is not expired
    let movie = await Movie.findOne({
      imdbId,
      cacheExpiry: { $gt: new Date() },
    });

    // If movie exists in our database and is not expired, return it
    if (movie) {
      return res.json(movie);
    }

    // If movie doesn't exist in our database or is expired, fetch from IMDB API
    const result = await imdbApi.getMovieById(imdbId);

    if (!result.success) {
      return res.status(404).json({ message: result.message });
    }

    // Update or create movie in our database
    movie = await Movie.findOneAndUpdate(
      { imdbId },
      {
        imdbId: result.data.imdbID,
        title: result.data.Title,
        year: result.data.Year,
        poster: result.data.Poster,
        plot: result.data.Plot,
        director: result.data.Director,
        actors: result.data.Actors,
        genre: result.data.Genre,
        rating: result.data.imdbRating,
        cacheExpiry: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      },
      { new: true, upsert: true }
    );

    res.json(movie);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Add review to movie
// @route   POST /api/movies/:id/reviews
// @access  Private
const addMovieReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const imdbId = req.params.id;

    if (!rating || !comment) {
      return res.status(400).json({ message: 'Rating and comment are required' });
    }

    // Find movie in our database
    let movie = await Movie.findOne({ imdbId });

    // If movie doesn't exist in our database, fetch from IMDB API and create it
    if (!movie) {
      const result = await imdbApi.getMovieById(imdbId);

      if (!result.success) {
        return res.status(404).json({ message: result.message });
      }

      movie = await Movie.create({
        imdbId: result.data.imdbID,
        title: result.data.Title,
        year: result.data.Year,
        poster: result.data.Poster,
        plot: result.data.Plot,
        director: result.data.Director,
        actors: result.data.Actors,
        genre: result.data.Genre,
        rating: result.data.imdbRating,
      });
    }

    // Check if user already reviewed this movie
    const alreadyReviewed = movie.reviews.find(
      (review) => review.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({ message: 'Movie already reviewed' });
    }

    // Add review
    const review = {
      user: req.user._id,
      rating: Number(rating),
      comment,
    };

    movie.reviews.push(review);

    await movie.save();

    res.status(201).json({ message: 'Review added' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get trending movies
// @route   GET /api/movies/trending
// @access  Public
const getTrendingMovies = async (req, res) => {
  try {
    // For a real app, you would use a trending API endpoint
    // For now, we'll just return some popular movies
    const popularMovies = ['tt0111161', 'tt0068646', 'tt0468569', 'tt0071562', 'tt0050083'];
    
    const movies = [];
    
    for (const imdbId of popularMovies) {
      // Check if movie exists in our database and is not expired
      let movie = await Movie.findOne({
        imdbId,
        cacheExpiry: { $gt: new Date() },
      });
      
      // If movie doesn't exist in our database or is expired, fetch from IMDB API
      if (!movie) {
        const result = await imdbApi.getMovieById(imdbId);
        
        if (result.success) {
          movie = await Movie.findOneAndUpdate(
            { imdbId },
            {
              imdbId: result.data.imdbID,
              title: result.data.Title,
              year: result.data.Year,
              poster: result.data.Poster,
              plot: result.data.Plot,
              director: result.data.Director,
              actors: result.data.Actors,
              genre: result.data.Genre,
              rating: result.data.imdbRating,
              cacheExpiry: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
            },
            { new: true, upsert: true }
          );
        }
      }
      
      if (movie) {
        movies.push(movie);
      }
    }
    
    res.json(movies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  searchMovies,
  getMovieById,
  addMovieReview,
  getTrendingMovies,
}; 
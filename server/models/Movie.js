const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema(
  {
    imdbId: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    year: {
      type: String,
    },
    poster: {
      type: String,
    },
    plot: {
      type: String,
    },
    director: {
      type: String,
    },
    actors: {
      type: String,
    },
    genre: {
      type: String,
    },
    rating: {
      type: String,
    },
    reviews: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        rating: {
          type: Number,
          required: true,
          min: 1,
          max: 10,
        },
        comment: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    // Cache expiry to refresh data from IMDB API
    cacheExpiry: {
      type: Date,
      default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    },
  },
  {
    timestamps: true,
  }
);

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie; 
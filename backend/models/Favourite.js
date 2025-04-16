const mongoose = require('mongoose');

const favouriteSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    ref: 'User'
  },
  movie_id: {
    type: Number,
    required: true
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Favourite', favouriteSchema);

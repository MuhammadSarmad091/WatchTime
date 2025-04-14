const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    index: true
  },
  results: [
    {
      iso_639_1: String,
      iso_3166_1: String,
      name: String,
      key: String,
      site: String,
      size: Number,
      type: String,
      official: Boolean,
      published_at: Date,
      id: String
    }
  ]
});

module.exports = mongoose.model('Video', videoSchema);

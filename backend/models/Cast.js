// models/Cast.js
const mongoose = require('mongoose');

const castSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    index: true
  },
  cast: [
    {
      adult: Boolean,
      gender: Number,
      id: Number,
      known_for_department: String,
      name: String,
      original_name: String,
      popularity: Number,
      profile_path: String,
      cast_id: Number,
      character: String,
      credit_id: String,
      order: Number
    }
  ]
});

module.exports = mongoose.model('Cast', castSchema);

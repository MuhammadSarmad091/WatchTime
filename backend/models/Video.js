// models/Video.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const VideoResultSchema = new Schema({
  iso_639_1:    { type: String },
  iso_3166_1:   { type: String },
  name:         { type: String },
  key:          { type: String },
  site:         { type: String },
  size:         { type: Number },
  type:         { type: String },
  official:     { type: Boolean },
  published_at: { type: Date },
  id:           { type: String },   // you might rename this to avoid confusion
}, { _id: false });                 // avoid a new _id for each sub‐doc

const VideoSchema = new Schema({
  id:      { type: Number, required: true, unique: true },
  results: { type: [VideoResultSchema], default: [] }
});

module.exports = mongoose.model('Video', VideoSchema);

const mongoose = require('mongoose');

const GenreSchema = new mongoose.Schema({
  id: Number,
  name: String
}, { _id: false });

const CompanySchema = new mongoose.Schema({
  id: Number,
  logo_path: String,
  name: String,
  origin_country: String
}, { _id: false });

const CountrySchema = new mongoose.Schema({
  iso_3166_1: String,
  name: String
}, { _id: false });

const LanguageSchema = new mongoose.Schema({
  english_name: String,
  iso_639_1: String,
  name: String
}, { _id: false });

const MovieSchema = new mongoose.Schema({
  adult: Boolean,
  backdrop_path: String,
  budget: Number,
  genres: [GenreSchema],
  homepage: String,
  id: { type: Number, required: true, unique: true }, // TMDB movie ID
  imdb_id: String,
  origin_country: [String],
  original_language: String,
  original_title: String,
  overview: String,
  popularity: Number,
  poster_path: String,
  production_companies: [CompanySchema],
  production_countries: [CountrySchema],
  release_date: String,
  revenue: Number,
  runtime: Number,
  spoken_languages: [LanguageSchema],
  status: String,
  tagline: String,
  title: String,
  video: Boolean,
  vote_average: Number,
  vote_count: Number,
}, { timestamps: true });

module.exports = mongoose.model('Movie', MovieSchema);
// This file contains JavaScript comment-based type definitions to help understand
// the data structure in the absence of TypeScript types.

/**
 * @typedef {Object} User
 * @property {string} username - The user's username
 * @property {string} role - The user's role (e.g., "user", "admin")
 */

/**
 * @typedef {Object} Movie
 * @property {boolean} adult - Whether the movie is for adults
 * @property {string} backdrop_path - Path to the backdrop image
 * @property {number} budget - The movie budget
 * @property {Array<Genre>} genres - Array of genres
 * @property {string} homepage - URL to the movie's homepage
 * @property {number} id - TMDB movie ID
 * @property {string} imdb_id - IMDB movie ID
 * @property {Array<string>} origin_country - Array of origin countries
 * @property {string} original_language - Original language of the movie
 * @property {string} original_title - Original title of the movie
 * @property {string} overview - Movie overview/description
 * @property {number} popularity - Movie popularity rating
 * @property {string} poster_path - Path to the poster image
 * @property {Array<ProductionCompany>} production_companies - Array of production companies
 * @property {Array<ProductionCountry>} production_countries - Array of production countries
 * @property {string} release_date - Release date of the movie
 * @property {number} revenue - Movie revenue
 * @property {number} runtime - Movie runtime in minutes
 * @property {Array<SpokenLanguage>} spoken_languages - Array of spoken languages
 * @property {string} status - Movie status
 * @property {string} tagline - Movie tagline
 * @property {string} title - Movie title
 * @property {boolean} video - Whether the movie has video
 * @property {number} vote_average - Average vote
 * @property {number} vote_count - Number of votes
 */

/**
 * @typedef {Object} Genre
 * @property {number} id - Genre ID
 * @property {string} name - Genre name
 */

/**
 * @typedef {Object} ProductionCompany
 * @property {number} id - Company ID
 * @property {string} logo_path - Path to the company logo
 * @property {string} name - Company name
 * @property {string} origin_country - Company origin country
 */

/**
 * @typedef {Object} ProductionCountry
 * @property {string} iso_3166_1 - Country ISO code
 * @property {string} name - Country name
 */

/**
 * @typedef {Object} SpokenLanguage
 * @property {string} english_name - English name of the language
 * @property {string} iso_639_1 - Language ISO code
 * @property {string} name - Language name
 */

/**
 * @typedef {Object} CastMember
 * @property {boolean} adult - Whether the cast member is an adult actor
 * @property {number} gender - Cast member's gender
 * @property {number} id - Cast member ID
 * @property {string} known_for_department - Department the cast member is known for
 * @property {string} name - Cast member's name
 * @property {string} original_name - Cast member's original name
 * @property {number} popularity - Cast member's popularity
 * @property {string} profile_path - Path to the cast member's profile image
 * @property {number} cast_id - Cast ID
 * @property {string} character - Character played by the cast member
 * @property {string} credit_id - Credit ID
 * @property {number} order - Order in the cast list
 */

/**
 * @typedef {Object} Video
 * @property {string} iso_639_1 - Language ISO code
 * @property {string} iso_3166_1 - Country ISO code
 * @property {string} name - Video name
 * @property {string} key - Video key (e.g., YouTube video ID)
 * @property {string} site - Video site (e.g., "YouTube")
 * @property {number} size - Video size/resolution
 * @property {string} type - Video type (e.g., "Trailer", "Clip")
 * @property {boolean} official - Whether the video is official
 * @property {string} published_at - Publication date
 * @property {string} id - Video ID
 */

/**
 * @typedef {Object} Review
 * @property {string} username - Username of the reviewer
 * @property {number} rating - Rating given (0-10)
 * @property {string} comment - Review comment
 * @property {string} created_at - Review creation date
 * @property {string} _id - Review ID
 */

/**
 * @typedef {Object} MovieDetails
 * @property {Movie} movie - Movie details
 * @property {Array<CastMember>} cast - Movie cast
 * @property {Array<Video>} videos - Movie videos
 * @property {Array<Review>} reviews - Movie reviews
 * @property {boolean} favourite - Whether the movie is in the user's favorites
 */

/**
 * @typedef {Object} CategorizedMovies
 * @property {string} genre - Genre name
 * @property {Array<Movie>} movies - Movies in this genre
 */

/**
 * @typedef {Object} MovieQueryResult
 * @property {number} page - Current page number
 * @property {Array<Movie>} results - Array of movies
 * @property {number} total_pages - Total number of pages
 * @property {number} total_results - Total number of results
 */

export default {};

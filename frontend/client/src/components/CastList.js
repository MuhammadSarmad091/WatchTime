import React from 'react';

// TMDB image URL base
const TMDB_IMG_BASE = "https://image.tmdb.org/t/p/w500";

const CastList = ({ cast }) => {
  if (!cast || cast.length === 0) {
    return React.createElement(
      'div', 
      { className: "text-center py-8" },
      React.createElement('p', { className: "text-gray-400" }, "No cast information available")
    );
  }

  return React.createElement(
    'div', 
    { className: "mt-12" },
    React.createElement(
      'h2', 
      { className: "text-2xl font-heading font-bold text-white mb-6" }, 
      "Cast"
    ),
    React.createElement(
      'div', 
      { className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4" },
      cast.map((castMember) => 
        React.createElement(
          'div', 
          { 
            key: castMember.cast_id, 
            className: "bg-imdb-gray rounded-lg overflow-hidden shadow-lg" 
          },
          React.createElement('img', {
            src: castMember.profile_path 
              ? `${TMDB_IMG_BASE}${castMember.profile_path}` 
              : 'https://via.placeholder.com/300x450?text=No+Image',
            alt: castMember.name,
            className: "w-full h-48 object-cover object-top",
            loading: "lazy"
          }),
          React.createElement(
            'div', 
            { className: "p-3" },
            React.createElement('h4', { className: "text-white font-medium" }, castMember.name),
            React.createElement('p', { className: "text-gray-400 text-sm" }, castMember.character)
          )
        )
      )
    )
  );
};

export default CastList;

const mongoose = require('mongoose')

const movieSchema = new mongoose.Schema({
    CommingSoon: { type: Boolean, default: false },
    Title: { type: String, required: true, unique: true },
    Year: { type: String },
    Rated: { type: String },
    Released: { type: String },
    Runtime: { type: String },
    Genre: { type: Array },
    Director: { type: String },
    Writer: { type: String },
    Actors: { type: String },
    Plot: { type: String },
    Poster: { type: String },
    Trailer: { type: String, default: ""},
    Language: { type: String },
    Country: { type: String },
    Awards: { type: String },
    Poster: { type: String },
    Metascore: { type: String },
    Type: { type: String },
    totalSeasons: { type: String, default: ""},
    Images: { type: Array },
  }, { timestamps: true })

  const Movie = mongoose.model('Movie', movieSchema)

  module.exports = Movie;


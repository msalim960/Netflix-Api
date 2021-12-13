const express = require("express");
const Movie = require("../models/Movie");
const Genre = require("../models/Genre");
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')

const router = express.Router();

//Creating a Movie
router.post("/", [auth, admin], async (req, res) => {
  let movie = await Movie.findOne({
    title: req.body.title,
    type: req.body.type,
  });
  if (movie) return res.status(400).send("Movie already exist");

  movie = await new Movie(req.body);
  const genreIds = movie.Genre;

  for (let genreid of genreIds) {
    const genre = await Genre.findById(genreid).select("movies");
    if (!genre) return res.status(404).send("Invalid genre id sent");

    genre.movies.push(genreid);
    await genre.save();
  }

  await movie.save()
  res.status(200).send(movie);
});

//Getting a Ramdom movie to use as featured movie
router.get("/random", [auth, admin], async (req, res) => {
  const movie_type = req.query.type;
  let movie;

  if (movie_type === "series")
    movie = await Movie.aggregate([
      { $match: { type: "series" } },
      { $sample: { size: 1 } },
    ]);
  else
    movie = await Movie.aggregate([
      { $match: { type: "movie" } },
      { $sample: { size: 1 } },
    ]);
});

//Updating a movie
router.put("/:id", [auth, admin], async (req, res) => {
  const movie = await Movie.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true }
  );
  if (!movie) return res.status(404).send("Invalid movie");

  res.status(200).send("Movie updated successfully..");
});

//Deleting a movie
router.delete("/:id", [auth, admin], async (req, res) => {
  const movie = await Movie.findByIdAndDelete(req.params.id);
  if (!movie) return res.status(404).send("No such movie with the given id");

  res.status(200).send("Movie deleted successfully..");
});

//Getting a single movie
router.get('/:id', [auth, admin], async(req, res) => {
    const movie = await Movie.findById(req.params.id)
    if (!movie) return res.status(404).send('No such movie with the given id')

    res.status(200).send(movie)
})

module.exports = router;

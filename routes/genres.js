const express = require("express");
const Genre = require("../models/Genre");
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')

const router = express.Router();

//Creating a Genre
router.post("/", [auth, admin], async (req, res) => {
  let genre = await Genre.findOne({ name: req.body.name });
  if (genre) return res.status(400).send("Genre already exist");

  genre = new Genre(req.body);
  await genre.save();
  res.status(200).send(genre);
});

//Deleting a Genre
router.delete("/:id", [auth, admin], async (req, res) => {
  const genre = await Genre.findByIdAndDelete(req.params.id);
  if (!genre)
    return res.status(404).send("There is no genre with the given Id");

  res.status(200).send("Genre deleted successfully");
});

//Getting a Genre
router.get('/', auth, async(req, res) => {
    const genre_query = req.query.genre;
    const movie_type = req.body.type
    let genres;

    if (genre_query)
        genres = await Genre.aggregate([
            { $match: { name: genre_query, type: movie_type }},
            { $sample: { $size: 15 }}
        ])
    else
        genres = await Genre.find()
})

module.exports = router;

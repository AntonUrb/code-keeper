const db = require('../models/index.js')
const createMovie = (req, res) => {
  const { title, description } = req.body;  // Deconstruct title and description from req.body
  console.log("Creating movie:", title, description)
  db.Movie.create({ title, description })
    .then(movie => {
      console.log("Movies found")
      res.status(200).json(movie);  // Send the created movie as the response
    })
    .catch(error => {
      console.error("Error finding movies")
      res.status(400).json({ error: error.message });  // Send the error message as the response
    });
};
// Finds all movies
const findAllMovies = (req, res) => {
  const { title } = req.query;
  if (title) {
    console.log("Finding movie by title:", title)
    return db.Movie.findOne({ where: {
      title: title }
    })
      .then(movie => {
        if (movie) {
          res.status(200).json(movie);
        } else {
          res.status(404).json({ error: 'Movie not found' });
        }
      })
  }
  console.log("Finding all movies")
  db.Movie.findAll().then(movies => {
    res.status(200).json(movies);  // Send the created movie as the response
  })
    .catch(error => {
      res.status(400).json({ error: error.message });  // Send the error message as the response
    });
};
const findMovie = (req, res) => {
  const { id } = req.params;
  if (!id) {
    console.error("No ID provided, exiting")
    return res.status(400).json({ error: 'ID or title is required' });
  }
  console.log("Finding movie by ID:", id)
  db.Movie.findOne({ where: {id} })
    .then(movie => {
      if (movie) {
        console.log("Movie found:", movie)
        res.status(200).json(movie);
      } else {
        console.log("No movies found")
        res.status(404).json({ error: 'Movie not found' });
      }
    })
    .catch(error => {
      console.error("Error finding movies")
      res.status(400).json({ error: error.message });
    });
};
// Updates movie by id
const updateMovie = (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;
  if (!id) {
    console.log("No ID provided")
    return res.status(400).json({ error: 'ID is required' });
  }
  db.Movie.update({ title: title, description: description }, { where: {id} })
    .then(([rowsUpdated]) => {
      if (rowsUpdated) {
        console.log("Movie updated succesfully. ", rowsUpdated)
        res.status(200).json({ message: 'Movie updated successfully' });
      } else {
        console.log("No movies found with ID:", id)
        res.status(404).json({ error: 'Movie not found' });
      }
    })
    .catch(error => {
      console.error("Error while updating movie")
      res.status(400).json({ error: error.message });
    });
};
// Deletes movie by id
const deleteMovie = (req, res) => {
  const { id } = req.params; // Takes Id from request
  
  // Check if Id exists
  if (!id) {
    return db.Movie.destroy({
      truncate: true,
    })
      .then(() => {
        console.log("All movies deleted")
        res.status(200).json({ message: 'All movies deleted successfully' });
      })
      .catch(error => {
        console.error("Error while deleting movies")
        res.status(400).json({ error: error.message });
      });
  }
  
  console.log("Deleting movie by ID:", id)
  // Check if movie exists, if id does, deletes it, if movie doesnt exist, returns error.
  db.Movie.destroy({ where: {id} })
    .then(rowsDeleted => {
      if (rowsDeleted) {
        console.log("Movie deleted succesfully. ", rowsDeleted)
        res.status(200).json({ message: 'Movie deleted successfully' });
      } else {
        console.log("Didn't find movie by ID:", id)
        res.status(404).json({ error: 'Movie not found' });
      }
    })
    .catch(error => {
      console.error("Error while deleting movie")
      res.status(400).json({ error: error.message });
    });
};
// Export everything
module.exports = {
  createMovie,
  findAllMovies,
  findMovie,
  updateMovie,
  deleteMovie,
};
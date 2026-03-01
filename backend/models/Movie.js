const mongoose = require("mongoose");

const MovieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  genre: { type: String },
  duration: { type: Number }, // in minutes
  language: { type: String },
  releaseDate: { type: Date },
  imageUrl: { type: String } // Add this line for movie poster
});

module.exports = mongoose.model("Movie", MovieSchema, "movies");
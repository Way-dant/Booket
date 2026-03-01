// backend/models/Show.js
const mongoose = require("mongoose");

const ShowSchema = new mongoose.Schema({
  movie: { type: mongoose.Schema.Types.ObjectId, ref: "Movie", required: true },
  screen: { type: mongoose.Schema.Types.ObjectId, ref: "Screen", required: true },
  showTime: { type: Date, required: true },
  price: { type: Number, required: true }, // ticket price
  availableSeats: [Number]                 // e.g., [1,2,3,...120]
});

module.exports = mongoose.model("Show", ShowSchema, "shows");

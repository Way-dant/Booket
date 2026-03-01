// backend/models/Screen.js
const mongoose = require("mongoose");

const ScreenSchema = new mongoose.Schema({
  name: { type: String, required: true },   // e.g., Screen 1
  totalSeats: { type: Number, required: true }
});

module.exports = mongoose.model("Screen", ScreenSchema, "screens");

// backend/models/Booking.js - TEMPORARY FIX
const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  show: { type: String, required: true }, // Change to String temporarily
  customerName: { type: String, required: true },
  customerEmail: { type: String },
  customerPhone: { type: String },
  seats: [String], // This is correct for "A1", "B2"
  totalPrice: { type: Number, required: true },
  bookedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Booking", BookingSchema, "bookings");
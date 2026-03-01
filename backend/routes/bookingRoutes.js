const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Booking = require("../models/Booking");
const Show = require("../models/Show"); // ✅ ADD THIS IMPORT
const { sendBookingEmail } = require("../controllers/emailController");

// Create a new booking and send email
router.post("/", async (req, res) => {
  try {
    const { show, seats, customerName, customerEmail, customerPhone, totalPrice } = req.body;

    // Basic validation
    if (!show || !seats || !customerName || !totalPrice) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    const bookingData = {
      show: String(show),
      seats: Array.isArray(seats) ? seats : [seats],
      customerName,
      customerEmail: customerEmail || "",
      customerPhone: customerPhone || "",
      totalPrice: Number(totalPrice)
    };

    console.log("Creating booking with data:", bookingData);

    // ✅ STEP 1: CREATE BOOKING
    const booking = new Booking(bookingData);
    const savedBooking = await booking.save();

    // ✅ STEP 2: UPDATE SHOW'S AVAILABLE SEATS
    const showToUpdate = await Show.findById(show);
    if (showToUpdate) {
      // Convert seat IDs like "A1", "A2" to seat numbers like 1, 2, 3
      const bookedSeatNumbers = seats.map(seatId => {
        // Extract numbers from "A1", "B2", etc.
        const seatNumber = parseInt(seatId.replace(/\D/g, ''));
        return seatNumber;
      }).filter(num => !isNaN(num));

      // Remove booked seats from availableSeats
      showToUpdate.availableSeats = showToUpdate.availableSeats.filter(
        seatNum => !bookedSeatNumbers.includes(seatNum)
      );

      await showToUpdate.save();
      console.log("Updated available seats:", showToUpdate.availableSeats);
    }
    
    // Send email (optional)
    try {
      await sendBookingEmail(savedBooking);
    } catch (emailError) {
      console.error("Email failed:", emailError);
    }
    
    res.status(201).json({
      success: true,
      message: "Booking confirmed!",
      booking: savedBooking
    });

  } catch (err) {
    console.error("Booking creation error:", err);
    res.status(400).json({ 
      success: false,
      message: err.message 
    });
  }
});

// Get all bookings
router.get("/", async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('show')
      .populate({
        path: 'show',
        populate: { path: 'movie screen' }
      });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
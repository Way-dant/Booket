const express = require("express");
const router = express.Router();
const Show = require("../models/Show");
const Movie = require("../models/Movie");
const Screen = require("../models/Screen");

// Get all shows with movie and screen details
router.get("/", async (req, res) => {
  try {
    const shows = await Show.find()
      .populate('movie')
      .populate('screen');
    res.json(shows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new show (assign screen to movie with timing)
router.post("/", async (req, res) => {
  const { movie, screen, showTime, price } = req.body;
  
  try {
    // Get screen details to know total seats
    const screenDetails = await Screen.findById(screen);
    if (!screenDetails) {
      return res.status(404).json({ message: "Screen not found" });
    }

    // Create available seats array (1 to totalSeats)
    const availableSeats = Array.from(
      { length: screenDetails.totalSeats }, 
      (_, i) => i + 1
    );

    const show = new Show({ 
      movie, 
      screen, 
      showTime: new Date(showTime), 
      price,
      availableSeats
    });
    
    const savedShow = await show.save();
    
    // Populate the saved show with movie and screen details
    const populatedShow = await Show.findById(savedShow._id)
      .populate('movie')
      .populate('screen');
      
    res.status(201).json(populatedShow);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get shows by movie ID
router.get("/movie/:movieId", async (req, res) => {
  try {
    const shows = await Show.find({ movie: req.params.movieId })
      .populate('movie')
      .populate('screen')
      .select('+availableSeats');
    res.json(shows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add this debug route to see what's actually in your database
router.get("/debug-ids", async (req, res) => {
  try {
    const shows = await Show.find().limit(3)
      .populate('movie')
      .populate('screen');
    
    const debugInfo = shows.map(show => ({
      _id: show._id,
      _idType: typeof show._id,
      _idString: show._id.toString(),
      movieTitle: show.movie?.title,
      screenName: show.screen?.name,
      showTime: show.showTime
    }));
    
    console.log("DEBUG Show IDs:", debugInfo);
    res.json(debugInfo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ UPDATE SHOW
router.put("/:id", async (req, res) => {
  try {
    const { movie, screen, showTime, price } = req.body;
    
    const updatedShow = await Show.findByIdAndUpdate(
      req.params.id,
      { movie, screen, showTime: new Date(showTime), price },
      { new: true, runValidators: true }
    ).populate('movie').populate('screen');
    
    if (!updatedShow) {
      return res.status(404).json({ message: "Show not found" });
    }
    
    res.json(updatedShow);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ✅ DELETE SHOW
router.delete("/:id", async (req, res) => {
  try {
    const deletedShow = await Show.findByIdAndDelete(req.params.id);
    
    if (!deletedShow) {
      return res.status(404).json({ message: "Show not found" });
    }
    
    res.json({ message: "Show deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
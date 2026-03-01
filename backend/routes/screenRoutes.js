const express = require("express");
const router = express.Router();
const Screen = require("../models/Screen");

// Get all screens
router.get("/", async (req, res) => {
  try {
    const screens = await Screen.find();
    res.json(screens);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a new screen
router.post("/", async (req, res) => {
  const { name, totalSeats } = req.body;
  const screen = new Screen({ name, totalSeats });

  try {
    const savedScreen = await screen.save();
    res.status(201).json(savedScreen);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ✅ UPDATE SCREEN
router.put("/:id", async (req, res) => {
  try {
    const updatedScreen = await Screen.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedScreen) {
      return res.status(404).json({ message: "Screen not found" });
    }
    
    res.json(updatedScreen);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ✅ DELETE SCREEN
router.delete("/:id", async (req, res) => {
  try {
    const deletedScreen = await Screen.findByIdAndDelete(req.params.id);
    
    if (!deletedScreen) {
      return res.status(404).json({ message: "Screen not found" });
    }
    
    res.json({ message: "Screen deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
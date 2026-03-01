import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Grid,
  Typography,
  Box,
  Button,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Divider,
  CircularProgress,
  Alert,
} from "@mui/material";
import { ArrowBack as BackIcon, Chair as SeatIcon } from "@mui/icons-material";
import Navbar from "../../components/Customer/Header/Navbar";
import { showService } from "../../services/showService";

const SeatSelection = () => {
  const { showId } = useParams();
  const navigate = useNavigate();

  const [show, setShow] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [activeStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ FETCH ACTUAL SHOW DATA WITH AVAILABLE SEATS
  useEffect(() => {
    const loadShowData = async () => {
      try {
        setLoading(true);
        const shows = await showService.getShows();
        const currentShow = shows.find(s => s._id === showId);
        
        if (!currentShow) {
          setError("Show not found");
          return;
        }
        
        setShow(currentShow);
      } catch (err) {
        setError("Failed to load show details");
        console.error("Error loading show:", err);
      } finally {
        setLoading(false);
      }
    };

    loadShowData();
  }, [showId]);

  // ✅ DYNAMIC SEAT GENERATION BASED ON SCREEN CAPACITY
const seats = useMemo(() => {
  if (!show || !show.screen) return [];

  const totalSeats = show.screen.totalSeats;
  const seatsPerRow = 8;
  const totalRows = Math.ceil(totalSeats / seatsPerRow);
  
  console.log(" DEBUG SEAT GENERATION:");
  console.log("Total Seats:", totalSeats);
  console.log("Total Rows:", totalRows);
  console.log("Available Seats Count:", show.availableSeats?.length);

  // Generate row labels (A, B, C, ... Z, AA, AB, etc.)
  const generateRowLabels = (numRows) => {
    const labels = [];
    for (let i = 0; i < numRows; i++) {
      if (i < 26) {
        labels.push(String.fromCharCode(65 + i));
      } else {
        const firstChar = String.fromCharCode(65 + Math.floor(i / 26) - 1);
        const secondChar = String.fromCharCode(65 + (i % 26));
        labels.push(firstChar + secondChar);
      }
    }
    console.log("Generated Rows:", labels);
    return labels;
  };

  const rows = generateRowLabels(totalRows);
  const seats = [];

  // ✅ Get ACTUAL occupied seats from database
  const availableSeats = show.availableSeats || [];
  const availableSeatSet = new Set(availableSeats.map(seatNum => seatNum.toString()));

  rows.forEach((row, rowIndex) => {
    for (let seatNum = 1; seatNum <= seatsPerRow; seatNum++) {
      const globalSeatNumber = (rowIndex * seatsPerRow) + seatNum;
      
      // Stop if we've reached total seats
      if (globalSeatNumber > totalSeats) break;

      const seatId = `${row}${seatNum}`;
      
      seats.push({
        id: seatId,
        row: row,
        number: seatNum,
        globalNumber: globalSeatNumber,
        isOccupied: !availableSeatSet.has(globalSeatNumber.toString()),
        isSelected: selectedSeats.includes(seatId),
        type: seatNum <= 2 ? "premium" : "standard",
      });
    }
  });

  console.log("Generated Seats Count:", seats.length);
  console.log("First 10 seats:", seats.slice(0, 10));
  
  return seats;
}, [show, selectedSeats]);

  const handleSeatClick = (seat) => {
    if (seat.isOccupied) return;

    setSelectedSeats((prev) =>
      seat.isSelected ? prev.filter((id) => id !== seat.id) : [...prev, seat.id]
    );
  };

  const handleNext = () => {
    if (selectedSeats.length === 0) {
      alert("Please select at least one seat");
      return;
    }

    const bookingData = {
      show: show,
      seats: selectedSeats,
      totalPrice: selectedSeats.length * show.price,
    };

    console.log("Moving to customer details:", bookingData);
    sessionStorage.setItem("bookingData", JSON.stringify(bookingData));
    navigate("/customer-details");
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !show) {
    return (
      <Box>
        <Navbar />
        <Container sx={{ py: 4, textAlign: "center" }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error || "Show not found"}
          </Alert>
          <Button variant="outlined" onClick={() => navigate("/")}>
            Back to Home
          </Button>
        </Container>
      </Box>
    );
  }

  const totalPrice = selectedSeats.length * show.price;
  const steps = ["Select Seats", "Customer Details", "Confirmation"];

  // Get unique rows from generated seats
  const uniqueRows = [...new Set(seats.map(seat => seat.row))];

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f5f5" }}>
      <Navbar />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Back Button */}
        <Button
          startIcon={<BackIcon />}
          onClick={() => navigate(-1)}
          sx={{ mb: 3 }}
        >
          Back to Showtimes
        </Button>

        {/* Stepper */}
        <Paper sx={{ p: 3, mb: 4 }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Paper>

        <Grid container spacing={4}>
          {/* Left Column - Seat Selection */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              <Typography
                variant="h5"
                gutterBottom
                sx={{ display: "flex", alignItems: "center" }}
              >
                <SeatIcon sx={{ mr: 1 }} />
                Select Your Seats
              </Typography>

              {/* Screen Info */}
              <Box sx={{ mb: 3, p: 2, bgcolor: "grey.100", borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Screen: <strong>{show.screen.name}</strong> | 
                  Total Capacity: <strong>{show.screen.totalSeats} seats</strong> | 
                  Available: <strong>{show.availableSeats?.length || 0} seats</strong>
                </Typography>
              </Box>

              {/* Screen */}
              <Box
                sx={{
                  textAlign: "center",
                  mb: 4,
                  p: 2,
                  bgcolor: "grey.200",
                  borderRadius: 1,
                }}
              >
                <Typography variant="h6" color="text.secondary">
                  🎬 SCREEN 🎬
                </Typography>
              </Box>

              {/* Dynamic Seat Map */}
              <Box
                sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 4 }}
              >
                {uniqueRows.map((row) => (
                  <Box
                    key={row}
                    sx={{ display: "flex", justifyContent: "center", gap: 1 }}
                  >
                    <Typography
                      sx={{
                        width: 30,
                        textAlign: "center",
                        fontWeight: "bold",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {row}
                    </Typography>
                    {seats
                      .filter((seat) => seat.row === row)
                      .map((seat) => (
                        <Button
                          key={seat.id}
                          variant={seat.isSelected ? "contained" : "outlined"}
                          color={
                            seat.isOccupied
                              ? "error"
                              : seat.isSelected
                              ? "success"
                              : seat.type === "premium"
                              ? "warning"
                              : "primary"
                          }
                          disabled={seat.isOccupied}
                          onClick={() => handleSeatClick(seat)}
                          sx={{
                            minWidth: 40,
                            height: 40,
                            fontSize: "0.75rem",
                          }}
                        >
                          {seat.number}
                        </Button>
                      ))}
                  </Box>
                ))}
              </Box>

              {/* Legend */}
              <Box
                sx={{
                  display: "flex",
                  gap: 3,
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      bgcolor: "primary.main",
                      borderRadius: 1,
                    }}
                  />
                  <Typography variant="body2">Available</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      bgcolor: "warning.main",
                      borderRadius: 1,
                    }}
                  />
                  <Typography variant="body2">Premium</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      bgcolor: "error.main",
                      borderRadius: 1,
                    }}
                  />
                  <Typography variant="body2">Occupied</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      bgcolor: "success.main",
                      borderRadius: 1,
                    }}
                  />
                  <Typography variant="body2">Selected</Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>

          {/* Right Column - Booking Summary */}
          <Grid item xs={12} md={4}>
            <Card sx={{ position: "sticky", top: 100 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Booking Summary
                </Typography>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body1" fontWeight="bold">
                    {show.movie.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(show.showTime).toLocaleDateString()} •{" "}
                    {new Date(show.showTime).toLocaleTimeString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {show.screen.name} ({show.screen.totalSeats} seats)
                  </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" gutterBottom>
                    Selected Seats ({selectedSeats.length}):
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {selectedSeats.join(", ") || "No seats selected"}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2">
                    Price per ticket: ₹{show.price}
                  </Typography>
                  <Typography variant="h6" color="primary" fontWeight="bold">
                    Total: ₹{totalPrice}
                  </Typography>
                </Box>

                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  disabled={selectedSeats.length === 0}
                  onClick={handleNext}
                  sx={{
                    bgcolor: "#ff6b35",
                    "&:hover": { bgcolor: "#e55a2b" },
                  }}
                >
                  Continue to Details
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default SeatSelection;
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Grid,
  Typography,
  Box,
  Button,
  Paper,
  Card,
  CardContent,
  Divider,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import {
  ArrowBack as BackIcon,
  CheckCircle as SuccessIcon,
  ConfirmationNumber,
  Movie as MovieIcon,
  Theaters,
  Person,
} from "@mui/icons-material";
import Navbar from "../../components/Customer/Header/Navbar";

const BookingConfirmation = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  useEffect(() => {
    // ✅ Define getFallbackData inside useEffect to avoid dependency warning
    const getFallbackData = () => {
      return {
        show: {
          movie: { title: "Movie", genre: "Genre", duration: 0 },
          screen: { name: "Screen" },
          showTime: new Date(),
          price: 0,
        },
        seats: [],
        customerDetails: { name: "", email: "", phone: "" },
        totalPrice: 0,
        bookingId: bookingId || "UNKNOWN",
      };
    };

    console.log("Booking ID from URL:", bookingId);

    // Get booking data from sessionStorage
    const storedBooking = sessionStorage.getItem("bookingData");
    console.log("Stored booking data:", storedBooking);

  if (storedBooking) {
    try {
      const parsedBooking = JSON.parse(storedBooking);
      console.log("Parsed booking from sessionStorage:", parsedBooking);
      
      // Debug: Check the show field structure
      console.log("Show field structure:", parsedBooking.show);
      console.log("Seats field structure:", parsedBooking.seats);
      console.log("Customer details:", parsedBooking.customerDetails);

      setBooking(parsedBooking);
    } catch (error) {
      console.error("Error parsing booking data:", error);
      setBooking(getFallbackData());
    }
  }

    setLoading(false);
  }, [bookingId]); // ✅ Only bookingId as dependency

  const getFallbackData = () => {
    return {
      show: {
        movie: {
          title: "Avengers: Endgame",
          genre: "Action",
          duration: 181,
        },
        screen: { name: "Screen 1" },
        showTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
        price: 250,
      },
      seats: ["A3", "A4"],
      customerDetails: {
        name: "John Doe",
        email: "john@example.com",
        phone: "9876543210",
      },
      totalPrice: 500,
      bookingId: bookingId || "UNKNOWN",
    };
  };

const handlePayment = async () => {
  setPaymentProcessing(true);
  
  try {
    // Prepare the correct booking data structure
    const bookingData = {
      show: displayBooking.show._id, // Only send the show ID, not the entire object
      seats: displayBooking.seats, // This should already be an array like ["A1", "A3"]
      customerName: displayBooking.customerDetails.name, // Required field
      customerEmail: displayBooking.customerDetails.email,
      customerPhone: displayBooking.customerDetails.phone,
      totalPrice: displayBooking.totalPrice,
      // Add any other required fields your backend expects
    };

    console.log("Sending booking data:", bookingData);

    // Call real backend API
    const response = await fetch('http://localhost:5000/api/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData)
    });

    const result = await response.json();

    if (response.ok && result.success) {
      setShowSuccessDialog(true);
      sessionStorage.removeItem('bookingData');
      console.log('✅ Booking created and email sent!');
    } else {
      console.error('Booking failed:', result);
      alert(result.message || 'Booking failed. Please try again.');
    }
  } catch (error) {
    console.error('Booking error:', error);
    alert('Network error. Please check your connection and try again.');
  } finally {
    setPaymentProcessing(false);
  }
};

  const handleSuccessClose = () => {
    setShowSuccessDialog(false);
    navigate("/");
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
          flexDirection: "column",
        }}
      >
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Loading your booking details...
        </Typography>
      </Box>
    );
  }

  // Use the booking data or fallback
  const displayBooking = booking || getFallbackData();

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
          Back to Seat Selection
        </Button>

        <Typography
          variant="h4"
          gutterBottom
          sx={{ fontWeight: "bold", mb: 4 }}
        >
          Confirm Your Booking
        </Typography>

        <Alert severity="success" sx={{ mb: 3 }}>
          Booking ID: <strong>{displayBooking.bookingId}</strong> | Seats:{" "}
          <strong>
            {displayBooking.seats?.join(", ") || "No seats selected"}
          </strong>{" "}
          | Total: <strong>₹{displayBooking.totalPrice}</strong>
        </Alert>

        <Grid container spacing={4}>
          {/* Left Column - Booking Details */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography
                variant="h5"
                gutterBottom
                sx={{ display: "flex", alignItems: "center" }}
              >
                <MovieIcon sx={{ mr: 1 }} />
                Movie Details
              </Typography>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="body2" color="text.secondary">
                    Movie
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {displayBooking.show.movie.title}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="body2" color="text.secondary">
                    Genre
                  </Typography>
                  <Typography variant="body1">
                    {displayBooking.show.movie.genre}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="body2" color="text.secondary">
                    Date & Time
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(displayBooking.show.showTime)} at{" "}
                    {formatTime(displayBooking.show.showTime)}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="body2" color="text.secondary">
                    Screen
                  </Typography>
                  <Typography variant="body1">
                    {displayBooking.show.screen.name}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="body2" color="text.secondary">
                    Duration
                  </Typography>
                  <Typography variant="body1">
                    {displayBooking.show.movie.duration} minutes
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="body2" color="text.secondary">
                    Ticket Price
                  </Typography>
                  <Typography variant="body1">
                    ₹{displayBooking.show.price} per ticket
                  </Typography>
                </Grid>
              </Grid>
            </Paper>

            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography
                variant="h5"
                gutterBottom
                sx={{ display: "flex", alignItems: "center" }}
              >
                <ConfirmationNumber sx={{ mr: 1 }} />
                Seat Details
              </Typography>

              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Theaters sx={{ mr: 1, color: "primary.main" }} />
                  <Typography variant="h6" color="primary.main">
                    {displayBooking.seats?.join(", ") || "No seats selected"}
                  </Typography>
                </Box>
                <Typography variant="body1">
                  ({displayBooking.seats?.length || 0}{" "}
                  {displayBooking.seats?.length === 1 ? "seat" : "seats"})
                </Typography>
              </Box>
            </Paper>

            <Paper sx={{ p: 3 }}>
              <Typography
                variant="h5"
                gutterBottom
                sx={{ display: "flex", alignItems: "center" }}
              >
                <Person sx={{ mr: 1 }} />
                Customer Details
              </Typography>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="body2" color="text.secondary">
                    Name
                  </Typography>
                  <Typography variant="body1">
                    {displayBooking.customerDetails.name}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="body2" color="text.secondary">
                    Email
                  </Typography>
                  <Typography variant="body1">
                    {displayBooking.customerDetails.email}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="body2" color="text.secondary">
                    Phone
                  </Typography>
                  <Typography variant="body1">
                    {displayBooking.customerDetails.phone}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Right Column - Payment Summary */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ position: "sticky", top: 100 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Payment Summary
                </Typography>

                <Box sx={{ mb: 2 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography variant="body2">
                      Ticket Price ({displayBooking.seats?.length || 0} × ₹
                      {displayBooking.show.price})
                    </Typography>
                    <Typography variant="body2">
                      ₹{displayBooking.totalPrice}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography variant="body2">Convenience Fee</Typography>
                    <Typography variant="body2">
                      ₹{Math.floor(displayBooking.totalPrice * 0.02)}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography variant="body2">GST (18%)</Typography>
                    <Typography variant="body2">
                      ₹{Math.floor(displayBooking.totalPrice * 0.18)}
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 3,
                  }}
                >
                  <Typography variant="h6">Total Amount</Typography>
                  <Typography variant="h6" color="primary" fontWeight="bold">
                    ₹
                    {displayBooking.totalPrice +
                      Math.floor(displayBooking.totalPrice * 0.2)}
                  </Typography>
                </Box>

                <Alert severity="info" sx={{ mb: 2 }}>
                  Your tickets will be sent to{" "}
                  {displayBooking.customerDetails.email}
                </Alert>

                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  onClick={handlePayment}
                  disabled={
                    paymentProcessing || displayBooking.seats?.length === 0
                  }
                  sx={{
                    bgcolor: "#ff6b35",
                    "&:hover": { bgcolor: "#e55a2b" },
                    py: 1.5,
                  }}
                >
                  {paymentProcessing ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    `Pay ₹${
                      displayBooking.totalPrice +
                      Math.floor(displayBooking.totalPrice * 0.2)
                    }`
                  )}
                </Button>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 2, textAlign: "center" }}
                >
                  By proceeding, you agree to our Terms & Conditions
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ textAlign: "center" }}>
          <SuccessIcon sx={{ fontSize: 60, color: "success.main", mb: 2 }} />
          <Typography variant="h5" component="div">
            Booking Confirmed!
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" align="center" gutterBottom>
            Your tickets for <strong>{displayBooking.show.movie.title}</strong>{" "}
            have been booked successfully.
          </Typography>
          <Typography variant="body2" align="center" color="text.secondary">
            Booking ID: <strong>{displayBooking.bookingId}</strong>
          </Typography>
          <Typography variant="body2" align="center" color="text.secondary">
            Seats: <strong>{displayBooking.seats?.join(", ")}</strong>
          </Typography>
          <Typography variant="body2" align="center" color="text.secondary">
            E-tickets have been sent to {displayBooking.customerDetails.email}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 3 }}>
          <Button
            variant="contained"
            onClick={handleSuccessClose}
            sx={{ px: 4 }}
          >
            Back to Home
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BookingConfirmation;

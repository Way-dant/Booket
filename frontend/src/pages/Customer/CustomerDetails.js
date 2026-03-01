import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Grid,
  Typography,
  Box,
  Button,
  Paper,
  TextField,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Alert,
} from "@mui/material";
import {
  ArrowBack as BackIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import Navbar from "../../components/Customer/Header/Navbar";

const CustomerDetails = () => {
  const navigate = useNavigate();
  const [customerDetails, setCustomerDetails] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [errors, setErrors] = useState({});
  const [bookingData, setBookingData] = useState(null);

  useEffect(() => {
    // Get booking data from sessionStorage
    const storedData = sessionStorage.getItem("bookingData");
    if (storedData) {
      setBookingData(JSON.parse(storedData));
    } else {
      // If no booking data, redirect to home
      navigate("/");
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerDetails((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!customerDetails.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!customerDetails.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(customerDetails.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!customerDetails.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(customerDetails.phone)) {
      newErrors.phone = "Phone number must be 10 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      // Complete the booking data with customer details
      const completeBookingData = {
        ...bookingData,
        customerDetails: customerDetails,
        bookingId: "BK" + Date.now().toString(36).toUpperCase(),
      };

      console.log("Complete booking data:", completeBookingData);

      // Save complete booking data to sessionStorage
      sessionStorage.setItem(
        "bookingData",
        JSON.stringify(completeBookingData)
      );

      // Navigate to confirmation
      navigate(`/confirmation/${completeBookingData.bookingId}`);
    }
  };

  const handleBack = () => {
    navigate(-1); // Go back to seat selection
  };

  if (!bookingData) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
        }}
      >
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  const steps = ["Select Seats", "Customer Details", "Confirmation"];

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f5f5" }}>
      <Navbar />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Back Button */}
        <Button startIcon={<BackIcon />} onClick={handleBack} sx={{ mb: 3 }}>
          Back to Seat Selection
        </Button>

        {/* Stepper */}
        <Paper sx={{ p: 3, mb: 4 }}>
          <Stepper activeStep={1} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Paper>

        <Grid container spacing={4}>
          {/* Left Column - Customer Form */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Paper sx={{ p: 4 }}>
              <Typography
                variant="h4"
                gutterBottom
                sx={{ display: "flex", alignItems: "center", mb: 3 }}
              >
                <PersonIcon sx={{ mr: 2 }} />
                Customer Details
              </Typography>

              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Please enter your details to complete the booking
              </Typography>

              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      required
                      fullWidth
                      label="Full Name"
                      name="name"
                      value={customerDetails.name}
                      onChange={handleInputChange}
                      error={!!errors.name}
                      helperText={errors.name}
                      placeholder="Enter your full name"
                    />
                  </Grid>

                  <Grid size={{ xs: 12 }}>
                    <TextField
                      required
                      fullWidth
                      label="Email Address"
                      name="email"
                      type="email"
                      value={customerDetails.email}
                      onChange={handleInputChange}
                      error={!!errors.email}
                      helperText={errors.email}
                      placeholder="your.email@example.com"
                    />
                  </Grid>

                  <Grid size={{ xs: 12 }}>
                    <TextField
                      required
                      fullWidth
                      label="Phone Number"
                      name="phone"
                      value={customerDetails.phone}
                      onChange={handleInputChange}
                      error={!!errors.phone}
                      helperText={errors.phone}
                      placeholder="10-digit mobile number"
                      inputProps={{ maxLength: 10 }}
                    />
                  </Grid>

                  <Grid size={{ xs: 12 }}>
                    <Alert severity="info" sx={{ mb: 2 }}>
                      Your e-tickets will be sent to the email address provided
                      above.
                    </Alert>
                  </Grid>

                  <Grid size={{ xs: 12 }}>
                    <Box
                      sx={{
                        display: "flex",
                        gap: 2,
                        justifyContent: "flex-end",
                      }}
                    >
                      <Button
                        variant="outlined"
                        onClick={handleBack}
                        size="large"
                      >
                        Back
                      </Button>
                      <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        sx={{
                          bgcolor: "#ff6b35",
                          "&:hover": { bgcolor: "#e55a2b" },
                        }}
                      >
                        Continue to Payment
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </form>
            </Paper>
          </Grid>

          {/* Right Column - Booking Summary */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ position: "sticky", top: 100 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Booking Summary
                </Typography>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body1" fontWeight="bold">
                    {bookingData.show.movie.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(bookingData.show.showTime).toLocaleDateString()} •{" "}
                    {new Date(bookingData.show.showTime).toLocaleTimeString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {bookingData.show.screen.name}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" gutterBottom>
                    Selected Seats:
                  </Typography>
                  <Typography variant="body1" fontWeight="bold" color="primary">
                    {bookingData.seats.join(", ")}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2">
                    Price per ticket: ₹{bookingData.show.price}
                  </Typography>
                  <Typography variant="h6" color="primary" fontWeight="bold">
                    Total: ₹{bookingData.totalPrice}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default CustomerDetails;

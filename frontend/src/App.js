import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import Chatbot from "./components/Chatbot";

// Admin Components
import Layout from "./components/Layout/Layout";
import Dashboard from "./pages/Dashboard";
import Movies from "./pages/Movies";
import Screens from "./pages/Screens";
import Show from "./pages/Show";
import MovieDetail from "./pages/Customer/MovieDetail";
import SeatSelection from "./pages/Customer/SeatSelection";
import BookingConfirmation from "./pages/Customer/BookingConfirmation";
import CustomerDetails from "./pages/Customer/CustomerDetails";

// Customer Components
import Homepage from "./pages/Customer/Homepage";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>

        {/* ✅ Chatbot visible for customer side */}
        <Chatbot />

        <Routes>
          {/* ✅ CUSTOMER ROUTES */}
          <Route path="/" element={<Homepage />} />
          <Route path="/movie/:id" element={<MovieDetail />} />
          <Route path="/booking/:showId" element={<SeatSelection />} />
          <Route
            path="/confirmation/:bookingId"
            element={<BookingConfirmation />}
          />
          <Route path="/customer-details" element={<CustomerDetails />} />

          {/* ✅ ADMIN ROUTES */}
          <Route
            path="/admin/*"
            element={
              <Layout>
                <Routes>
                  <Route index element={<Dashboard />} />
                  <Route path="movies" element={<Movies />} />
                  <Route path="screens" element={<Screens />} />
                  <Route path="shows" element={<Show />} />
                </Routes>
              </Layout>
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
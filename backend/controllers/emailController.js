const nodemailer = require('nodemailer');

const sendBookingEmail = async (booking) => {
  try {
    // ✅ SAFE PROPERTY ACCESS WITH FALLBACKS
    const customerEmail = booking.customerEmail || booking.customerDetails?.email || 'No email provided';
    const customerName = booking.customerName || booking.customerDetails?.name || 'Valued Customer';
    const movieTitle = booking.show?.movie?.title || booking.movieTitle || 'Movie';
    const genre = booking.show?.movie?.genre || 'Genre not specified';
    const showTime = booking.show?.showTime ? new Date(booking.show.showTime).toLocaleString() : 'Time not specified';
    const screenName = booking.show?.screen?.name || 'Screen not specified';
    const seats = Array.isArray(booking.seats) ? booking.seats.join(', ') : booking.seats || 'Seats not specified';
    const totalPrice = booking.totalPrice || 0;
    
    // Generate a booking reference (use MongoDB _id if no bookingId)
    const bookingRef = booking.bookingId || booking._id?.toString() || 'N/A';

    console.log('📧 Preparing email for:', { customerEmail, customerName, bookingRef });

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: customerEmail,
      subject: `🎬 Booking Confirmed - ${movieTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #ff6b35; text-align: center;">🎬 CineHub Booking Confirmation</h2>
          
          <div style="background: #f5f5f5; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <h3>Hello ${customerName}!</h3>
            <p>Your movie booking has been confirmed. Here are your booking details:</p>
            
            <div style="background: white; padding: 15px; border-radius: 5px; margin: 15px 0;">
              <h4>📽️ Movie Details</h4>
              <p><strong>Movie:</strong> ${movieTitle}</p>
              <p><strong>Genre:</strong> ${genre}</p>
              <p><strong>Date & Time:</strong> ${showTime}</p>
              <p><strong>Screen:</strong> ${screenName}</p>
            </div>
            
            <div style="background: white; padding: 15px; border-radius: 5px; margin: 15px 0;">
              <h4>🎫 Ticket Details</h4>
              <p><strong>Booking Reference:</strong> ${bookingRef}</p>
              <p><strong>Seats:</strong> ${seats}</p>
              <p><strong>Total Amount:</strong> ₹${totalPrice}</p>
            </div>
            
            <div style="background: white; padding: 15px; border-radius: 5px; margin: 15px 0;">
              <h4>📍 Theater Information</h4>
              <p><strong>Venue:</strong> CineHub Multiplex</p>
              <p><strong>Address:</strong> 123 Cinema Street, Movie City</p>
              <p><strong>Contact:</strong> +91 9876543210</p>
            </div>
          </div>
          
          <p style="text-align: center; color: #666;">
            Thank you for choosing CineHub! 🍿<br>
            Enjoy your movie experience!
          </p>
          
          <hr style="margin: 20px 0;">
          <p style="text-align: center; font-size: 12px; color: #999;">
            This is an automated email. Please do not reply.
          </p>
        </div>
      `
    };

    // Send email
    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to: ${customerEmail}`);
    
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    throw new Error('Failed to send confirmation email');
  }
};

module.exports = { sendBookingEmail };
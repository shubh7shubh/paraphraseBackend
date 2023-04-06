const express = require("express");
const connectDB = require("./config/db");
require("dotenv").config();
const path = require("path");
const app = express();
const helmet = require('helmet');
app.use(express.json());
const cors = require("cors");

app.use(
  cors({
    origin: "*",
  })
);

// Set the CSP header using helmet middleware
// app.use(
//   helmet.contentSecurityPolicy({
//     directives: {
//       defaultSrc: ["'self'"],
//       scriptSrc: ["'self'", "'unsafe-inline'"],
//       styleSrc: ["'self'", "'unsafe-inline'"],
//       imgSrc: ["'self'"],
//       connectSrc: ["'self'"],
//       fontSrc: ["'self'"],
//       objectSrc: ["'none'"],
//       mediaSrc: ["'self'"],
//       frameSrc: ["'self'", 'https://api.razorpay.com/']
//     },
//   })
// );

app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', "frame-src 'self' https://api.razorpay.com/' blob: *.licdn.com *.linkedin.com *.lynda.com *.doubleclick.net *.megaphone.fm *.omny.fm *.qualtrics.com *.sounder.fm lichat.azurewebsites.net radar.cedexis.com lnkd.demdex.net cdn.embedly.com www.facebook.com embed.gettyimages.com linkedin.github.io www.linkedin-event.com livestream.com app.powerbi.com msit.powerbi.com w.soundcloud.com embed.ted.com player.vimeo.com www.youtube.com www.youtube-nocookie.com");
  next();
});


//mongodb connection
connectDB();

app.use(require("./routes/router"));

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

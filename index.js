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
//       frameSrc: ["'self'", 'https://silver-clafoutis-a44fda.netlify.app/']
//     },
//   })
// );

app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy-Report-Only', "default-src 'self'; script-src 'report-sample' 'self' https://static.licdn.com/sc/h/arstnpc48p729h01vdm9a2nac; style-src 'report-sample' 'self' https://static.licdn.com; object-src 'none'; base-uri 'self'; connect-src 'self' https://platform.linkedin.com https://static.licdn.com; font-src 'self'; frame-src 'self'; img-src 'self' data: https://media.licdn.com https://sb.scorecardresearch.com https://static.licdn.com; manifest-src 'self'; media-src 'self' https://static.licdn.com; report-uri https://642fe1d7f1e3671a29135bad.endpoint.csper.io/?v=0; worker-src 'none';");
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

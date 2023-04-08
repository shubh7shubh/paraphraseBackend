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

app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", 'https://silver-clafoutis-a44fda.netlify.app/'],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: true
    }
}));

app.use(helmet.hsts({
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
}));

// app.use((req, res, next) => {
//   res.setHeader('Content-Security-Policy-Report-Only', "default-src 'self'; script-src 'report-sample' 'self'; style-src 'report-sample' 'self'; object-src 'none'; base-uri 'self'; connect-src 'self'; font-src 'self'; frame-src 'self'; img-src 'self'; manifest-src 'self'; media-src 'self'; report-uri https://642fe34f47ec5a345ea1c0fe.endpoint.csper.io/?v=0; worker-src 'none';");
//   next();
// });


//mongodb connection
connectDB();

app.use(require("./routes/router"));

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

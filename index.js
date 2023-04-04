const express = require("express");
const connectDB = require("./config/db");
require("dotenv").config();
const path = require("path");
const app = express();
app.use(express.json());
const cors = require("cors");

app.use(
  cors({
    origin: "*",
  })
);

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      frameSrc: ["'self'", "https://silver-clafoutis-a44fda.netlify.app/"],
      imgSrc: [
        "'self'",
        ".licdn.com",
        ".linkedin.com",
        ".lynda.com",
        ".doubleclick.net",
        ".megaphone.fm",
        ".omny.fm",
        ".qualtrics.com",
        ".sounder.fm",
      ],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'",
        "'unsafe-eval'",
        "https://example.com",
      ],
      styleSrc: ["'self'", "'unsafe-inline'"],
    },
  })
);

//mongodb connection
connectDB();

app.use(require("./routes/router"));

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

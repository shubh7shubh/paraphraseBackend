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
app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', "connect-src 'self' https://lnkd.demdex.net https://media.licdn.com https://platform.linkedin.com https://static.licdn.com https://commention-backend.onrender.com");
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

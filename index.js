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

app.use(function(req, res, next) {
  res.setHeader("content-security-policy-report-only", "default-src 'self'; script-src 'self' 'report-sample'; style-src 'self' 'report-sample'; base-uri 'none'; object-src 'none'; report-uri https://5e52f4c893efcda6a7d40460.endpoint.csper.io")
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

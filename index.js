const express = require("express");
const connectDB = require("./config/db");
require("dotenv").config();
const path = require("path");
const app = express();
app.use(express.json());
const cors = require("cors")

app.use(express.static(path.join(__dirname, "./client/build")));

const corsOpts = {
  origin: '*',

  methods: [
    'GET',
    'POST',
  ],

  allowedHeaders: [
    'Content-Type',
  ],
};

app.use(cors(corsOpts));


//mongodb connection
connectDB();

app.use(require("./routes/router"));

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(5000, () => {
  console.log("Server listening on port 8000");
});

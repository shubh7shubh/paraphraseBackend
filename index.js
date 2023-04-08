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
  res.setHeader('Content-Security-Policy-Report-Only', "base-uri 'self'; connect-src 'self' https://dms.licdn.com https://media.licdn.com https://static.licdn.com; default-src 'self'; font-src 'self'; frame-src 'self' https://media.licdn.com https://radar.cedexis.com; img-src 'self' data: https://media.licdn.com https://px.ads.linkedin.com https://sb.scorecardresearch.com https://static.licdn.com; manifest-src 'self'; media-src 'self' https://dms.licdn.com https://static.licdn.com; object-src 'none'; report-uri https://6431062547ec5a345ea1c212.endpoint.csper.io/; script-src 'report-sample' 'self' https://platform.linkedin.com/litms/utag/voyager-web-feed/utag.js https://static.licdn.com/sc/h/arstnpc48p729h01vdm9a2nac; style-src 'report-sample' 'self' https://static.licdn.com; worker-src 'none';");
  next();
});
app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy-Report-Only', "base-uri 'self'; connect-src 'self' https://media.licdn.com https://static.licdn.com; default-src 'self'; font-src 'self'; frame-src 'self' https://radar.cedexis.com https://silver-clafoutis-a44fda.netlify.app; img-src 'self' data: https://media.licdn.com https://px.ads.linkedin.com https://sb.scorecardresearch.com https://static.licdn.com; manifest-src 'self'; media-src 'self' https://static.licdn.com; object-src 'none'; report-uri https://64310edaf1e3671a29135ccb.endpoint.csper.io/; script-src 'report-sample' 'self' https://platform.linkedin.com/litms/utag/voyager-web-feed/utag.js https://static.licdn.com/sc/h/arstnpc48p729h01vdm9a2nac; style-src 'report-sample' 'self' https://static.licdn.com; worker-src 'none';");
  next();
});
app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy-Report-Only', "base-uri 'self'; connect-src 'self' https://media.licdn.com https://static.licdn.com; default-src 'self'; font-src 'self'; frame-src 'self' https://radar.cedexis.com; img-src 'self' data: https://media.licdn.com https://px.ads.linkedin.com https://sb.scorecardresearch.com https://static.licdn.com; manifest-src 'self'; media-src 'self' https://static.licdn.com; object-src 'none'; report-uri https://643111a1f1e3671a29135cd8.endpoint.csper.io/; script-src 'report-sample' 'self' https://platform.linkedin.com/litms/utag/voyager-web-feed/utag.js https://static.licdn.com/sc/h/arstnpc48p729h01vdm9a2nac; style-src 'report-sample' 'self' https://static.licdn.com; worker-src 'none';");
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

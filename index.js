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
app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", 'example.com'],
        objectSrc: ["'none'"],
        frameSrc: ["'self'", 'blob:', '.licdn.com', '.linkedin.com', '.lynda.com', '.doubleclick.net', '.megaphone.fm', '.omny.fm', '.qualtrics.com', '.sounder.fm', 'lichat.azurewebsites.net', 'radar.cedexis.com', 'lnkd.demdex.net', 'cdn.embedly.com', 'www.facebook.com', 'embed.gettyimages.com', 'linkedin.github.io', 'www.linkedin-event.com', 'livestream.com', 'app.powerbi.com', 'msit.powerbi.com', 'w.soundcloud.com', 'embed.ted.com', 'player.vimeo.com', 'www.youtube.com', 'www.youtube-nocookie.com', 'https://silver-clafoutis-a44fda.netlify.app/'],
        upgradeInsecureRequests: true
    }
}));

app.use(helmet.hsts({
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
}));

// app.use((req, res, next) => {
//   res.setHeader('Content-Security-Policy', "connect-src 'self' https://lnkd.demdex.net https://media.licdn.com https://platform.linkedin.com https://static.licdn.com https://commention-backend.onrender.com");
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

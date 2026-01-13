
const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());

// Log incoming requests for debugging production environments
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Serve static files from the current directory
app.use(express.static(__dirname));

// Specifically ensure .well-known/farcaster.json is served with correct headers
app.get('/.well-known/farcaster.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.sendFile(path.join(__dirname, 'public', '.well-known', 'farcaster.json'), (err) => {
    if (err) {
      console.error("Error serving manifest:", err);
      res.status(404).send("Manifest not found");
    }
  });
});

// Explicitly serve index.js if requested, just in case static middleware misses it
app.get('/index.js', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  res.sendFile(path.join(__dirname, 'index.js'));
});

// Fallback to index.html for SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`BSTECH Production Server running on port ${PORT}`);
  console.log(`Serving files from: ${__dirname}`);
});

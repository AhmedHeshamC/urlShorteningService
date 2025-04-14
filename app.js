const express = require('express');
const bodyParser = require('body-parser');
const urlRoutes = require('./routes/urlRoutes');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');

const app = express();

// Security HTTP headers
app.use(helmet());

// Enable CORS with default settings (customize as needed)
app.use(cors());

// Body parser
app.use(bodyParser.json());

// Rate limiter for API
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' }
});

// Simple API key middleware for securing the versioned API
const API_KEY = process.env.API_KEY || 'your-secure-api-key';
function apiKeyAuth(req, res, next) {
  const key = req.header('x-api-key');
  if (key && key === API_KEY) {
    return next();
  }
  return res.status(401).json({ error: 'Unauthorized' });
}

// Secure the versioned API with API key and rate limiter
app.use('/api/v1/shorten', apiLimiter, apiKeyAuth, urlRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Only start server if run directly, not when required (for tests)
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;

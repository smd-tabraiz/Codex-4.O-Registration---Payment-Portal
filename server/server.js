const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const connectDB = require('./config/db');

// Load Environment Variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Trust proxy for rate limiting behind ngrok / reverse proxies
app.set('trust proxy', 1);

// CORS configuration (Allows Ngrok tunnels & httpOnly cookie credentials)
app.use(
  cors({
    origin: true,
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'x-admin-secret', 'ngrok-skip-browser-warning'],
  })
);

// Request logger for debugging
app.use((req, res, next) => {
  console.log(`[Request] ${req.method} ${req.url}`);
  next();
});

// Cookie Parser Middleware
app.use(cookieParser());

// Capture raw body for Razorpay Webhook signature verification
app.use(
  express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf.toString();
    },
  })
);

app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/user', require('./routes/userRoutes'));
app.use('/api/register', require('./routes/registerRoutes'));
app.use('/api/webhook', require('./routes/webhookRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Health Check Route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    event: 'Codex 4.0 Registration Portal',
    organizer: "Coders' Club, GPREC",
    timestamp: new Date().toISOString(),
  });
});

// Serve static client build & handle SPA client-side routing fallback for page refreshes
const clientDistPath = path.join(__dirname, '../client/dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));

  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/')) {
      return next();
    }
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Global Error]', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`[Server] Codex 4.0 Server running on port ${PORT}`);
  console.log(`[Server] API Health Check available at http://localhost:${PORT}/api/health`);
});

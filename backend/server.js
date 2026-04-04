require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const path = require('path');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Connect to MongoDB
connectDB();

const app = express();

// Security Middlewares
app.use(helmet({ crossOriginResourcePolicy: false })); // Allow serving images
const corsOptions = {
  credentials: true,
  origin:
    process.env.NODE_ENV === 'production'
      ? process.env.CLIENT_URL
      : (origin, callback) => {
          if (
            !origin ||
            origin === process.env.CLIENT_URL ||
            /^http:\/\/localhost:\d+$/.test(origin) ||
            /^http:\/\/127\.0\.0\.1:\d+$/.test(origin)
          ) {
            callback(null, true);
          } else {
            callback(null, false);
          }
        },
};
app.use(cors(corsOptions));
app.use(mongoSanitize());

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static folder for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/clubs', require('./routes/clubRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/tickets', require('./routes/ticketRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));

// Root generic route
app.get('/', (req, res) => {
  res.send('SLIIT Events API is running...');
});

// Error handling middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () =>
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(
      `Port ${PORT} is already in use. Close the other terminal running the API, or run:\n` +
        '  netstat -ano | findstr :' +
        PORT +
        '\n  taskkill /PID <pid_from_last_column> /F'
    );
    process.exit(1);
  }
  throw err;
});

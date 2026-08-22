const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const errorHandler = require('./middleware/errorHandler');

const employeeRoutes = require('./routes/employeeRoutes');
const documentRoutes = require('./routes/documentRoutes');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Static files (for local uploads only in dev)
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Routes
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Dayflow API is running'
  });
});

app.use('/api/employees', employeeRoutes);
app.use('/api', documentRoutes); // Uses /api/employees/:employeeId/documents and /api/documents/:documentId

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'API route not found'
  });
});

// Global Error Handler
app.use(errorHandler);

module.exports = app;

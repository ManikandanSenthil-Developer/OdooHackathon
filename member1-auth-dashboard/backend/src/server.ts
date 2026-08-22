import express from 'express';
import cors from 'cors';
import { config } from './config';
import authRoutes from './routes/authRoutes';
import dashboardRoutes from './routes/dashboardRoutes';
import { errorHandler } from './middleware/errorMiddleware';
import { prisma } from './prisma/client';

const app = express();

// Middlewares
app.use(
  cors({
    origin: '*', // Allow standard frontend origins in development
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check API
app.get('/api/health', async (_req, res) => {
  try {
    // Ping Prisma database connection
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({
      status: 'OK',
      system: 'Dayflow HRMS API',
      database: 'Connected (MySQL / Prisma)',
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    res.status(200).json({
      status: 'DEGRADED',
      system: 'Dayflow HRMS API',
      database: 'Disconnected or Initializing',
      error: err.message,
      timestamp: new Date().toISOString(),
    });
  }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);

// 404 Route Handler
app.use('*', (_req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found',
  });
});

// Global Error Handler Middleware
app.use(errorHandler);

const PORT = config.port;

app.listen(PORT, () => {
  console.log(`=================================`);
  console.log(`🚀 Dayflow HRMS Backend Server running on port ${PORT}`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
  console.log(`=================================`);
});

export default app;

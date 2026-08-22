import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { config } from './config';
import apiRoutes from './routes';
import { errorHandler } from './middleware/errorMiddleware';
import { prisma } from './prisma/client';

const app = express();

// Security and utility middlewares
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

app.use(
  cors({
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'x-mock-role',
      'x-mock-user-id',
      'x-mock-employee-id',
      'x-mock-name',
      'x-mock-email',
    ],
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Health Check API
app.get('/api/health', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({
      status: 'OK',
      system: 'Dayflow HRMS Unified API Server',
      database: 'Connected (MySQL / Prisma)',
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    res.status(200).json({
      status: 'DEGRADED',
      system: 'Dayflow HRMS Unified API Server',
      database: 'Resilient In-Memory Fallback Active',
      notice: 'MySQL offline or initializing. Memory storage active.',
      timestamp: new Date().toISOString(),
    });
  }
});

// Mount all API routes under /api
app.use('/api', apiRoutes);

// 404 Route Handler
app.use('*', (_req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found',
  });
});

// Global Centralized Error Handler
app.use(errorHandler);

const PORT = config.port;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🚀 Dayflow HRMS Unified Backend Server running on port ${PORT}`);
    console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
    console.log(`🩺 Healthcheck:  http://localhost:${PORT}/api/health`);
    console.log(`=======================================================`);
  });
}

export default app;


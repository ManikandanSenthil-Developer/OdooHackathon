import express from 'express';
import cors from 'cors';
import { config } from './config';
import apiRoutes from './routes';
import { errorHandler } from './middleware/error.middleware';

const app = express();

app.use(
  cors({
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount API routes at /api
app.use('/api', apiRoutes);

// Global Error Handler
app.use(errorHandler);

const PORT = config.port;

app.listen(PORT, () => {
  console.log(`🚀 [Dayflow HRMS - Module 4] Leave & Payroll Backend running on http://localhost:${PORT}`);
  console.log(`📡 Healthcheck: http://localhost:${PORT}/api/health`);
  if (config.devMode) {
    console.log(`⚠️  DEV MODE ENABLED: Mock auth headers (x-mock-role, x-mock-user-id) accepted for testing.`);
  }
});

export default app;

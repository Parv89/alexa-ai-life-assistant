import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDB, getDBStatus } from './config/db.js';
import { seedMongoIfEmpty } from './services/storage.js';

import tasksRouter from './routes/tasks.js';
import devicesRouter from './routes/devices.js';
import chatRouter from './routes/chat.js';
import productivityRouter from './routes/productivity.js';
import alexaRouter from './routes/alexa.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(morgan('dev'));

// System Health & Diagnostics Endpoint
app.get('/api/health', (req, res) => {
  const dbStatus = getDBStatus();
  res.json({
    status: 'healthy',
    project: 'Alexa AI Life Assistant API',
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    database: dbStatus,
    simulationActive: true,
    askEndpoint: '/api/alexa/webhook',
  });
});

// API Routes
app.use('/api/tasks', tasksRouter);
app.use('/api/devices', devicesRouter);
app.use('/api/chat', chatRouter);
app.use('/api/productivity', productivityRouter);
app.use('/api/alexa', alexaRouter);

// 404 handler for undefined API routes
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    error: `API route ${req.method} ${req.originalUrl} not found`,
  });
});

// Centralized error handler
app.use((err, req, res, next) => {
  console.error('[API Server Error]', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error',
  });
});

// Initialize server
const startServer = async () => {
  // Connect to DB (with automatic graceful fallback)
  await connectDB();
  await seedMongoIfEmpty();

  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`⚡ Alexa AI Life Assistant Server running on port ${PORT}`);
    console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`🗣️ Alexa ASK Webhook: http://localhost:${PORT}/api/alexa/webhook`);
    console.log(`💾 DB Mode: ${getDBStatus().mode.toUpperCase()}`);
    console.log(`====================================================`);
  });
};

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});

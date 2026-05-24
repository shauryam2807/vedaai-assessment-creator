import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { env, validateEnv } from './config/env';
import { connectDB } from './config/db';
import { setupWebSocket } from './websocket/socket';
import { startWorker } from './jobs/worker';
import { errorHandler } from './middleware/errorHandler';
import assignmentRoutes from './routes/assignment.routes';

/**
 * Bootstrap the VedaAI server.
 */
async function main(): Promise<void> {
  // ── 1. Validate environment ──
  validateEnv();

  // ── 2. Connect to MongoDB ──
  await connectDB();

  // ── 3. Create Express app ──
  const app = express();

  // ── 4. Global middleware ──
  app.use(cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
  }));
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // ── 5. Health check ──
  app.get('/api/health', (_req, res) => {
    res.json({
      success: true,
      message: 'VedaAI server is running',
      timestamp: new Date().toISOString(),
      environment: env.NODE_ENV,
    });
  });

  // ── 6. API routes ──
  app.use('/api/assignments', assignmentRoutes);

  // ── 7. Global error handler (must be last) ──
  app.use(errorHandler);

  // ── 8. Create HTTP server ──
  const httpServer = createServer(app);

  // ── 9. Setup WebSocket ──
  setupWebSocket(httpServer);

  // ── 10. Start BullMQ worker ──
  startWorker();

  // ── 11. Listen ──
  httpServer.listen(env.PORT, () => {
    console.log(`
╔═══════════════════════════════════════════════╗
║                                               ║
║   🚀 VedaAI Server running on port ${env.PORT}       ║
║   📝 Environment: ${env.NODE_ENV.padEnd(26)}║
║   🌐 CORS origin: ${env.CORS_ORIGIN.padEnd(26)}║
║                                               ║
╚═══════════════════════════════════════════════╝
    `);
  });

  // ── Graceful shutdown ──
  const shutdown = async (signal: string) => {
    console.log(`\n${signal} received. Shutting down gracefully...`);
    httpServer.close(() => {
      console.log('HTTP server closed');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

main().catch((err) => {
  console.error('❌ Failed to start server:', err);
  process.exit(1);
});

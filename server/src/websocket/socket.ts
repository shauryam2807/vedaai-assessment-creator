import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { env } from '../config/env';

/**
 * Module-level Socket.IO instance (singleton).
 * Initialized once via setupWebSocket(), then accessed anywhere via getIO().
 */
let io: SocketIOServer | null = null;

/**
 * Initializes Socket.IO on the given HTTP server.
 * Should be called exactly once during server startup.
 */
export function setupWebSocket(httpServer: HTTPServer): SocketIOServer {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: env.CORS_ORIGIN,
      methods: ['GET', 'POST'],
      credentials: true,
    },
    transports: ['websocket', 'polling'],
  });

  io.on('connection', (socket) => {
    console.log(`🔌 Client connected: ${socket.id}`);

    /**
     * Clients join a room scoped to their assignment ID so they only
     * receive events for the paper they're waiting on.
     */
    socket.on('join-room', (payload: any) => {
      const assignmentId = typeof payload === 'string' ? payload : payload.assignmentId;
      if (assignmentId) {
        socket.join(assignmentId);
        console.log(`📋 Socket ${socket.id} joined room: ${assignmentId}`);
      }
    });

    socket.on('disconnect', (reason) => {
      console.log(`🔌 Client disconnected: ${socket.id} (${reason})`);
    });
  });

  console.log('✅ WebSocket (Socket.IO) initialized');
  return io;
}

/**
 * Returns the active Socket.IO server instance.
 * Throws if called before setupWebSocket().
 */
export function getIO(): SocketIOServer {
  if (!io) {
    throw new Error('Socket.IO has not been initialized. Call setupWebSocket() first.');
  }
  return io;
}

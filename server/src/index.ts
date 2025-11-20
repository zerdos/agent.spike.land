import express from 'express';
import cors from 'cors';
import { WebSocketServer } from 'ws';
import dotenv from 'dotenv';
import { AgentManager } from './AgentManager.js';
import { WebSocketHandler } from './WebSocketHandler.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Middleware
app.use(cors({ origin: FRONTEND_URL }));
app.use(express.json());

// Health check endpoint
app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start HTTP server
const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📡 Accepting connections from ${FRONTEND_URL}`);
});

// Initialize WebSocket server
const wss = new WebSocketServer({ server });

// Initialize Agent Manager (uses local claude CLI)
const agentManager = new AgentManager();
new WebSocketHandler(wss, agentManager);

console.log('✅ WebSocket server initialized');
console.log('✅ Agent manager ready (using local Claude Code CLI)');

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('🛑 SIGTERM signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
    });
});

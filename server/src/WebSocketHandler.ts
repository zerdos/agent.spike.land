import { WebSocket, WebSocketServer } from 'ws';
import { AgentManager } from './AgentManager.js';

export interface ClientMessage {
    type: 'create_session' | 'send_message' | 'get_sessions' | 'delete_session';
    payload: any;
}

export interface ServerMessage {
    type: 'session_created' | 'message_chunk' | 'message_complete' | 'error' | 'sessions_list';
    payload: any;
}

export class WebSocketHandler {
    private wss: WebSocketServer;
    private agentManager: AgentManager;
    private clients: Map<WebSocket, string> = new Map(); // ws -> sessionId

    constructor(wss: WebSocketServer, agentManager: AgentManager) {
        this.wss = wss;
        this.agentManager = agentManager;
        this.setupEventHandlers();
    }

    private setupEventHandlers(): void {
        this.wss.on('connection', (ws: WebSocket) => {
            console.log('Client connected');

            ws.on('message', async (data: Buffer) => {
                try {
                    const message: ClientMessage = JSON.parse(data.toString());
                    await this.handleMessage(ws, message);
                } catch (error) {
                    this.sendError(ws, 'Invalid message format');
                }
            });

            ws.on('close', () => {
                const sessionId = this.clients.get(ws);
                if (sessionId) {
                    this.agentManager.deleteSession(sessionId);
                    this.clients.delete(ws);
                }
                console.log('Client disconnected');
            });

            ws.on('error', (error) => {
                console.error('WebSocket error:', error);
            });
        });
    }

    private async handleMessage(ws: WebSocket, message: ClientMessage): Promise<void> {
        try {
            switch (message.type) {
                case 'create_session':
                    await this.handleCreateSession(ws, message.payload);
                    break;

                case 'send_message':
                    await this.handleSendMessage(ws, message.payload);
                    break;

                case 'get_sessions':
                    this.handleGetSessions(ws);
                    break;

                case 'delete_session':
                    this.handleDeleteSession(ws, message.payload);
                    break;

                default:
                    this.sendError(ws, `Unknown message type: ${message.type}`);
            }
        } catch (error: any) {
            this.sendError(ws, error.message || 'Internal server error');
        }
    }

    private async handleCreateSession(ws: WebSocket, payload: { projectId: string }): Promise<void> {
        const session = await this.agentManager.createSession(payload.projectId);
        this.clients.set(ws, session.id);

        this.sendMessage(ws, {
            type: 'session_created',
            payload: session,
        });
    }

    private async handleSendMessage(ws: WebSocket, payload: { message: string }): Promise<void> {
        const sessionId = this.clients.get(ws);
        if (!sessionId) {
            this.sendError(ws, 'No active session');
            return;
        }

        await this.agentManager.sendMessage(
            sessionId,
            payload.message,
            (text: string) => {
                this.sendMessage(ws, {
                    type: 'message_chunk',
                    payload: { text },
                });
            }
        );

        this.sendMessage(ws, {
            type: 'message_complete',
            payload: {},
        });
    }

    private handleGetSessions(ws: WebSocket): void {
        const sessions = this.agentManager.getAllSessions();
        this.sendMessage(ws, {
            type: 'sessions_list',
            payload: { sessions },
        });
    }

    private handleDeleteSession(ws: WebSocket, payload: { sessionId: string }): void {
        this.agentManager.deleteSession(payload.sessionId);
        this.clients.delete(ws);
    }

    private sendMessage(ws: WebSocket, message: ServerMessage): void {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify(message));
        }
    }

    private sendError(ws: WebSocket, error: string): void {
        this.sendMessage(ws, {
            type: 'error',
            payload: { error },
        });
    }
}

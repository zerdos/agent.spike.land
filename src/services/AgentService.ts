export interface ServerMessage {
    type: 'session_created' | 'message_chunk' | 'message_complete' | 'error' | 'sessions_list';
    payload: any;
}

export interface ClientMessage {
    type: 'create_session' | 'send_message' | 'get_sessions' | 'delete_session';
    payload: any;
}

export class AgentService {
    private ws: WebSocket | null = null;
    private messageHandlers: Map<string, (payload: any) => void> = new Map();
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 5;

    constructor(private url: string = 'ws://localhost:3001') { }

    connect(): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                this.ws = new WebSocket(this.url);

                this.ws.onopen = () => {
                    console.log('✅ Connected to agent server');
                    this.reconnectAttempts = 0;
                    resolve();
                };

                this.ws.onmessage = (event) => {
                    try {
                        const message: ServerMessage = JSON.parse(event.data);
                        const handler = this.messageHandlers.get(message.type);
                        if (handler) {
                            handler(message.payload);
                        }
                    } catch (error) {
                        console.error('Failed to parse message:', error);
                    }
                };

                this.ws.onclose = () => {
                    console.log('❌ Disconnected from agent server');
                    this.attemptReconnect();
                };

                this.ws.onerror = (error) => {
                    console.error('WebSocket error:', error);
                    reject(error);
                };
            } catch (error) {
                reject(error);
            }
        });
    }

    private attemptReconnect(): void {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            console.log(`Reconnecting... Attempt ${this.reconnectAttempts}`);
            setTimeout(() => this.connect(), 2000 * this.reconnectAttempts);
        }
    }

    on(messageType: string, handler: (payload: any) => void): void {
        this.messageHandlers.set(messageType, handler);
    }

    send(message: ClientMessage): void {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(message));
        } else {
            console.error('WebSocket is not connected');
        }
    }

    createSession(projectId: string): void {
        this.send({
            type: 'create_session',
            payload: { projectId },
        });
    }

    sendMessage(message: string): void {
        this.send({
            type: 'send_message',
            payload: { message },
        });
    }

    disconnect(): void {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
    }

    isConnected(): boolean {
        return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
    }
}

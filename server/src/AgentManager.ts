import Anthropic from '@anthropic-ai/sdk';

export interface AgentSession {
    id: string;
    projectId: string;
    status: 'idle' | 'busy' | 'error';
    createdAt: Date;
    lastActivity: Date;
}

export class AgentManager {
    private client: Anthropic;
    private sessions: Map<string, AgentSession> = new Map();

    constructor(apiKey: string) {
        this.client = new Anthropic({ apiKey });
    }

    async createSession(projectId: string): Promise<AgentSession> {
        const sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        const session: AgentSession = {
            id: sessionId,
            projectId,
            status: 'idle',
            createdAt: new Date(),
            lastActivity: new Date(),
        };

        this.sessions.set(sessionId, session);
        return session;
    }

    async sendMessage(
        sessionId: string,
        message: string,
        onStream: (text: string) => void
    ): Promise<void> {
        const session = this.sessions.get(sessionId);
        if (!session) {
            throw new Error(`Session ${sessionId} not found`);
        }

        session.status = 'busy';
        session.lastActivity = new Date();

        try {
            const stream = await this.client.messages.create({
                model: 'claude-3-5-sonnet-20241022',
                max_tokens: 4096,
                messages: [{ role: 'user', content: message }],
                stream: true,
            });

            for await (const event of stream) {
                if (
                    event.type === 'content_block_delta' &&
                    event.delta.type === 'text_delta'
                ) {
                    onStream(event.delta.text);
                }
            }

            session.status = 'idle';
            session.lastActivity = new Date();
        } catch (error) {
            session.status = 'error';
            throw error;
        }
    }

    getSession(sessionId: string): AgentSession | undefined {
        return this.sessions.get(sessionId);
    }

    getAllSessions(): AgentSession[] {
        return Array.from(this.sessions.values());
    }

    deleteSession(sessionId: string): boolean {
        return this.sessions.delete(sessionId);
    }
}

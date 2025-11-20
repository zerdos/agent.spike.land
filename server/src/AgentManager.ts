import { spawn } from 'child_process';

export interface AgentSession {
    id: string;
    projectId: string;
    status: 'idle' | 'busy' | 'error';
    createdAt: Date;
    lastActivity: Date;
}

export class AgentManager {
    private sessions: Map<string, AgentSession> = new Map();

    constructor() {
        // No API key needed - uses authenticated claude CLI
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

        return new Promise((resolve, reject) => {
            try {
                // Spawn claude CLI process
                const claudeProcess = spawn('claude', [
                    '--dangerously-skip-permissions',
                    message
                ]);

                let isFirstOutput = true;
                let buffer = '';

                // Process stdout
                claudeProcess.stdout.on('data', (data: Buffer) => {
                    const text = data.toString();
                    buffer += text;

                    // Remove ANSI escape codes
                    const cleanText = this.stripAnsiCodes(buffer);

                    // Skip the initial banner/header (first few lines)
                    if (isFirstOutput) {
                        // Look for the prompt echo and skip everything before it
                        const promptMarker = '>';
                        const markerIndex = cleanText.indexOf(promptMarker);
                        if (markerIndex !== -1) {
                            isFirstOutput = false;
                            // Skip to after the prompt line
                            const afterPrompt = cleanText.indexOf('\n', markerIndex);
                            if (afterPrompt !== -1) {
                                buffer = cleanText.substring(afterPrompt + 1);
                            } else {
                                buffer = '';
                            }
                        }
                        return;
                    }

                    // Parse and stream the actual response
                    const lines = cleanText.split('\n');
                    for (const line of lines) {
                        // Skip tool use indicators (⏺, ⎿, etc.)
                        if (line.trim().startsWith('⏺') ||
                            line.trim().startsWith('⎿') ||
                            line.trim().startsWith('▗') ||
                            line.trim().startsWith('▘') ||
                            line.trim().startsWith('▖') ||
                            line.trim().startsWith('▝')) {
                            continue;
                        }

                        // Stream actual content
                        const trimmedLine = line.trim();
                        if (trimmedLine.length > 0) {
                            onStream(trimmedLine + '\n');
                        }
                    }

                    buffer = '';
                });

                // Handle errors
                claudeProcess.stderr.on('data', (data: Buffer) => {
                    console.error('Claude CLI stderr:', data.toString());
                });

                // Handle process completion
                claudeProcess.on('close', (code) => {
                    session.status = 'idle';
                    session.lastActivity = new Date();

                    if (code === 0) {
                        resolve();
                    } else {
                        session.status = 'error';
                        reject(new Error(`Claude CLI exited with code ${code}`));
                    }
                });

                // Handle process errors
                claudeProcess.on('error', (error) => {
                    session.status = 'error';
                    reject(new Error(`Failed to start Claude CLI: ${error.message}`));
                });

            } catch (error) {
                session.status = 'error';
                reject(error);
            }
        });
    }

    // Remove ANSI escape codes from text
    private stripAnsiCodes(text: string): string {
        // eslint-disable-next-line no-control-regex
        return text.replace(/\x1b\[[0-9;]*[a-zA-Z]/g, '');
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

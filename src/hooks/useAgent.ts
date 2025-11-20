import { useState, useEffect, useCallback } from 'react';
import { AgentService } from '../services/AgentService';

export interface AgentMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

export function useAgent(projectId: string) {
    const [service] = useState(() => new AgentService());
    const [connected, setConnected] = useState(false);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [messages, setMessages] = useState<AgentMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const connect = async () => {
            try {
                await service.connect();
                setConnected(true);

                // Set up message handlers
                service.on('session_created', (payload) => {
                    setSessionId(payload.id);
                    console.log('Session created:', payload.id);
                });

                service.on('message_chunk', (payload) => {
                    setMessages((prev) => {
                        const lastMessage = prev[prev.length - 1];
                        if (lastMessage && lastMessage.role === 'assistant') {
                            // Append to existing assistant message
                            return [
                                ...prev.slice(0, -1),
                                { ...lastMessage, content: lastMessage.content + payload.text },
                            ];
                        } else {
                            // Create new assistant message
                            return [
                                ...prev,
                                {
                                    id: `msg-${Date.now()}`,
                                    role: 'assistant',
                                    content: payload.text,
                                    timestamp: new Date(),
                                },
                            ];
                        }
                    });
                });

                service.on('message_complete', () => {
                    setIsLoading(false);
                });

                service.on('error', (payload) => {
                    setError(payload.error);
                    setIsLoading(false);
                });

                // Create session
                service.createSession(projectId);
            } catch (err) {
                setError('Failed to connect to agent server');
                console.error(err);
            }
        };

        connect();

        return () => {
            service.disconnect();
        };
    }, [service, projectId]);

    const sendMessage = useCallback((message: string) => {
        if (!connected || !sessionId) {
            setError('Not connected to agent');
            return;
        }

        // Add user message to chat
        setMessages((prev) => [
            ...prev,
            {
                id: `msg-${Date.now()}`,
                role: 'user',
                content: message,
                timestamp: new Date(),
            },
        ]);

        setIsLoading(true);
        setError(null);
        service.sendMessage(message);
    }, [connected, sessionId, service]);

    return {
        connected,
        sessionId,
        messages,
        isLoading,
        error,
        sendMessage,
    };
}

import { useState, useRef, useEffect } from 'react';
import { useAgent } from '../../hooks/useAgent';
import './AgentConsole.css';

interface AgentConsoleProps {
    projectId: string;
    onClose?: () => void;
}

export default function AgentConsole({ projectId, onClose }: AgentConsoleProps) {
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { connected, sessionId, messages, isLoading, error, sendMessage } = useAgent(projectId);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim() && !isLoading) {
            sendMessage(input.trim());
            setInput('');
        }
    };

    return (
        <div className="agent-console">
            <div className="console-header">
                <div className="header-info">
                    <h2>Agent Console</h2>
                    <div className="connection-status">
                        <span className={`status-dot ${connected ? 'connected' : 'disconnected'}`} />
                        <span className="status-text">
                            {connected ? `Connected (${sessionId?.slice(0, 8)}...)` : 'Disconnected'}
                        </span>
                    </div>
                </div>
                {onClose && (
                    <button className="close-button" onClick={onClose}>
                        ×
                    </button>
                )}
            </div>

            <div className="console-messages">
                {messages.length === 0 && (
                    <div className="welcome-message">
                        <p>🤖 Agent is ready. Send a message to start!</p>
                    </div>
                )}

                {messages.map((message) => (
                    <div key={message.id} className={`message message-${message.role}`}>
                        <div className="message-header">
                            <span className="message-role">
                                {message.role === 'user' ? '👤 You' : '🤖 Agent'}
                            </span>
                            <span className="message-time">
                                {message.timestamp.toLocaleTimeString()}
                            </span>
                        </div>
                        <div className="message-content">{message.content}</div>
                    </div>
                ))}

                {isLoading && (
                    <div className="message message-assistant">
                        <div className="message-header">
                            <span className="message-role">🤖 Agent</span>
                        </div>
                        <div className="message-content typing-indicator">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="error-message">
                        ⚠️ {error}
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            <form className="console-input" onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message to the agent..."
                    disabled={!connected || isLoading}
                />
                <button type="submit" disabled={!connected || isLoading || !input.trim()}>
                    Send
                </button>
            </form>
        </div>
    );
}

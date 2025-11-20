import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import AgentConsole from './AgentConsole';

// Mock useAgent hook
vi.mock('../../hooks/useAgent', () => ({
    useAgent: vi.fn(() => ({
        connected: true,
        sessionId: 'test-session',
        messages: [],
        isLoading: false,
        error: null,
        sendMessage: vi.fn(),
    })),
}));

describe('AgentConsole', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders console interface', () => {
        render(<AgentConsole projectId="test-project" />);
        expect(screen.getByPlaceholderText(/type a message/i)).toBeInTheDocument();
    });

    it('displays connection status', () => {
        render(<AgentConsole projectId="test-project" />);
        expect(screen.getByText(/connected/i)).toBeInTheDocument();
    });
});

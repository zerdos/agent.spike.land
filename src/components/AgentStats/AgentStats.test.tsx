import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import AgentStats from './AgentStats';

describe('AgentStats', () => {
    it('renders total agents count', () => {
        render(<AgentStats totalAgents={5} activeAgents={3} offlineAgents={2} />);
        expect(screen.getByText('5')).toBeInTheDocument();
        expect(screen.getByText(/total agents/i)).toBeInTheDocument();
    });

    it('renders active agents count', () => {
        render(<AgentStats totalAgents={5} activeAgents={3} offlineAgents={2} />);
        expect(screen.getByText('3')).toBeInTheDocument();
        expect(screen.getByText(/active/i)).toBeInTheDocument();
    });

    it('renders offline agents count', () => {
        render(<AgentStats totalAgents={5} activeAgents={3} offlineAgents={2} />);
        expect(screen.getByText('2')).toBeInTheDocument();
        expect(screen.getByText(/offline/i)).toBeInTheDocument();
    });
});

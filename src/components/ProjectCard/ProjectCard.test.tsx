import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ProjectCard from './ProjectCard';
import { Project } from '../../types';

describe('ProjectCard', () => {
    const mockProject: Project = {
        id: '1',
        name: 'Test Project',
        description: 'A test project description',
        agentCount: 3,
        status: 'active',
        lastActivity: new Date('2025-11-20T10:00:00Z'),
    };

    it('renders project name', () => {
        render(<ProjectCard project={mockProject} />);
        expect(screen.getByText('Test Project')).toBeInTheDocument();
    });

    it('renders project description', () => {
        render(<ProjectCard project={mockProject} />);
        expect(screen.getByText('A test project description')).toBeInTheDocument();
    });

    it('renders agent count', () => {
        render(<ProjectCard project={mockProject} />);
        expect(screen.getByText(/3.*agent/i)).toBeInTheDocument();
    });

    it('displays active status', () => {
        render(<ProjectCard project={mockProject} />);
        const statusBadge = screen.getByText('active');
        expect(statusBadge).toHaveClass('status-badge', 'status-active');
    });
});

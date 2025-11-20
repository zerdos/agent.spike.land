import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Dashboard from './Dashboard';

describe('Dashboard', () => {
    it('renders dashboard heading', () => {
        render(<Dashboard />);
        expect(screen.getByRole('heading', { name: /agent control panel/i })).toBeInTheDocument();
    });

    it('renders agent statistics section', () => {
        render(<Dashboard />);
        expect(screen.getByText(/total agents/i)).toBeInTheDocument();
    });

    it('renders projects section', () => {
        render(<Dashboard />);
        expect(screen.getByText(/projects/i)).toBeInTheDocument();
    });
});

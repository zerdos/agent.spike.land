import { render, screen } from '@testing-library/react';
import App from './App';
import { describe, it, expect } from 'vitest';

describe('App', () => {
    it('renders dashboard', () => {
        render(<App />);
        expect(screen.getByRole('heading', { name: /agent control panel/i })).toBeInTheDocument();
    });
});

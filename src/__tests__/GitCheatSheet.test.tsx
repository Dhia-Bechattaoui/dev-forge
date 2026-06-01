import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import GitCheatSheet from '@/components/community/GitCheatSheet';
import React from 'react';

// Mock matchMedia for jsdom
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // Deprecated
    removeListener: vi.fn(), // Deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock ResizeObserver for framer-motion in jsdom
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

describe('GitCheatSheet Component', () => {
  it('renders without crashing', () => {
    render(<GitCheatSheet />);
    expect(screen.getByText('Git & GitHub Cheat Sheet')).toBeDefined();
    expect(screen.getByText('Basics')).toBeDefined();
  });

  it('renders the initial tab commands', () => {
    render(<GitCheatSheet />);
    expect(screen.getByText('git init')).toBeDefined();
    expect(screen.getByText('git clone <url>')).toBeDefined();
  });

  it('switches tabs correctly', async () => {
    render(<GitCheatSheet />);
    
    // Switch to Syncing tab
    const syncingTab = screen.getByText('Syncing');
    fireEvent.click(syncingTab);
    
    // Should show syncing commands
    expect(screen.getByText('git pull')).toBeDefined();
    expect(screen.getByText('git push origin main')).toBeDefined();
    // Should no longer show basics commands (or only their text) after animation
    await waitFor(() => {
      expect(screen.queryByText('git clone <url>')).toBeNull();
    });
  });

  it('filters commands via search', async () => {
    render(<GitCheatSheet />);
    
    const searchInput = screen.getByPlaceholderText('Search commands...');
    fireEvent.change(searchInput, { target: { value: 'clone' } });
    
    expect(screen.getByText('git clone <url>')).toBeDefined();
    await waitFor(() => {
      expect(screen.queryByText('git init')).toBeNull();
    });
  });

  it('handles empty search results gracefully', () => {
    render(<GitCheatSheet />);
    
    const searchInput = screen.getByPlaceholderText('Search commands...');
    fireEvent.change(searchInput, { target: { value: 'xyz123' } });
    
    expect(screen.getByText(/No commands found matching/)).toBeDefined();
  });
});

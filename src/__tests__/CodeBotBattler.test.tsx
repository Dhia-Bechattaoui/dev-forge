import { render, screen, fireEvent } from '@testing-library/react';
import { act } from 'react';
import { describe, it, expect, vi } from 'vitest';
import CodeBotBattler from '@/components/games/CodeBotBattler';
import React from 'react';

// Mock framer-motion to avoid complex animation testing issues
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, ...props }: any) => <div className={className} {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('CodeBotBattler Component', () => {
  const mockBots = [
    {
      id: 'b1',
      name: 'Alpha Bot',
      author: 'dev',
      stats: { hp: 100, attack: 20, defense: 10, speed: 20 } // Total: 150
    },
    {
      id: 'b2',
      name: 'Beta Bot',
      author: 'tester',
      stats: { hp: 50, attack: 40, defense: 5, speed: 55 } // Total: 150
    },
    {
      id: 'b3',
      name: 'Gamma Bot',
      author: 'system',
      stats: { hp: 200, attack: 100, defense: 100, speed: 100 } // Total: 500 (will be normalized)
    }
  ];

  it('renders matchmaking screen and normalizes oversized bots', () => {
    render(<CodeBotBattler bots={mockBots} />);
    
    expect(screen.getByText(/Select two community-built bots/i)).toBeDefined();
    
    // Select bots
    const selects = screen.getAllByRole('combobox');
    expect(selects.length).toBe(2);

    fireEvent.change(selects[0], { target: { value: 'b1' } });
    fireEvent.change(selects[1], { target: { value: 'b3' } });

    // Gamma Bot is 500 points, so it should be scaled down to 150.
    // HP was 200 (40%), so normalized HP = 150 * 0.4 = 60
    expect(screen.getAllByText('Total Points: 150 / 150').length).toBe(2);
    expect(screen.getAllByText('60').length).toBeGreaterThan(0); // The normalized HP
  });

  it('simulates a battle and declares a winner', () => {
    vi.useFakeTimers();

    render(<CodeBotBattler bots={mockBots} />);
    
    const selects = screen.getAllByRole('combobox');
    fireEvent.change(selects[0], { target: { value: 'b1' } });
    fireEvent.change(selects[1], { target: { value: 'b2' } });

    const battleBtn = screen.getByText('Simulate Battle');
    fireEvent.click(battleBtn);

    expect(screen.getByText('Alpha Bot')).toBeDefined();
    expect(screen.getByText('Beta Bot')).toBeDefined();
    expect(screen.getByText('FIGHT!')).toBeDefined();

    // Advance time to trigger combat loops (100ms per loop)
    act(() => {
      vi.advanceTimersByTime(120000); // Advance 120 seconds
    });

    // After 120 seconds, one of the bots should win
    expect(screen.getAllByText(/wins the battle!/i).length).toBeGreaterThan(0);

    vi.useRealTimers();
  });
});

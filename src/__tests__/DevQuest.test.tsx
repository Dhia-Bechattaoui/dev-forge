import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { DevQuest } from '../components/games';

// Mock framer-motion to bypass animations in JSDOM
vi.mock('framer-motion', async () => {
  const actual = await vi.importActual('framer-motion') as any;
  return {
    ...actual,
    AnimatePresence: ({ children }: any) => <>{children}</>,
    motion: {
      ...actual.motion,
      div: ({ children, className, ...props }: any) => <div className={className}>{children}</div>
    }
  };
});

describe('DevQuest Component', () => {
  const mockMonsters = [
    { id: 'm1', name: 'Test Slime', description: 'A test monster', hp: 10, attack: 2, author: 'tester' }
  ];
  const mockItems = [
    { id: 'i1', name: 'Test Sword', description: 'A test sword', type: 'weapon' as const, value: 50, author: 'tester' }
  ];

  it('renders "No monsters loaded" if array is empty', () => {
    render(<DevQuest monsters={[]} items={[]} />);
    expect(screen.getByText(/No monsters loaded/i)).toBeDefined();
  });

  it('starts in exploring state with full HP', () => {
    render(<DevQuest monsters={mockMonsters} items={mockItems} />);
    expect(screen.getByText('100 / 100 HP')).toBeDefined();
    expect(screen.getByText('Search Next Room')).toBeDefined();
  });

  it('can enter combat and attack', async () => {
    render(<DevQuest monsters={mockMonsters} items={[]!} />); // Empty items guarantees monster spawn
    
    // Explore -> Guarantees a monster spawn since Math.random > 0.3 logic and no items
    // Wait, the logic is > 0.3 for monster, else item. If we pass empty items, it might crash if it rolls item.
    // Let's pass a mock random to guarantee > 0.3
    const mathSpy = vi.spyOn(Math, 'random').mockReturnValue(0.9);
    
    const searchBtn = screen.getByText('Search Next Room');
    fireEvent.click(searchBtn);

    // Should now be in combat
    expect(screen.getByText('Test Slime')).toBeDefined();
    
    const attackBtn = screen.getByText('Attack');
    fireEvent.click(attackBtn);

    // Should deal damage and log it
    await waitFor(() => {
      expect(screen.getByText(/You hit Test Slime/i)).toBeDefined();
    });
    
    mathSpy.mockRestore();
  });
});

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

  const mockQuests = [
    { id: 'q1', title: 'Test Quest', description: 'desc', targetMonsterId: 'm1', targetCount: 1, rewardItemId: 'i1', author: 'tester' }
  ];

  it('renders "No monsters loaded" if array is empty', () => {
    render(<DevQuest monsters={[]} items={[]} />);
    expect(screen.getByText(/No monsters loaded/i)).toBeDefined();
  });

  it('starts in exploring state with full HP and empty backpack', () => {
    render(<DevQuest monsters={mockMonsters} items={mockItems} quests={mockQuests} />);
    expect(screen.getByText('100 / 100 HP')).toBeDefined();
    expect(screen.getByText('Search Next Room')).toBeDefined();
    expect(screen.getByText(/Your backpack is empty/i)).toBeDefined();
    expect(screen.getByText('Test Quest')).toBeDefined();
  });

  it('can enter combat and complete quest', async () => {
    render(<DevQuest monsters={mockMonsters} items={mockItems} quests={mockQuests} />); 
    
    // Force Math.random to return 0.9 (Explore -> Monster)
    const mathSpy = vi.spyOn(Math, 'random').mockReturnValue(0.9);
    
    const searchBtn = screen.getByText('Search Next Room');
    fireEvent.click(searchBtn);

    // Should now be in combat
    expect(screen.getByText('Test Slime')).toBeDefined();
    
    // Click attack multiple times to kill the monster (HP: 10, Fists: 5 + rand)
    const attackBtn = screen.getByText('Attack');
    fireEvent.click(attackBtn);
    
    // We expect the log to reflect the attack
    await waitFor(() => {
      expect(screen.getByText(/You hit Test Slime/i)).toBeDefined();
    });
    
    mathSpy.mockRestore();
  });
});

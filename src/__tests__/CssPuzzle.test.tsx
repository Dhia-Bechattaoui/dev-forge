import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CssPuzzle, { CssPuzzleLevel } from '../components/games/CssPuzzle';

// Mock framer-motion to avoid animation issues in JSDOM
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

// Sample puzzle data for testing
const mockPuzzles: CssPuzzleLevel[] = [
  {
    id: 'p1',
    title: 'Center the Div',
    author: 'Dhia-Bechattaoui',
    description: 'Use Flexbox to perfectly center the child square.',
    initialCss: 'display: flex;\n',
    htmlStructure: "<div class='box box-1'></div>",
    requiredStyles: {
      'justify-content': 'center',
      'align-items': 'center',
    },
  },
  {
    id: 'p2',
    title: 'Space Them Out',
    author: 'Dhia-Bechattaoui',
    description: 'Use Flexbox to evenly space three boxes.',
    initialCss: 'display: flex;\n',
    htmlStructure: "<div class='box box-1'></div><div class='box box-2'></div>",
    requiredStyles: {
      'justify-content': 'space-between',
    },
  },
];

describe('CssPuzzle Component', () => {
  it('renders the level selection screen with all puzzles', () => {
    render(<CssPuzzle puzzles={mockPuzzles} />);

    // Should show the game title
    expect(screen.getByText('CSS Puzzle Game')).toBeDefined();

    // Should show both puzzle titles
    expect(screen.getByText('Center the Div')).toBeDefined();
    expect(screen.getByText('Space Them Out')).toBeDefined();
  });

  it('starts a puzzle level and shows the code editor on click', () => {
    render(<CssPuzzle puzzles={mockPuzzles} />);

    // Click the first level's "Play Level" button
    const playButtons = screen.getAllByText('Play Level');
    fireEvent.click(playButtons[0]);

    // The level title should appear in the editor area
    expect(screen.getByText('Center the Div')).toBeDefined();

    // The editor should be prefilled with the initial CSS
    const textarea = screen.getByRole('textbox');
    expect((textarea as HTMLTextAreaElement).value).toContain('display: flex');
  });

  it('detects a solved puzzle when all required styles are typed', () => {
    render(<CssPuzzle puzzles={mockPuzzles} />);

    // Start Level 1
    const playButtons = screen.getAllByText('Play Level');
    fireEvent.click(playButtons[0]);

    // Type the winning CSS into the textarea
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, {
      target: {
        value: 'display: flex;\njustify-content: center;\nalign-items: center;',
      },
    });

    // Should now show the "Puzzle Solved!" success message
    expect(screen.getByText('Puzzle Solved!')).toBeDefined();
  });
});

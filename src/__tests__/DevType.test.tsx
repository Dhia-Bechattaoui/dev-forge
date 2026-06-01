import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import DevType from '@/components/games/DevType';
import React from 'react';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, onClick, ...props }: any) => (
      <div className={className} onClick={onClick} {...props}>{children}</div>
    ),
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Helper to type character by character
const typeText = (inputElement: HTMLElement, text: string) => {
  let currentVal = '';
  for (let i = 0; i < text.length; i++) {
    currentVal += text[i];
    fireEvent.change(inputElement, { target: { value: currentVal } });
  }
};

describe('DevType Component', () => {
  const mockSnippets = [
    {
      id: '1',
      language: 'JavaScript',
      author: 'dev',
      code: 'const a = 1;'
    }
  ];

  it('renders snippet selection screen', () => {
    render(<DevType snippets={mockSnippets} />);
    
    expect(screen.getByText('JavaScript')).toBeDefined();
    expect(screen.getByText('@dev')).toBeDefined();
    expect(screen.getByText('const a = 1;')).toBeDefined();
  });

  it('starts typing test and calculates WPM and accuracy correctly', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-01T00:00:00Z'));
    render(<DevType snippets={mockSnippets} />);
    
    const snippetCard = screen.getByText('Type This');
    fireEvent.click(snippetCard);

    const input = screen.getByRole('textbox');
    
    // Type correctly "const" (5 chars)
    typeText(input, 'const');

    // Advance timer by 12 seconds
    act(() => {
      vi.advanceTimersByTime(12000);
    });

    // 5 chars = 1 word. 1 word in 12s = 5 WPM
    expect(screen.getByText('5')).toBeDefined();
    expect(screen.getByText('100%')).toBeDefined();

    // Finish typing perfectly
    typeText(input, 'const a = 1;');

    expect(screen.getByText('Test Complete!')).toBeDefined();

    vi.useRealTimers();
  });

  it('calculates incorrect accuracy', () => {
    render(<DevType snippets={mockSnippets} />);
    const snippetCard = screen.getByText('Type This');
    fireEvent.click(snippetCard);

    const input = screen.getByRole('textbox');

    // Make a typo: "x" instead of "c"
    typeText(input, 'xonst a = 1;');

    // 1 mistake out of 12 chars = 11 correct = 11/12 = 92%
    expect(screen.getByText('92%')).toBeDefined();
  });
});

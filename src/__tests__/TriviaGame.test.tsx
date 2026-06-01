import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TriviaGame } from '../components/games';

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

describe('TriviaGame Component', () => {
  const mockQuestions = [
    {
      question: "What is 1+1?",
      options: ["1", "2", "3", "4"],
      answer: "2",
      author: "Test User"
    },
    {
      question: "What color is the sky?",
      options: ["Red", "Blue", "Green", "Yellow"],
      answer: "Blue",
      author: "Test User"
    }
  ];

  it('renders "No trivia questions available" if array is empty', () => {
    render(<TriviaGame questions={[]} />);
    expect(screen.getByText(/No trivia questions available/i)).toBeDefined();
  });

  it('renders the first question correctly', () => {
    render(<TriviaGame questions={mockQuestions} />);
    expect(screen.getByText('What is 1+1?')).toBeDefined();
    expect(screen.getByText('Question 1 of 2')).toBeDefined();
    expect(screen.getByText('1')).toBeDefined();
    expect(screen.getByText('2')).toBeDefined();
  });

  it('allows answering a question and advances after timeout', async () => {
    render(<TriviaGame questions={mockQuestions} />);
    
    // Click the correct answer
    const correctOption = screen.getByText('2');
    fireEvent.click(correctOption);
    
    // Score should instantly update
    expect(screen.getByText('Score: 1')).toBeDefined();
    
    // Wait for the timeout (1.5s) to advance to the next question
    await waitFor(() => {
      expect(screen.getByText('What color is the sky?')).toBeDefined();
    }, { timeout: 2000 });
  });
});

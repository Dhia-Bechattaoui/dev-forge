import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import DashboardStats from '@/components/DashboardStats';
import React from 'react';

const mockContributors = [
  {
    name: 'Alice',
    github: 'alice-dev',
    language: 'TypeScript',
    role: 'Frontend'
  },
  {
    name: 'Bob',
    github: 'bob-dev',
    language: 'TypeScript',
    role: 'Backend'
  },
  {
    name: 'Charlie',
    github: 'charlie-dev',
    language: 'Python',
    role: 'Data'
  }
];

describe('DashboardStats Component', () => {
  it('renders the stat cards without crashing', () => {
    render(<DashboardStats contributors={mockContributors} totalComponents={5} rpgCount={10} triviaCount={15} />);
    
    expect(screen.getByText('Total Contributors')).toBeDefined();
    expect(screen.getByText('Community Widgets')).toBeDefined();
    expect(screen.getByText('RPG Database Size')).toBeDefined();
    expect(screen.getByText('Trivia Questions')).toBeDefined();
  });

  it('renders the correct values', () => {
    render(<DashboardStats contributors={mockContributors} totalComponents={5} rpgCount={10} triviaCount={15} />);
    // We have 3 mock contributors
    expect(screen.getByText('3')).toBeDefined();
    expect(screen.getByText('5')).toBeDefined();
    expect(screen.getByText('10')).toBeDefined();
    expect(screen.getByText('15')).toBeDefined();
  });
});

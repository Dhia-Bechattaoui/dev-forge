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
    render(<DashboardStats contributors={mockContributors} totalComponents={5} />);
    
    expect(screen.getByText('Total Contributors')).toBeDefined();
    expect(screen.getByText('Community Widgets')).toBeDefined();
    expect(screen.getByText('Top Tech Stack')).toBeDefined();
  });

  it('calculates the correct total contributors', () => {
    render(<DashboardStats contributors={mockContributors} totalComponents={5} />);
    // We have 3 mock contributors
    expect(screen.getByText('3')).toBeDefined();
  });

  it('calculates the top tech stack correctly', () => {
    render(<DashboardStats contributors={mockContributors} totalComponents={5} />);
    // TypeScript appears twice, Python once. So TypeScript is the winner!
    expect(screen.getByText('TypeScript')).toBeDefined();
  });
});

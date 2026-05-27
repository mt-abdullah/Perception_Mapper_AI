import { render, screen } from '@testing-library/react';
import React from 'react';
import TeamTable from './TeamTable';

// Mock Lucide icons to avoid ESM import issue in Jest
jest.mock('lucide-react', () => ({
  Edit: () => <div data-testid="edit-icon" />,
  Trash2: () => <div data-testid="trash-icon" />,
  Users: () => <div data-testid="users-icon" />,
  PauseCircle: () => <div data-testid="pause-icon" />,
}));

// Mock @perception-mapper/ui
jest.mock('@perception-mapper/ui', () => ({
  Card: ({ children, className }: any) => <div className={className} data-testid="card">{children}</div>,
  Button: ({ children, size, variant, onClick }: any) => (
    <button onClick={onClick} data-size={size} data-variant={variant}>
      {children}
    </button>
  ),
}));

describe('TeamTable Component', () => {
  beforeEach(() => {
    // Mock fetch for team list
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve([
            {
              id: '1',
              name: 'Alpha Team',
              leadEmail: 'lead@alpha.com',
              members: [{}, {}],
              tier: 'TEAM',
              status: 'Active',
              createdAt: '2026-05-27T08:00:00.000Z',
            },
          ]),
      })
    ) as any;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders loading state initially and then shows teams', async () => {
    render(<TeamTable />);
    expect(screen.getByText('Loading teams…')).toBeInTheDocument();

    const teamName = await screen.findByText('Alpha Team');
    expect(teamName).toBeInTheDocument();
    expect(screen.getByText('lead@alpha.com')).toBeInTheDocument();
    expect(screen.getByText('TEAM')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
  });
});

import { render, screen } from '@testing-library/react';
import TeamStats from './TeamStats';

test('renders TeamStats with provided stats', () => {
  const mockStats = {
    totalTeams: 5,
    activeMembers: 12,
    pendingInvites: 3,
    activity: 42,
  };

  render(<TeamStats stats={mockStats} />);

  expect(screen.getByText('Total Teams')).toBeInTheDocument();
  expect(screen.getByText('5')).toBeInTheDocument();
  expect(screen.getByText('Active Members')).toBeInTheDocument();
  expect(screen.getByText('12')).toBeInTheDocument();
  expect(screen.getByText('Pending Invites')).toBeInTheDocument();
  expect(screen.getByText('3')).toBeInTheDocument();
  expect(screen.getByText('Activity')).toBeInTheDocument();
  expect(screen.getByText('42')).toBeInTheDocument();
});

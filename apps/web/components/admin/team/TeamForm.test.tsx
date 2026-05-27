import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import TeamForm from './TeamForm';

// Mock UI elements
jest.mock('@perception-mapper/ui', () => ({
  Card: ({ children, className }: any) => <div className={className}>{children}</div>,
  Input: ({ name, placeholder, value, onChange, type }: any) => (
    <input
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      type={type || 'text'}
      data-testid={`input-${name}`}
    />
  ),
  Button: ({ children, type }: any) => <button type={type}>{children}</button>,
}));

describe('TeamForm Component', () => {
  beforeEach(() => {
    // Mock user list fetch
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve([
            { id: 'u1', email: 'user1@company.com' },
            { id: 'u2', email: 'user2@company.com' },
          ]),
      })
    ) as any;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders fields and loads available team leads', async () => {
    render(<TeamForm />);
    expect(screen.getByPlaceholderText('Team Name')).toBeInTheDocument();
    
    const leadSelect = await screen.findByRole('combobox', { name: '' });
    expect(leadSelect).toBeInTheDocument();
    
    // Check loading users options
    const option1 = await screen.findByText('user1@company.com');
    expect(option1).toBeInTheDocument();
  });

  it('submits form with correct data', async () => {
    render(<TeamForm />);
    const nameInput = screen.getByPlaceholderText('Team Name');
    fireEvent.change(nameInput, { target: { value: 'Beta Core' } });

    const createButton = screen.getByRole('button', { name: 'Create Team' });
    fireEvent.click(createButton);

    expect(global.fetch).toHaveBeenCalledWith('/api/admin/teams', expect.any(Object));
  });
});

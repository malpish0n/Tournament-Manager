import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('axios', () => ({
  get: jest.fn(() => Promise.resolve({ data: [] })),
  post: jest.fn(() => Promise.resolve({ data: {} })),
  patch: jest.fn(() => Promise.resolve({ data: {} })),
  delete: jest.fn(() => Promise.resolve({ data: {} })),
}));

describe('App', () => {
  beforeEach(() => {
    // JSDOM doesn’t implement alert
    window.alert = jest.fn();
  });

  test('renders main header', () => {
    render(<App />);
    expect(screen.getByText(/match creator/i)).toBeInTheDocument();
  });

  test('renders navigation tabs', () => {
    render(<App />);
    expect(screen.getByRole('button', { name: /create match/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /bracket creator/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /matches/i })).toBeInTheDocument();
  });
});

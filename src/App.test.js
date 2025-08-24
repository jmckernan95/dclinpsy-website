import { render, screen } from '@testing-library/react';
import App from './App';

// Mock react-router-dom to avoid routing issues in tests
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  BrowserRouter: ({ children }) => <div>{children}</div>,
}));

// Mock Web Crypto API for tests
global.crypto = {
  getRandomValues: jest.fn((arr) => arr.map(() => Math.floor(Math.random() * 256))),
  subtle: {
    importKey: jest.fn(),
    deriveBits: jest.fn(),
    deriveKey: jest.fn(),
    encrypt: jest.fn(),
    decrypt: jest.fn(),
  }
};

test('renders DClinPsy app', () => {
  render(<App />);
  const appElement = screen.getByText(/DClinPsy SJT Practice/i);
  expect(appElement).toBeInTheDocument();
});

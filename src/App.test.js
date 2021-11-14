import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Exchange button', () => {
  render(<App />);
  const exchange = screen.getByText(/Exchange/i);
  expect(exchange).toBeInTheDocument();
});

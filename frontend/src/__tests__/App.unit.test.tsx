import { render, screen } from '@testing-library/react';
import App from '../App';

describe('App Unit Tests', () => {
  it('should render without crashing', () => {
    render(<App />);
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });
});

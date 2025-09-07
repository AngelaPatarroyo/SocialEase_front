import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '@/context/ThemeContext';
import Navbar from '../Navbar';

// Mock Next.js Link component (Image is mocked globally in jest.setup.js)
jest.mock('next/link', () => {
  return function MockLink({ href, children, ...props }: any) {
    return <a href={href} {...props}>{children}</a>;
  };
});

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider>
      {component}
    </ThemeProvider>
  );
};

describe('Navbar', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  it('renders navbar with theme toggle button', () => {
    renderWithTheme(<Navbar />);
    
    expect(screen.getByRole('button', { name: /switch to dark mode/i })).toBeInTheDocument();
  });

  it('toggles theme when theme button is clicked', () => {
    renderWithTheme(<Navbar />);
    
    const themeButton = screen.getByRole('button', { name: /switch to dark mode/i });
    
    // Initially should show moon icon (light mode)
    expect(themeButton).toHaveTextContent('🌙');
    
    // Click to toggle to dark mode
    fireEvent.click(themeButton);
    
    // Should now show sun icon (dark mode)
    expect(themeButton).toHaveTextContent('☀️');
  });

  it('persists theme in localStorage', () => {
    renderWithTheme(<Navbar />);
    
    const themeButton = screen.getByRole('button', { name: /switch to dark mode/i });
    
    // Toggle theme
    fireEvent.click(themeButton);
    
    // Check if theme is saved in localStorage
    expect(localStorage.getItem('theme')).toBe('dark');
  });

  it('applies dark class to document when dark theme is selected', () => {
    renderWithTheme(<Navbar />);
    
    const themeButton = screen.getByRole('button', { name: /switch to dark mode/i });
    
    // Toggle to dark mode
    fireEvent.click(themeButton);
    
    // Check if dark class is applied to document
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('shows mobile menu when menu button is clicked', () => {
    renderWithTheme(<Navbar />);
    
    const menuButton = screen.getByRole('button', { name: /☰/ });
    
    // Click menu button to open mobile menu
    fireEvent.click(menuButton);
    
    // Mobile menu should now be visible with mobile-specific elements
    expect(screen.getByText('🌙 Dark Mode')).toBeInTheDocument();
  });
});

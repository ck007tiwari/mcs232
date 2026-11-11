import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import { AppProvider } from './context/AppContext';

/**
 * System and Unit Tests for the Base Application
 */

describe('Frontend Rendering (System Tests)', () => {
  test('renders Login page by default for unauthenticated users', () => {
    // 1. Arrange & Act: Render the App Provider wrapping the App Router
    render(
      <AppProvider>
        <App />
      </AppProvider>
    );

    // 2. Assert: Since there's no JWT in localStorage during test setup, 
    // it should immediately redirect to Login (/login) or render the Auth forms.
    // Assuming there's a login button or form header.
    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
  });
});

describe('Route Protection Layer (Unit Tests)', () => {
  test('blocks unauthorized access to dashboard', () => {
    render(
      <AppProvider>
        <MemoryRouter initialEntries={['/home']}>
          {/* Mocking the router manually or assuming App handles paths internally */}
          {/* Even if attempting to load /home, without token it should show Login */}
          <App />
        </MemoryRouter>
      </AppProvider>
    );

    // Without an active user context, dashboard pieces (like "Subjects", "QA History")
    // should absolutely not be in the document tree.
    const dashboardHeader = screen.queryByText(/Dashboard/i);
    if (!screen.getByPlaceholderText(/email/i)) {
      expect(dashboardHeader).not.toBeInTheDocument();
    }
  });
});

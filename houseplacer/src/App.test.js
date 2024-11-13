// Import necessary modules and components
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom'; 
import App from './App'; 

// Helper function to render with router context
const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

// Group related tests for the App component
describe('App Component', () => {

  // Test 1: Renders Signup component at the root path
  test('renders Signup component at root path', () => {
    renderWithRouter(<App />);

    // Check if the Signup form is present
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument(); 
  });

  // Test 2: Renders Welcome message at root path
  test('renders welcome message at root path', () => {
    renderWithRouter(<App />); 

    // Check if the welcome message is displayed
    expect(screen.getByText(/Welcome to HousePlacer/i)).toBeInTheDocument();
  });

  // Test 3: Renders StudentPortal component at the "/studentportal" path
  test('renders StudentPortal component at /studentportal path', () => {
    window.history.pushState({}, 'Student Portal', '/studentportal'); 

    renderWithRouter(<App />); 

    // Check if the StudentPortal is rendered
    expect(screen.getByText(/Student Portal/i)).toBeInTheDocument();
  });

  // Test 4: Renders ManagerPortal component at the "/managerportal" path
  test('renders ManagerPortal component at /managerportal path', () => {
    window.history.pushState({}, 'Manager Portal', '/managerportal'); 

    renderWithRouter(<App />); 

    // Check if the ManagerPortal is rendered
    expect(screen.getByText(/Manager Portal/i)).toBeInTheDocument(); 
  });
});

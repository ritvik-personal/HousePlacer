// Import necessary modules and components
import { render, screen, fireEvent } from '@testing-library/react';
import Signup from './Signup';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

// Mock axios and toast
jest.mock('axios');
jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
  },
}));

// Helper function to render with router context
const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

// Group related tests for the Signup component
describe('Signup Component', () => {

  // Test 1: Renders all form elements
  test('renders all input fields and buttons', () => {
    renderWithRouter(<Signup />);
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByText(/create an account/i)).toBeInTheDocument();
  });

  // Test 2: Validates email input for invalid email format
  test('shows an error when email is invalid', () => {
    renderWithRouter(<Signup />);
    const emailInput = screen.getByPlaceholderText(/email/i);
    const submitButton = screen.getByText(/create an account/i);

    fireEvent.change(emailInput, { target: { value: 'invalidEmail' } });
    fireEvent.click(submitButton);

    expect(screen.getByText('Email is invalid.')).toBeInTheDocument();
  });

  // Test 3: Validates username input for minimum length
  test('shows an error when username is too short', () => {
    renderWithRouter(<Signup />);
    const usernameInput = screen.getByPlaceholderText(/username/i);
    const submitButton = screen.getByText(/create an account/i);

    fireEvent.change(usernameInput, { target: { value: 'user' } });
    fireEvent.click(submitButton);

    expect(screen.getByText('Username is invalid. Remember your username must be at least 5 characters long.')).toBeInTheDocument();
  });

  // Test 4: Calls axios post method on valid submission
  test('calls axios post on form submission with valid data', async () => {
    renderWithRouter(<Signup />);
    
    axios.post.mockResolvedValue({ data: { message: 'Account created successfully' } });

    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByText(/create an account/i));

    expect(axios.post).toHaveBeenCalledWith('http://localhost:8081/register', {
      classification: 'Student',
      email: 'test@example.com',
      username: 'testuser',
      password: 'password123',
    });
  });
});

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Managerportal from './managerportal';
import '@testing-library/jest-dom';
import axios from 'axios';

// Mock axios
jest.mock('axios');

describe('Managerportal Component', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock useNavigate
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(mockNavigate);

    // Mock axios.get for useEffect
    axios.get.mockResolvedValue({
      data: {
        loggedIn: true,
        user: [{ ID: '123', username: 'manageruser' }],
      },
    });
  });

  // Test 1: Renders all input fields and buttons
  test('renders all input fields and buttons', async () => {
    render(
      <BrowserRouter>
        <Managerportal />
      </BrowserRouter>
    );

    expect(screen.getByPlaceholderText(/Username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument();
    expect(screen.getByText(/Login/i)).toBeInTheDocument();
    expect(screen.getByText(/Signup/i)).toBeInTheDocument();
    expect(screen.getByText(/Student/i)).toBeInTheDocument();
  });

  // Test 2: Handles successful login
  test('handles successful login', async () => {
    // Mock axios POST request
    axios.post.mockResolvedValueOnce({
      data: {
        message: 'Success',
        userId: '123',
      },
    });

    render(
      <BrowserRouter>
        <Managerportal />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/Username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByPlaceholderText(/Password/i), { target: { value: 'password123' } });

    fireEvent.click(screen.getByText(/Login/i));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('http://localhost:8081/login', {
        classification: 1,
        username: 'testuser',
        password: 'password123',
      });
    });

    await waitFor(() => {
      expect(sessionStorage.setItem).toHaveBeenCalledWith('managerId', '123');
      expect(mockNavigate).toHaveBeenCalledWith('/managerportal/managerdashboard');
    });
  });

  // Test 3: Handles failed login
  test('handles failed login', async () => {
    // Mock axios POST request
    axios.post.mockResolvedValueOnce({
      data: {
        message: 'No record',
      },
    });

    render(
      <BrowserRouter>
        <Managerportal />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/Username/i), { target: { value: 'wronguser' } });
    fireEvent.change(screen.getByPlaceholderText(/Password/i), { target: { value: 'wrongpassword' } });

    fireEvent.click(screen.getByText(/Login/i));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('http://localhost:8081/login', {
        classification: 1,
        username: 'wronguser',
        password: 'wrongpassword',
      });
    });

    await waitFor(() => {
      expect(screen.getByText('No record')).toBeInTheDocument();
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  // Test 4: Navigates to Signup page
  test('navigates to Signup page when Signup is clicked', () => {
    render(
      <BrowserRouter>
        <Managerportal />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText(/Signup/i));
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  // Test 5: Navigates to Student portal
  test('navigates to Student portal when Student is clicked', () => {
    render(
      <BrowserRouter>
        <Managerportal />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText(/Student/i));
    expect(mockNavigate).toHaveBeenCalledWith('/studentportal');
  });

  // Test 6: Handles useEffect and retrieves logged-in user
  test('retrieves logged-in user on mount', async () => {
    render(
      <BrowserRouter>
        <Managerportal />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith('http://localhost:8081/login');
    });

    expect(screen.getByPlaceholderText(/Username/i)).toBeInTheDocument();
  });
});

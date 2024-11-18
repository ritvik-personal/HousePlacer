import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import Studentportal from './studentportal';
import axios from 'axios';

// Mock axios
jest.mock('axios');

describe('Studentportal Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders all input fields and buttons', () => {
    render(
      <BrowserRouter>
        <Studentportal />
      </BrowserRouter>
    );

    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Signup')).toBeInTheDocument();
    expect(screen.getByText('Manager')).toBeInTheDocument();
  });

  test('allows user to input username and password', () => {
    render(
      <BrowserRouter>
        <Studentportal />
      </BrowserRouter>
    );

    const usernameInput = screen.getByPlaceholderText('Username');
    const passwordInput = screen.getByPlaceholderText('Password');

    fireEvent.change(usernameInput, { target: { value: 'studentUser' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(usernameInput.value).toBe('studentUser');
    expect(passwordInput.value).toBe('password123');
  });

  test('handles successful login', async () => {
    axios.post.mockResolvedValueOnce({
      data: { message: 'Success', userId: 1 },
    });

    const mockNavigate = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(mockNavigate);

    render(
      <BrowserRouter>
        <Studentportal />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'studentUser' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByText('Login'));

    await screen.findByText('Login'); // Wait for async axios call to complete

    expect(axios.post).toHaveBeenCalledWith('http://localhost:8081/login', {
      classification: 0,
      username: 'studentUser',
      password: 'password123',
    });

    expect(sessionStorage.setItem).toHaveBeenCalledWith('studentId', 1);
    expect(mockNavigate).toHaveBeenCalledWith('/studentportal/studentdashboard');
  });

  test('handles failed login', async () => {
    axios.post.mockResolvedValueOnce({
      data: { message: 'No record.' },
    });

    render(
      <BrowserRouter>
        <Studentportal />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'wrongUser' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'wrongPassword' } });
    fireEvent.click(screen.getByText('Login'));

    await screen.findByText('Login'); // Wait for async axios call to complete

    expect(axios.post).toHaveBeenCalledWith('http://localhost:8081/login', {
      classification: 0,
      username: 'wrongUser',
      password: 'wrongPassword',
    });

    expect(screen.getByText('No record.')).toBeInTheDocument();
  });

  test('navigates to Signup page when Signup button is clicked', () => {
    const mockNavigate = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(mockNavigate);

    render(
      <BrowserRouter>
        <Studentportal />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText('Signup'));
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  test('navigates to Manager portal when Manager button is clicked', () => {
    const mockNavigate = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(mockNavigate);

    render(
      <BrowserRouter>
        <Studentportal />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText('Manager'));
    expect(mockNavigate).toHaveBeenCalledWith('/managerportal');
  });
});

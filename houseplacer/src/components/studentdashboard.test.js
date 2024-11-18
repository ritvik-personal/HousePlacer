import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import StudentDashboard from './studentdashboard';
import Marketplace from './marketplace';
import StudentPreferenceForm from './studentpreferences';

// Mock the child components
jest.mock('./Marketplace', () => jest.fn(() => <div data-testid="marketplace">Marketplace Component</div>));
jest.mock('./studentpreferences', () => jest.fn(() => <div data-testid="preferences-form">Student Preferences Form</div>));

describe('StudentDashboard Component', () => {
  test('renders all sidebar buttons', () => {
    render(
      <BrowserRouter>
        <StudentDashboard />
      </BrowserRouter>
    );

    expect(screen.getByText('Marketplace')).toBeInTheDocument();
    expect(screen.getByText('Saved Properties')).toBeInTheDocument();
    expect(screen.getByText('Tasks')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  test('renders Marketplace when Marketplace button is clicked', () => {
    render(
      <BrowserRouter>
        <StudentDashboard />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText('Marketplace'));
    expect(screen.getByTestId('marketplace')).toBeInTheDocument();
  });

  test('renders Student Preferences Form when Tasks button is clicked', () => {
    render(
      <BrowserRouter>
        <StudentDashboard />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText('Tasks'));
    expect(screen.getByTestId('preferences-form')).toBeInTheDocument();
  });

  test('logs out when Logout button is clicked', () => {
    const mockNavigate = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(mockNavigate);

    render(
      <BrowserRouter>
        <StudentDashboard />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText('Logout'));
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});

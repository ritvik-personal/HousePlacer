import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ManagerDashboard from './managerdashboard';
import '@testing-library/jest-dom';
import * as reactRouterDom from 'react-router-dom';

// Mock child components
jest.mock('./createproperty', () => () => <div>Mocked PropertyForm</div>);
jest.mock('./propertieslist', () => ({ managerId }) => (
  <div>Mocked PropertiesList for Manager ID: {managerId}</div>
));
jest.mock('./marketplace', () => () => <div>Mocked Marketplace</div>);

// Mock the `react-router-dom` module
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('ManagerDashboard Component', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    // Mock `useNavigate` to use our mock function
    reactRouterDom.useNavigate.mockReturnValue(mockNavigate);

    // Mock sessionStorage
    jest.spyOn(window.sessionStorage.__proto__, 'getItem').mockImplementation((key) => {
      if (key === 'managerId') return '123';
      return null;
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Test 1: Render all sidebar buttons
  test('renders all sidebar buttons', () => {
    render(<ManagerDashboard />);

    expect(screen.getByText(/Marketplace/i)).toBeInTheDocument();
    expect(screen.getByText(/My Properties/i)).toBeInTheDocument();
    expect(screen.getByText(/Tasks/i)).toBeInTheDocument();
    expect(screen.getByText(/Logout/i)).toBeInTheDocument();
  });

  // Test 2: Default active tab shows "Saved Properties"
  test('renders "Saved Properties" by default', () => {
    render(<ManagerDashboard />);

    expect(screen.getByText(/Mocked PropertiesList for Manager ID: 123/i)).toBeInTheDocument();
  });

  // Test 3: Switches to Marketplace tab
  test('renders Marketplace when Marketplace button is clicked', () => {
    render(<ManagerDashboard />);

    fireEvent.click(screen.getByText(/Marketplace/i));
    expect(screen.getByText(/Mocked Marketplace/i)).toBeInTheDocument();
  });

  // Test 4: Switches to Tasks tab
  test('renders Tasks when Tasks button is clicked', () => {
    render(<ManagerDashboard />);

    fireEvent.click(screen.getByText(/Tasks/i));
    expect(screen.getByText(/Mocked PropertyForm/i)).toBeInTheDocument();
  });

  // Test 5: Logout functionality calls navigate
  test('calls navigate when Logout button is clicked', () => {
    render(<ManagerDashboard />);

    fireEvent.click(screen.getByText(/Logout/i));
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});


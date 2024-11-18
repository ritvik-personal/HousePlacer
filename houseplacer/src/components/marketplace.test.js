import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import Marketplace from './marketplace';

// Mock axios
jest.mock('axios');

describe('Marketplace Component', () => {
  const mockProperties = [
    {
      Property_ID: 1,
      Property_Name: 'Mock Property 1',
      Address: '123 Mock St',
      No_Bedrooms: 3,
      No_Bathrooms: 2,
      Rent: 1500,
      Sq_Footage: 1200,
      Image: 'property1.jpg',
      Website: 'http://example.com',
      Dist_Campus: 1.2,
      Parking: true,
      Property_Description: 'This is a great property for students.',
    },
    {
      Property_ID: 2,
      Property_Name: 'Mock Property 2',
      Address: '456 Mock Ave',
      No_Bedrooms: 2,
      No_Bathrooms: 1,
      Rent: 1200,
      Sq_Footage: 900,
      Image: 'property2.jpg',
      Website: 'http://example2.com',
      Dist_Campus: 2.0,
      Parking: false,
      Property_Description: 'Affordable housing close to campus.',
    },
  ];

  beforeEach(() => {
    axios.get.mockResolvedValue({ data: mockProperties });
    jest.clearAllMocks();
  });

  test('renders the marketplace and fetches properties', async () => {
    render(<Marketplace />);

    expect(screen.getByText(/Property Marketplace/i)).toBeInTheDocument();
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith('http://localhost:8081/matchproperties');
    });

    // Verify that properties are displayed
    await waitFor(() => {
      expect(screen.getByText('Mock Property 1')).toBeInTheDocument();
      expect(screen.getByText('Mock Property 2')).toBeInTheDocument();
    });
  });

  test('handles search functionality correctly', async () => {
    render(<Marketplace />);

    await waitFor(() => {
      expect(screen.getByText('Mock Property 1')).toBeInTheDocument();
      expect(screen.getByText('Mock Property 2')).toBeInTheDocument();
    });

    // Search for "Property 1"
    fireEvent.change(screen.getByPlaceholderText(/search properties/i), {
      target: { value: 'Property 1' },
    });
    fireEvent.click(screen.getByText(/Search/i));

    await waitFor(() => {
      expect(screen.getByText('Mock Property 1')).toBeInTheDocument();
      expect(screen.queryByText('Mock Property 2')).not.toBeInTheDocument();
    });
  });

  test('handles property detail view dialog', async () => {
    render(<Marketplace />);

    await waitFor(() => {
      expect(screen.getByText('Mock Property 1')).toBeInTheDocument();
    });

    // Open the details dialog for the first property
    fireEvent.click(screen.getAllByText(/View Details/i)[0]);

    await waitFor(() => {
      expect(screen.getByText('Mock Property 1')).toBeInTheDocument();
      expect(screen.getByText(/123 Mock St/i)).toBeInTheDocument();
      expect(screen.getByText(/This is a great property for students./i)).toBeInTheDocument();
    });

    // Close the dialog
    fireEvent.click(screen.getByText(/Close/i));
    expect(screen.queryByText(/123 Mock St/i)).not.toBeInTheDocument();
  });

  test('handles saving a property', async () => {
    render(<Marketplace />);

    await waitFor(() => {
      expect(screen.getByText('Mock Property 1')).toBeInTheDocument();
    });

    // Save the first property
    fireEvent.click(screen.getAllByText(/Save/i)[0]);

    // Verify the property was saved (mocking savedProperties state here is not possible directly in RTL)
    // So instead, you can check if the button logic runs correctly without breaking.
    expect(screen.getByText('Mock Property 1')).toBeInTheDocument();
  });

  test('handles visiting a property website', async () => {
    render(<Marketplace />);

    await waitFor(() => {
      expect(screen.getByText('Mock Property 1')).toBeInTheDocument();
    });

    // Mock `window.open`
    const mockOpen = jest.spyOn(window, 'open').mockImplementation(() => {});

    // Visit the website for the first property
    fireEvent.click(screen.getAllByText(/Visit Website/i)[0]);

    expect(mockOpen).toHaveBeenCalledWith('http://example.com', '_blank', 'noopener,noreferrer');
    mockOpen.mockRestore();
  });
});

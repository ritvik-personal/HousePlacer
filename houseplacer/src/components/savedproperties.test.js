import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import SavedProperties from './savedproperties';

// Mock axios
jest.mock('axios');

describe('SavedProperties Component', () => {
  const mockProperties = [
    {
      Property_ID: 1,
      Property_Name: 'Property 1',
      Rent: 1200,
      No_Bedrooms: 3,
      No_Bathrooms: 2,
      Sq_Footage: 1500,
      Dist_Campus: 1.2,
      Parking: true,
      Property_Description: 'Spacious property near campus.',
      Website: 'https://property1.com',
      Image: 'property1.jpg',
    },
    {
      Property_ID: 2,
      Property_Name: 'Property 2',
      Rent: 1000,
      No_Bedrooms: 2,
      No_Bathrooms: 1,
      Sq_Footage: 1200,
      Dist_Campus: 0.8,
      Parking: false,
      Property_Description: 'Cozy property close to amenities.',
      Website: 'https://property2.com',
      Image: 'property2.jpg',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    axios.get.mockResolvedValue({ data: mockProperties });
    axios.delete.mockResolvedValue({});
  });

  test('renders saved properties fetched from API', async () => {
    render(<SavedProperties />);

    await waitFor(() => {
      expect(screen.getByText('Property 1')).toBeInTheDocument();
      expect(screen.getByText('Property 2')).toBeInTheDocument();
    });

    expect(screen.getByText('Bedrooms: 3')).toBeInTheDocument();
    expect(screen.getByText('Bathrooms: 2')).toBeInTheDocument();
    expect(screen.getByText('$1200')).toBeInTheDocument();
  });

  test('removes a property when Remove button is clicked', async () => {
    render(<SavedProperties />);

    await waitFor(() => {
      expect(screen.getByText('Property 1')).toBeInTheDocument();
    });

    fireEvent.click(screen.getAllByText('Remove')[0]);

    await waitFor(() => {
      expect(axios.delete).toHaveBeenCalledWith(
        'http://localhost:8081/removeproperty/1'
      );
      expect(screen.queryByText('Property 1')).not.toBeInTheDocument();
    });
  });

  test('opens the property details dialog when View Details is clicked', async () => {
    render(<SavedProperties />);

    await waitFor(() => {
      expect(screen.getByText('Property 1')).toBeInTheDocument();
    });

    fireEvent.click(screen.getAllByText('View Details')[0]);

    await waitFor(() => {
      expect(screen.getByText('Spacious property near campus.')).toBeInTheDocument();
      expect(screen.getByText('$1200')).toBeInTheDocument();
      expect(screen.getByText('Bedrooms: 3')).toBeInTheDocument();
    });
  });

  test('closes the details dialog when Close button is clicked', async () => {
    render(<SavedProperties />);

    await waitFor(() => {
      expect(screen.getByText('Property 1')).toBeInTheDocument();
    });

    fireEvent.click(screen.getAllByText('View Details')[0]);

    await waitFor(() => {
      expect(screen.getByText('Spacious property near campus.')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Close'));

    await waitFor(() => {
      expect(screen.queryByText('Spacious property near campus.')).not.toBeInTheDocument();
    });
  });
});

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import PropertiesList from './propertieslist';

// Mock axios
jest.mock('axios');

describe('PropertiesList Component', () => {
  const mockProperties = [
    {
      Property_ID: 1,
      Property_Name: 'Property 1',
      Address: '123 Main St',
      No_Bedrooms: 3,
      No_Bathrooms: 2,
      Rent: 1500,
      Image: 'property1.jpg',
    },
    {
      Property_ID: 2,
      Property_Name: 'Property 2',
      Address: '456 Elm St',
      No_Bedrooms: 2,
      No_Bathrooms: 1,
      Rent: 1200,
      Image: 'property2.jpg',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    axios.get.mockResolvedValue({ data: mockProperties });
  });

  test('renders properties fetched from API', async () => {
    render(<PropertiesList managerId={1} />);

    await waitFor(() => {
      expect(screen.getByText('Property 1')).toBeInTheDocument();
      expect(screen.getByText('Property 2')).toBeInTheDocument();
    });

    // Verify property details are rendered
    expect(screen.getByText(/123 Main St/i)).toBeInTheDocument();
    expect(screen.getByText(/456 Elm St/i)).toBeInTheDocument();
    expect(screen.getByText(/Bedrooms: 3/i)).toBeInTheDocument();
    expect(screen.getByText(/Rent: \$1500/i)).toBeInTheDocument();
  });

  test('deletes a property when Delete button is clicked', async () => {
    axios.delete.mockResolvedValue({});

    render(<PropertiesList managerId={1} />);

    await waitFor(() => {
      expect(screen.getByText('Property 1')).toBeInTheDocument();
    });

    // Click Delete button
    fireEvent.click(screen.getAllByText('Delete')[0]);

    await waitFor(() => {
      expect(axios.delete).toHaveBeenCalledWith(
        'http://localhost:8081/deleteproperty/1',
        { headers: { 'Content-Type': 'application/json' } }
      );
    });

    // Verify Property 1 is removed
    expect(screen.queryByText('Property 1')).not.toBeInTheDocument();
  });

  test('opens the details dialog when View Details is clicked', async () => {
    render(<PropertiesList managerId={1} />);

    await waitFor(() => {
      expect(screen.getByText('Property 1')).toBeInTheDocument();
    });

    // Click View Details button
    fireEvent.click(screen.getAllByText('View Details')[0]);

    await waitFor(() => {
      expect(screen.getByLabelText('Property Name')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Property 1')).toBeInTheDocument();
    });
  });

  test('updates a property when Save is clicked in the dialog', async () => {
    axios.put.mockResolvedValue({});

    render(<PropertiesList managerId={1} />);

    await waitFor(() => {
      expect(screen.getByText('Property 1')).toBeInTheDocument();
    });

    // Open the details dialog
    fireEvent.click(screen.getAllByText('View Details')[0]);

    await waitFor(() => {
      expect(screen.getByLabelText('Property Name')).toBeInTheDocument();
    });

    // Change property details
    fireEvent.change(screen.getByLabelText('Property Name'), {
      target: { value: 'Updated Property 1' },
    });
    fireEvent.change(screen.getByLabelText('Rent'), {
      target: { value: '2000' },
    });

    // Click Save button
    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith(
        'http://localhost:8081/updateproperty/1',
        expect.objectContaining({
          Property_Name: 'Updated Property 1',
          Rent: '2000',
        }),
        { headers: { 'Content-Type': 'application/json' } }
      );
    });

    // Verify updates are reflected
    await waitFor(() => {
      expect(screen.getByText('Updated Property 1')).toBeInTheDocument();
      expect(screen.getByText('Rent: $2000')).toBeInTheDocument();
    });
  });

  test('closes the details dialog when Cancel is clicked', async () => {
    render(<PropertiesList managerId={1} />);

    await waitFor(() => {
      expect(screen.getByText('Property 1')).toBeInTheDocument();
    });

    // Open the details dialog
    fireEvent.click(screen.getAllByText('View Details')[0]);

    await waitFor(() => {
      expect(screen.getByLabelText('Property Name')).toBeInTheDocument();
    });

    // Click Cancel button
    fireEvent.click(screen.getByText('Cancel'));

    // Verify the dialog is closed
    await waitFor(() => {
      expect(screen.queryByLabelText('Property Name')).not.toBeInTheDocument();
    });
  });
});

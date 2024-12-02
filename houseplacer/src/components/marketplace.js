import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Divider,
  TextField,
} from '@mui/material';
import {
  Home,
  Bathroom,
  Bed,
  AttachMoney,
  LocationOn,
  DirectionsCar,
  School,
  Launch,
  Search,
} from '@mui/icons-material';

const Marketplace = () => {
  const [properties, setProperties] = useState([]);
  const [opened, setOpened] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [savedProperties, setSavedProperties] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [displayedProperties, setDisplayedProperties] = useState([]);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [reviewDescription, setReviewDescription] = useState('');
  const [reviewRating, setReviewRating] = useState(0);
  const [reviews, setReviews] = useState([]);
  const studentId = sessionStorage.getItem("studentId");

  useEffect(() => {
    const fetchMatchedProperties = async () => {
      const studentId = sessionStorage.getItem("studentId"); // Retrieve studentId from sessionStorage
  
      if (!studentId) {
          console.error('Student ID is missing. Ensure the user is logged in.');
          return;
      }
  
      try {
          const response = await axios.get(`http://localhost:8081/matchproperties/${studentId}`);
          console.log('Matched Properties:', response.data);
          setProperties(response.data);
          setDisplayedProperties(response.data);
      } catch (error) {
          console.error('Error fetching matched properties:', error);
      }
  };
  

    fetchMatchedProperties();
  }, []);

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setDisplayedProperties(properties);
      return;
    }

    const filteredProperties = properties.filter(property =>
      property.Property_Name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setDisplayedProperties(filteredProperties);
  };

  const fetchReviews = async (propertyId) => {
    try {
      const response = await axios.get(`http://localhost:8081/reviews/${propertyId}`);
      setReviews(response.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const handleWriteReview = (property) => {
    setSelectedProperty(property);
    setReviewDialogOpen(true);
  };

  const handleViewDetails = (property) => {
    setSelectedProperty(property);
    setOpened(true);
    fetchReviews(property.Property_ID);
  };

  const handleVisitWebsite = (website) => {
    const fullUrl = website.startsWith('http://') || website.startsWith('https://') 
      ? website 
      : `https://${website}`;
    
    window.open(fullUrl, '_blank', 'noopener,noreferrer');
  };
  

  const handleSaveProperty = async (property) => {
    const response = await axios.post('http://localhost:8081/saveproperty', {
      studentId,
      propertyId: property.Property_ID,
    });
    if (response.status === 200) {
      console.log('Property saved correctly!');
      setSavedProperties([...savedProperties, property]);
    }
  };

  const handleSubmitReview = async () => {
    const response = await axios.post('http://localhost:8081/addreview', {
      propertyId: selectedProperty.Property_ID,
      studentId,
      rating: reviewRating,
      description: reviewDescription,
    });

    if (response.status === 200) {
      console.log('Review added successfully!');
      setReviewDialogOpen(false);
      setReviewDescription('');
      setReviewRating(0);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Search Bar */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 2,
          mb: 4,
          maxWidth: '600px',
          margin: '25px auto',
          padding: '0 16px',
          width: '100%'
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search properties..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="medium"
          sx={{
            height: '48px', // Set the same height as the search button
            paddingRight: '12px', // Add right padding
            paddingLeft: '12px' // Add left padding
          }}
        />
        <Button
          variant="contained"
          onClick={handleSearch}
          startIcon={<Search />}
          sx={{
            minWidth: '120px',
            height: '48px' // Set the same height as the search bar
          }}
        >
          Search
        </Button>
      </Box>

      {/* Property Cards */}
      <Grid container spacing={3}>
        {displayedProperties.map((property) => (
          <Grid item xs={12} sm={6} key={property.Property_ID}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={`http://localhost:8081/imgs/${property.Image}`}
                alt={property.Property_Name}
              />
              <CardContent>
                <Typography variant="h5">{property.Property_Name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  <LocationOn
                    sx={{ verticalAlign: 'middle', fontSize: 'small' }}
                  />
                  {property.Address}
                </Typography>
                <Typography variant="body2">
                  Bedrooms: {property.No_Bedrooms}
                </Typography>
                <Typography variant="body2">
                  Bathrooms: {property.No_Bathrooms}
                </Typography>
                <Typography variant="body2">Rent: ${property.Rent}</Typography>
              </CardContent>

              <Box sx={{ p: 2, display: 'flex', gap: 1 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleViewDetails(property)}
                  fullWidth
                >
                  View Details
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleWriteReview(property)}
                  fullWidth
                >
                  Write a Review
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleVisitWebsite(property.Website)}
                  fullWidth
                  endIcon={<Launch />}
                >
                  Visit Website
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleSaveProperty(property)}
                  fullWidth
                >
                  Save
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={opened}
        onClose={() => setOpened(false)}
        fullWidth
        maxWidth="md"
      >
        {/* Property Details Dialog */}
      </Dialog>

      <Dialog
        open={reviewDialogOpen}
        onClose={() => setReviewDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        {/* Review Dialog */}
      </Dialog>
    </Container>
  );
};

export default Marketplace;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {
  Container,
  Grid2,
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
      try {
        const response = await axios.get(
          'http://localhost:8081/matchproperties'
        );
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
      toast.success("Property saved successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
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
      toast.success("Review submitted successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
       <ToastContainer />
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
            height: '48px', 
            paddingRight: '12px', 
            paddingLeft: '12px' 
          }}
        />
        <Button
          variant="contained"
          onClick={handleSearch}
          startIcon={<Search />}
          sx={{
            minWidth: '120px',
            height: '48px' 
          }}
        >
          Search
        </Button>
      </Box>

      {/* Property Cards */}
      <Grid2 container spacing={3}>
        {displayedProperties.map((property) => (
          <Grid2 item xs={12} sm={6} key={property.Property_ID}>
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
          </Grid2>
        ))}
      </Grid2>

      <Dialog
  open={opened}
  onClose={() => setOpened(false)}
  fullWidth
  maxWidth="md"
>
  <DialogTitle>
    <Typography variant="h5" component="div">
      {selectedProperty?.Property_Name}
    </Typography>
    <Typography variant="subtitle1" color="text.secondary">
      <LocationOn sx={{ verticalAlign: 'middle', mr: 1 }} />
      {selectedProperty?.Address}
    </Typography>
  </DialogTitle>

  <DialogContent>
    <CardMedia
      component="img"
      height="300"
      image={`http://localhost:8081/imgs/${selectedProperty?.Image}`}
      alt={selectedProperty?.Property_Name}
      sx={{ borderRadius: 1, mb: 2 }}
    />

    <Grid2 container spacing={2} sx={{ mb: 3 }}>
      <Grid2 item xs={6} sm={3}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Bed color="primary" />
          <Typography>{selectedProperty?.No_Bedrooms} Bedrooms</Typography>
        </Box>
      </Grid2>
      <Grid2 item xs={6} sm={3}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Bathroom color="primary" />
          <Typography>{selectedProperty?.No_Bathrooms} Bathrooms</Typography>
        </Box>
      </Grid2>
      <Grid2 item xs={6} sm={3}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AttachMoney color="primary" />
          <Typography>${selectedProperty?.Rent}/month</Typography>
        </Box>
      </Grid2>
      <Grid2 item xs={6} sm={3}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Home color="primary" />
          <Typography>{selectedProperty?.Sq_Footage} sq ft</Typography>
        </Box>
      </Grid2>
    </Grid2>

    <Divider sx={{ my: 2 }} />

    <Typography variant="h6" gutterBottom>
      Location & Amenities
    </Typography>
    <Grid2 container spacing={2} sx={{ mb: 3 }}>
      <Grid2 item xs={12} sm={6}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <School color="primary" />
          <Typography>{selectedProperty?.Dist_Campus} miles to campus</Typography>
        </Box>
      </Grid2>
      <Grid2 item xs={12} sm={6}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <DirectionsCar color="primary" />
          <Typography>
            {selectedProperty?.Parking ? 'Parking Available' : 'No Parking'}
          </Typography>
        </Box>
      </Grid2>
    </Grid2>

    <Divider sx={{ my: 2 }} />

    <Typography variant="h6" gutterBottom>
      Description
    </Typography>
    <Typography variant="body1" paragraph>
      {selectedProperty?.Property_Description}
    </Typography>

    <Divider sx={{ my: 2 }} />

    <Typography variant="h6" gutterBottom>
      Reviews
    </Typography>
    {reviews.length > 0 ? (
      reviews.map((review, index) => (
        <Box key={index} sx={{ mb: 2 }}>
          <Typography variant="subtitle1" color="primary">
            Rating: {review.Score}/5
          </Typography>
          <Typography variant="body2" paragraph>
            {review.Description}
          </Typography>
          <Divider />
        </Box>
      ))
    ) : (
      <Typography variant="body2" color="text.secondary">
        No reviews available for this property.
      </Typography>
    )}
  </DialogContent>

  <DialogActions>
    <Button onClick={() => setOpened(false)} color="secondary">
      Close
    </Button>
    <Button
      onClick={() => handleVisitWebsite(selectedProperty?.Website)}
      color="primary"
      variant="contained"
      endIcon={<Launch />}
    >
      Visit Website
    </Button>
  </DialogActions>
</Dialog>

      <Dialog
  open={reviewDialogOpen}
  onClose={() => setReviewDialogOpen(false)}
  fullWidth
  maxWidth="sm"
>
  <DialogTitle>Write a Review</DialogTitle>
  <DialogContent>
    <Typography variant="h6" gutterBottom>
      {selectedProperty?.Property_Name}
    </Typography>
    <TextField
      fullWidth
      multiline
      rows={4}
      variant="outlined"
      label="Your Review"
      value={reviewDescription}
      onChange={(e) => setReviewDescription(e.target.value)}
      sx={{ mb: 3 }}
    />
    <TextField
      select
      fullWidth
      label="Rating (1-5)"
      value={reviewRating}
      onChange={(e) => setReviewRating(parseInt(e.target.value, 10))}
      SelectProps={{
        native: true,
      }}
      variant="outlined"
    >
      <option value={0}>Select Rating</option>
      {[1, 2, 3, 4, 5].map((rating) => (
        <option key={rating} value={rating}>
          {rating}
        </option>
      ))}
    </TextField>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setReviewDialogOpen(false)} color="secondary">
      Cancel
    </Button>
    <Button
      onClick={handleSubmitReview}
      color="primary"
      variant="contained"
      disabled={reviewRating === 0}
    >
      Submit
    </Button>
  </DialogActions>
</Dialog>

    </Container>
  );
};


export default Marketplace;
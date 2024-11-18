import { useState, useEffect } from 'react';
import axios from 'axios';
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
} from '@mui/material';

const SavedProperties = () => {
  const [properties, setProperties] = useState([]);
  const [opened, setOpened] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);

  useEffect(() => {
    const fetchSavedProperties = async () => {
      try {
        const response = await axios.get(
          'http://localhost:8081/saved-properties'
        );
        console.log('Matched Properties:', response.data);
        setProperties(response.data);
      } catch (error) {
        console.error('Error fetching saved properties:', error);
      }
    };

    fetchSavedProperties();
  }, []);

  const handleViewDetails = (property) => {
    setSelectedProperty(property);
    setOpened(true);
  };

  const handleRemoveProperty = async (propertyId) => {
    try {
      await axios.delete(`http://localhost:8081/removeproperty/${propertyId}`);
      setProperties((prevProperties) =>
        prevProperties.filter((property) => property.Property_ID !== propertyId)
      );
      console.log('Property removed from saved properties');
    } catch (error) {
      console.error('Error removing property from saved properties:', error);
    }
  };

  const handleClose = () => {
    setOpened(false);
  };

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Saved Properties
      </Typography>

      <Grid2 container spacing={3}>
        {properties.map((property) => (
          <Grid2 item xs={12} sm={6} md={4} key={property.Property_ID}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={`http://localhost:8081/imgs/${property.Image}`}
                alt="green iguana"
              />
              <CardContent>
                <Typography
                  gutterBottom
                  variant="h5"
                  component="div"
                  align="center"
                >
                  {property.Property_Name}
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center">
                  ${property.Rent}
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center">
                  Bedrooms: {property.No_Bedrooms}
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center">
                  Bathrooms: {property.No_Bathrooms}
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center">
                  Sq. Footage: {property.Sq_Footage}
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center">
                  Distance to Campus: {property.Dist_Campus} miles
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center">
                  Parking: {property.Parking ? 'Yes' : 'No'}
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center">
                  Property Description: {property.Property_Description}
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center">
                  Website: {property.Website}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => handleViewDetails(property)}>
                  View Details
                </Button>
                <Button size="small" onClick={() => handleRemoveProperty(property.Property_ID)}>
                  Remove
                </Button>
              </CardActions>
            </Card>
          </Grid2>
        ))}
      </Grid2>

      <Dialog open={opened} onClose={handleClose}>
        <DialogTitle>Property Details</DialogTitle>
        <DialogContent>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <CardMedia
              component="img"
              height="200"
              image={`http://localhost:8081/imgs/${selectedProperty?.Image}`}
              alt="green iguana"
            />
            <Typography variant="h5" component="div" align="center">
              {selectedProperty?.Property_Name}
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center">
              ${selectedProperty?.Rent}
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center">
              Bedrooms: {selectedProperty?.No_Bedrooms}
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center">
              Bathrooms: {selectedProperty?.No_Bathrooms}
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center">
              Sq. Footage: {selectedProperty?.Sq_Footage}
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center">
              Distance to Campus: {selectedProperty?.Dist_Campus} miles
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center">
              Parking: {selectedProperty?.Parking ? 'Yes' : 'No'}
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center">
              Property Description: {selectedProperty?.Property_Description}
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center">
              Website: {selectedProperty?.Website}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SavedProperties;
import { useState, useEffect } from 'react';
import axios from 'axios';
import {Container, Grid2, Card, CardContent, CardMedia,Typography,Button,Dialog,DialogTitle,DialogContent,DialogActions,TextField} from '@mui/material';

const PropertiesList = ({ managerId }) => {
  const [properties, setProperties] = useState([]);
  const [opened, setOpened] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);

  const handleDelete = async (propertyId) => {
    try {
      await axios.delete(`http://localhost:8081/deleteproperty/${propertyId}`, {
        headers: { 'Content-Type': 'application/json' },
      });
      setProperties((prevProperties) =>
        prevProperties.filter((property) => property.Property_ID !== propertyId)
      );
      console.log('Property deleted successfully');
    } catch (error) {
      console.error('Error deleting property:', error);
    }
  };

  const handleDetails = (property) => {
    setSelectedProperty({ ...property }); 
    setOpened(true); 
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedProperty((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await axios.put(
        `http://localhost:8081/updateproperty/${selectedProperty.Property_ID}`,
        selectedProperty,
        { headers: { 'Content-Type': 'application/json' } }
      );
      setProperties((prevProperties) =>
        prevProperties.map((property) =>
          property.Property_ID === selectedProperty.Property_ID ? selectedProperty : property
        )
      );
      setOpened(false); 
      console.log('Property updated successfully');
    } catch (error) {
      console.error('Error updating property:', error);
    }
  };


  useEffect(() => {
    console.log("Entry")
    if (!managerId) return;

    const fetchProperties = async () => {
        try {
            const response = await axios.get(`http://localhost:8081/properties?managerId=${managerId}`);
            console.log("Properties:", response.data);
            setProperties(response.data);
        } catch (error) {
            console.error('Error fetching properties:', error);
        }
    };

    fetchProperties();
}, [managerId]);


console.log('Properties:', properties);
  return (
    <Container>
      <Grid2 container spacing={3}>
        {properties.map((property) => (
          <Grid2 item xs={12} sm={6} md={4} key={property.Property_ID}>
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
                  {property.Address}
                </Typography>
                <Typography variant="body2">Bedrooms: {property.No_Bedrooms}</Typography>
                <Typography variant="body2">Bathrooms: {property.No_Bathrooms}</Typography>
                <Typography variant="body2">Rent: ${property.Rent}</Typography>
              </CardContent>
              <Button variant="contained" color="primary" onClick = {() => handleDetails(property)}>
                View Details
              </Button>
              <Button variant="contained" color="secondary" key={property.Property_ID}  onClick={() => handleDelete(property.Property_ID)}>
                Delete
              </Button>
            </Card>
          </Grid2>
        ))}
      </Grid2>

      <Dialog open={opened} onClose={() => setOpened(false)} fullWidth>
        <DialogTitle>Property Details</DialogTitle>
        <DialogContent>
          <TextField fullWidth margin="dense" label="Property Name" name="Property_Name" value={selectedProperty?.Property_Name} onChange={handleInputChange}/>
          <TextField fullWidth margin="dense" label="Address" name="Address" value={selectedProperty?.Address} onChange={handleInputChange}/>
          <TextField fullWidth margin="dense" label="Number of Bedrooms" name="No_Bedrooms" type="number" value={selectedProperty?.No_Bedrooms} onChange={handleInputChange}/>
          <TextField fullWidth margin="dense" label="Number of Bathrooms" name="No_Bathrooms" type="number" value={selectedProperty?.No_Bathrooms} onChange={handleInputChange}/>
          <TextField fullWidth margin="dense" label="Rent" name="Rent" type="number" value={selectedProperty?.Rent} onChange={handleInputChange}/>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpened(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};



export default PropertiesList;

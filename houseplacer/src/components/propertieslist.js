import { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Grid2, Card, CardContent, CardMedia, Typography, Button } from '@mui/material';

const PropertiesList = ({ managerId }) => {
  const [properties, setProperties] = useState([]);

  const handleDelete = async (propertyId) =>{
    try {
      await axios.delete(`http://localhost:8081/deleteproperty/${propertyId}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setProperties((prevProperties) =>
        prevProperties.filter((property) => property.ID !== propertyId)
      );
      console.log(propertyId);
      console.log('Property deleted successfully');
    } catch (error) {
      console.error('Error deleting property:', error);
    }
  }


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
              {/* Display property image */}
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
              <Button variant="contained" color="primary">
                View Details
              </Button>
              <Button variant="contained" color="secondary" key={property.Property_ID}  onClick={() => handleDelete(property.Property_ID)}>
                Delete
              </Button>
            </Card>
          </Grid2>
        ))}
      </Grid2>
    </Container>
  );
};



export default PropertiesList;

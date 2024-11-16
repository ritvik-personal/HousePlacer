import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import {
  TextField,
  Button,
  Container,
  Typography,
  Grid,
  Box,
  Checkbox,
  FormControlLabel,
} from '@mui/material';

const PropertyForm = () => {

  const managerId = sessionStorage.getItem("managerId");

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    bedrooms: '',
    rent: '',
    bathrooms: '',
    squareFootage: '',
    distanceToCampus: '',
    parkingAvailable: false,
    propertyDescription: '',
    website: '', // New field for website
    image: null,
  });



  const [errors, setErrors] = useState({});
  const [fileName, setFileName] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const handleCheckboxChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.checked,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      image: file,
    });
    setFileName(file ? file.name : '');

    if (errors.image) {
      setErrors({
        ...errors,
        image: '',
      });
    }
  };

  const handleRemoveImage = () => {
    setFormData({
      ...formData,
      image: null,
    });
    setFileName('');
  };

  const validateForm = () => {
    let formErrors = {};

    if (!formData.name.trim()) formErrors.name = 'Property Name is required';
    if (!formData.address.trim()) formErrors.address = 'Address is required';
    if (!formData.bedrooms || isNaN(formData.bedrooms))
      formErrors.bedrooms = 'Number of bedrooms is required';
    if (!formData.rent || isNaN(formData.rent))
      formErrors.rent = 'Rent is required';
    if (!formData.bathrooms || isNaN(formData.bathrooms))
      formErrors.bathrooms = 'Number of bathrooms is required';
    if (!formData.squareFootage || isNaN(formData.squareFootage))
      formErrors.squareFootage = 'Square footage is required';
    if (!formData.distanceToCampus || isNaN(formData.distanceToCampus))
      formErrors.distanceToCampus = 'Distance to campus is required';
    if (!formData.website.trim()) formErrors.website = 'Website is required'; // Validate website
    if (!formData.image) formErrors.image = 'Image is required';

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Form Submitted', formData);
      axios.post("http://localhost:8081/newproperty",{
        managerId: managerId,
        property_name: formData.name,
        no_bedrooms: formData.bedrooms,
        address: formData.address,
        no_bathrooms: formData.bathrooms,
        sq_footage: formData.squareFootage,
        dist_campus: formData.distanceToCampus,
        parking: formData.parkingAvailable,
        property_description: formData.propertyDescription,
        rent: formData.rent,
        website: formData.website,
      }).then((response) => {
        if(response.data.message){
          console.log("Property added successfully.");
        }
      })
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5, mb: 5 }}>
      <Box
        sx={{
          boxShadow: 3,
          p: 5,
          borderRadius: 2,
          backgroundColor: 'white',
          border: '1px solid #ddd',
        }}
      >
        <Typography
          variant="h3"
          align="center"
          gutterBottom
          sx={{ fontFamily: "'Roboto Slab', serif" }}
        >
          Add a Property
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {/* Property Name */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="name"
                label="Property Name"
                placeholder="Enter property name"
                variant="outlined"
                value={formData.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
              />
            </Grid>

            {/* Address */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="address"
                label="Address"
                placeholder="Enter property address"
                variant="outlined"
                value={formData.address}
                onChange={handleChange}
                error={!!errors.address}
                helperText={errors.address}
              />
            </Grid>

            {/* Bedrooms */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="bedrooms"
                label="Bedrooms"
                placeholder="Enter number of bedrooms"
                type="number"
                variant="outlined"
                value={formData.bedrooms}
                onChange={handleChange}
                error={!!errors.bedrooms}
                helperText={errors.bedrooms}
              />
            </Grid>

            {/* Rent */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="rent"
                label="Rent"
                placeholder="Enter rent"
                type="number"
                variant="outlined"
                value={formData.rent}
                onChange={handleChange}
                error={!!errors.rent}
                helperText={errors.rent}
              />
            </Grid>

            {/* Bathrooms */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="bathrooms"
                label="Bathrooms"
                placeholder="Enter number of bathrooms"
                type="number"
                variant="outlined"
                value={formData.bathrooms}
                onChange={handleChange}
                error={!!errors.bathrooms}
                helperText={errors.bathrooms}
              />
            </Grid>

            {/* Square Footage */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="squareFootage"
                label="Square Footage"
                placeholder="Enter square footage"
                type="number"
                variant="outlined"
                value={formData.squareFootage}
                onChange={handleChange}
                error={!!errors.squareFootage}
                helperText={errors.squareFootage}
              />
            </Grid>

            {/* Distance to Campus */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="distanceToCampus"
                label="Distance to Campus"
                placeholder="Enter distance to campus"
                type="number"
                variant="outlined"
                value={formData.distanceToCampus}
                onChange={handleChange}
                error={!!errors.distanceToCampus}
                helperText={errors.distanceToCampus}
              />
            </Grid>

            {/* Website */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="website"
                label="Website"
                placeholder="Enter property website URL"
                variant="outlined"
                value={formData.website}
                onChange={handleChange}
                error={!!errors.website}
                helperText={errors.website}
              />
            </Grid>

            {/* Parking Availability */}
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.parkingAvailable}
                    onChange={handleCheckboxChange}
                    name="parkingAvailable"
                  />
                }
                label="Parking Available"
              />
            </Grid>

            {/* Property Description */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="propertyDescription"
                label="Property Description"
                placeholder="Enter property description"
                multiline
                rows={4}
                variant="outlined"
                value={formData.propertyDescription}
                onChange={handleChange}
              />
            </Grid>

            {/* Image Upload */}
            <Grid item xs={12}>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="upload-image"
                type="file"
                onChange={handleImageChange}
              />
              <label htmlFor="upload-image">
                <Button variant="contained" component="span">
                  Upload Image
                </Button>
              </label>
              {fileName && (
                <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body1" sx={{ mr: 2 }}>
                    {fileName}
                  </Typography>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={handleRemoveImage}
                  >
                    Remove
                  </Button>
                </Box>
              )}
              {errors.image && (
                <Typography color="error">{errors.image}</Typography>
              )}
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                className="btn btn-primary btn-lg"
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Container>
  );
};

export default PropertyForm;
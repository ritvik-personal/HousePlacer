import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  TextField,
  Button,
  Container,
  Typography,
  Grid,
  Box,
  Checkbox,
  FormControlLabel,
  Select,
  MenuItem,
} from '@mui/material';

const StudentPreferenceForm = () => {
  const [formData, setFormData] = useState({
    bedrooms: '',
    bathrooms: '',
    rent: '',
    squareFootage: '',
    distanceToCampus: '',
    distanceToDining: '',
    distanceToGym: '',
    parkingRequired: false,
    priorityRankings: {
      bedrooms: '',
      bathrooms: '',
      rent: '',
      squareFootage: '',
      distanceToCampus: '',
      distanceToDining: '',
      distanceToGym: '',
    },
    additionalNotes: '',
  });

  const studentId = sessionStorage.getItem("studentId");
  

  const [errors, setErrors] = useState({});

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

  const handlePriorityChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      priorityRankings: {
        ...formData.priorityRankings,
        [name]: value,
      },
    });

    if (errors.priorityRankings && errors.priorityRankings[name]) {
      setErrors({
        ...errors,
        priorityRankings: {
          ...errors.priorityRankings,
          [name]: '',
        },
      });
    }
  };

  const validateForm = () => {
    let formErrors = {};
    if (!formData.bedrooms)
      formErrors.bedrooms = 'Number of bedrooms is required';
    if (!formData.bathrooms)
      formErrors.bathrooms = 'Number of bathrooms is required';
    if (!formData.rent) formErrors.rent = 'Rent is required';
    if (!formData.squareFootage)
      formErrors.squareFootage = 'Square footage is required';
    if (!formData.distanceToCampus)
      formErrors.distanceToCampus = 'Distance to campus is required';
    if (!formData.distanceToDining)
      formErrors.distanceToDining = 'Distance to dining is required';
    if (!formData.distanceToGym)
      formErrors.distanceToGym = 'Distance to gym is required';

    // Validate priority rankings
    const priorityErrors = {};
    Object.keys(formData.priorityRankings).forEach((key) => {
      if (!formData.priorityRankings[key]) {
        priorityErrors[key] = `Priority for ${key.replace(
          /([A-Z])/g,
          ' $1'
        )} is required`;
      }
    });

    if (Object.keys(priorityErrors).length > 0) {
      formErrors.priorityRankings = priorityErrors;
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Form Submitted', formData);
      axios.post("http://localhost:8081/newpreference",{
        student_id : studentId,
        no_bedrooms: formData.bedrooms,
        no_bedrooms_priority : formData.priorityRankings.bedrooms,
        no_bathrooms: formData.bathrooms,
        no_bathrooms_priority: formData.priorityRankings.bathrooms, 
        sq_footage: formData.squareFootage,
        sq_footage_priority: formData.priorityRankings.squareFootage, 
        budget: formData.rent,
        budget_priority: formData.priorityRankings.rent,
        dist_gym: formData.distanceToGym,
        dist_gym_priority: formData.priorityRankings.distanceToGym,
        dist_dining: formData.distanceToDining,
        dist_dining_priority: formData.priorityRankings.distanceToDining,
        dist_campus: formData.distanceToCampus,
        dist_campus_priority: formData.priorityRankings.distanceToCampus,
        parking: formData.parkingRequired,
        notes: formData.additionalNotes,
      }).then((response) => {
        if(response.data.message){
          console.log("Preferences logged successfully.");
        }
      })
    }
  };

  useEffect(() => {
    const fetchPreferences = async () => {
      const studentId = sessionStorage.getItem("studentId");
  
      if (studentId) {
        try {
          const response = await axios.get(`http://localhost:8081/getpreferences?studentId=${studentId}`);
          console.log(response);
          if (response.status === 200) {
            const fetchedData = response.data;
          
            setFormData({
              bedrooms: String(fetchedData.bedrooms),
              bathrooms: String(fetchedData.bathrooms || ''),
              rent: String(fetchedData.rent || ''),
              squareFootage: String(fetchedData.squareFootage || ''),
              distanceToCampus: String(fetchedData.distanceToCampus || ''),
              distanceToDining: String(fetchedData.distanceToDining || ''),
              distanceToGym: String(fetchedData.distanceToGym || ''),
              parkingRequired: String(fetchedData.parkingRequired ?? false), // Convert boolean to string
              priorityRankings: {
                bedrooms: String(fetchedData.priorityRankings?.bedrooms || ''),
                bathrooms: String(fetchedData.priorityRankings?.bathrooms || ''),
                rent: String(fetchedData.priorityRankings?.rent || ''),
                squareFootage: String(fetchedData.priorityRankings?.squareFootage || ''),
                distanceToCampus: String(fetchedData.priorityRankings?.distanceToCampus || ''),
                distanceToDining: String(fetchedData.priorityRankings?.distanceToDining || ''),
                distanceToGym: String(fetchedData.priorityRankings?.distanceToGym || ''),
              },
              additionalNotes: String(fetchedData.additionalNotes || ''),
            });
          }
        } catch (error) {
          console.error('Error fetching preferences:', error);
        }
      }
    };
  
    fetchPreferences();
  }, []);
  
  

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
          Student Preference Form
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {/* Bedrooms */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="bedrooms"
                label="Bedrooms"
                placeholder="Enter minimum bedrooms"
                type="number"
                variant="outlined"
                value={formData.bedrooms}
                onChange={handleChange}
                error={!!errors.bedrooms}
                helperText={errors.bedrooms}
              />
            </Grid>

            {/* Bathrooms */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="bathrooms"
                label="Bathrooms"
                placeholder="Enter minimum bathrooms"
                type="number"
                variant="outlined"
                value={formData.bathrooms}
                onChange={handleChange}
                error={!!errors.bathrooms}
                helperText={errors.bathrooms}
              />
            </Grid>

            {/* Rent */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="rent"
                label="Rent Budget"
                placeholder="Enter maximum rent"
                type="number"
                variant="outlined"
                value={formData.rent}
                onChange={handleChange}
                error={!!errors.rent}
                helperText={errors.rent}
              />
            </Grid>

            {/* Square Footage */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="squareFootage"
                label="Square Footage"
                placeholder="Enter minimum square footage"
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
                placeholder="Enter max distance to campus"
                type="number"
                variant="outlined"
                value={formData.distanceToCampus}
                onChange={handleChange}
                error={!!errors.distanceToCampus}
                helperText={errors.distanceToCampus}
              />
            </Grid>

            {/* Distance to Dining */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="distanceToDining"
                label="Distance to Dining"
                placeholder="Enter max distance to dining"
                type="number"
                variant="outlined"
                value={formData.distanceToDining}
                onChange={handleChange}
                error={!!errors.distanceToDining}
                helperText={errors.distanceToDining}
              />
            </Grid>

            {/* Distance to Gym */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="distanceToGym"
                label="Distance to Gym"
                placeholder="Enter max distance to gym"
                type="number"
                variant="outlined"
                value={formData.distanceToGym}
                onChange={handleChange}
                error={!!errors.distanceToGym}
                helperText={errors.distanceToGym}
              />
            </Grid>

            {/* Parking Requirement */}
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.parkingRequired}
                    onChange={handleCheckboxChange}
                    name="parkingRequired"
                  />
                }
                label="Parking Required"
              />
            </Grid>

            {/* Priority Rankings */}
            <Grid item xs={12}>
              <Typography variant="h6">
                Priority (how important each factor is)
              </Typography>
            </Grid>

            {Object.keys(formData.priorityRankings).map((key) => (
              <Grid item xs={12} sm={6} key={key}>
                <TextField
                  select
                  fullWidth
                  name={key}
                  label={`Priority: ${key.replace(/([A-Z])/g, ' $1')}`}
                  value={formData.priorityRankings[key]}
                  onChange={handlePriorityChange}
                  error={
                    !!(errors.priorityRankings && errors.priorityRankings[key])
                  }
                  helperText={
                    errors.priorityRankings && errors.priorityRankings[key]
                  }
                >
                  {[1, 2, 3, 4, 5].map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            ))}

            {/* Additional Notes */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="additionalNotes"
                label="Additional Notes"
                placeholder="Enter any additional preferences or requirements"
                multiline
                rows={4}
                variant="outlined"
                value={formData.additionalNotes}
                onChange={handleChange}
              />
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Button variant="contained" color="primary" type="submit">
                Submit Preferences
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Container>
  );
};

export default StudentPreferenceForm;
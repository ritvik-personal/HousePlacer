import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
    
    if (
      ['bedrooms', 'bathrooms', 'rent', 'squareFootage', 'distanceToCampus', 'distanceToDining', 'distanceToGym'].includes(name) &&
      parseFloat(value) < 0
    ) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: 'Value cannot be negative',
      }));
      return;
    }
  
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
    
    
    if (!formData.bedrooms) {
      formErrors.bedrooms = 'Number of bedrooms is required';
    } else if (parseInt(formData.bedrooms) < 0) {
      formErrors.bedrooms = 'Number of bedrooms cannot be negative';
    }
    
    if (!formData.bathrooms) {
      formErrors.bathrooms = 'Number of bathrooms is required';
    } else if (parseInt(formData.bathrooms) < 0) {
      formErrors.bathrooms = 'Number of bathrooms cannot be negative';
    }
    
    if (!formData.rent) {
      formErrors.rent = 'Rent is required';
    } else if (parseFloat(formData.rent) < 0) {
      formErrors.rent = 'Rent cannot be negative';
    }
    
    if (!formData.squareFootage) {
      formErrors.squareFootage = 'Square footage is required';
    } else if (parseFloat(formData.squareFootage) < 0) {
      formErrors.squareFootage = 'Square footage cannot be negative';
    }
    
    if (!formData.distanceToCampus) {
      formErrors.distanceToCampus = 'Distance to campus is required';
    } else if (parseFloat(formData.distanceToCampus) < 0) {
      formErrors.distanceToCampus = 'Distance to campus cannot be negative';
    }
    
    if (!formData.distanceToDining) {
      formErrors.distanceToDining = 'Distance to dining is required';
    } else if (parseFloat(formData.distanceToDining) < 0) {
      formErrors.distanceToDining = 'Distance to dining cannot be negative';
    }
    
    if (!formData.distanceToGym) {
      formErrors.distanceToGym = 'Distance to gym is required';
    } else if (parseFloat(formData.distanceToGym) < 0) {
      formErrors.distanceToGym = 'Distance to gym cannot be negative';
    }
  
    const priorityErrors = {};
    Object.keys(formData.priorityRankings).forEach((key) => {
      if (!formData.priorityRankings[key]) {
        priorityErrors[key] = `Priority for ${key.replace(/([A-Z])/g, ' $1')} is required`;
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
          toast.success("Preferences submitted successfully!", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        }
      }).catch((error) => {
        console.error("Error submitting preferences:", error);
        toast.error("Failed to submit preferences. Please try again.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      });
    } else {
      toast.error("Please fill out all required fields.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const savePreferences = async () => {
    try {
      const transformedData = {
        no_bedrooms: formData.bedrooms,
        no_bedrooms_priority: formData.priorityRankings.bedrooms,
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
      };
  
      const response = await axios.put(
        `http://localhost:8081/updatepreferences/${studentId}`,
        transformedData,
        { headers: { 'Content-Type': 'application/json' } }
      );
  
      console.log('Preferences updated successfully:', response.data);
      toast.success("Preferences saved successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      console.error('Error updating preferences:', error);
      toast.error("Failed to save preferences. Please try again.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
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
              bedrooms: String(fetchedData.Bedrooms),
              bathrooms: String(fetchedData.Bathrooms),
              rent: String(fetchedData.Rent),
              squareFootage: String(fetchedData.Sq_ft),
              distanceToCampus: String(fetchedData.DistC),
              distanceToDining: String(fetchedData.DistD),
              distanceToGym: String(fetchedData.DistG),
              parkingRequired: Boolean(fetchedData.Parking == 1),
              priorityRankings: {
                bedrooms: String(fetchedData.Bedrooms_P),
                bathrooms: String(fetchedData.Bathrooms_P),
                rent: String(fetchedData.Rent_P),
                squareFootage: String(fetchedData.Sq_ft_P),
                distanceToCampus: String(fetchedData.DistC_P),
                distanceToDining: String(fetchedData.DistD_P),
                distanceToGym: String(fetchedData.DistG_P),
              },
              additionalNotes: String(fetchedData.Notes),
            });
          }
        } catch (error) {
          console.error('Error fetching preferences:', error);
          toast.error("Failed to load previous preferences.", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        }
      }
    };
  
    fetchPreferences();
  }, []);
  
  
  return (
    <Container  sx={{ mt: 5,ml:8,mr:0, width: '100%' }}>
      <ToastContainer />
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
          <Grid container spacing={3}>
            {/* Main Form Fields */}
            <Grid item xs={12} md={6}>
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
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
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
                sx={{ mb: 2 }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
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
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
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
                sx={{ mb: 2 }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
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
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
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
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
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
                sx={{ mb: 2 }}
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
              <Typography variant="h6" sx={{ mb: 2 }}>
                Priority (how important each factor is)
              </Typography>
            </Grid>

            {Object.keys(formData.priorityRankings).map((key) => (
              <Grid item xs={12} sm={6} md={4} key={key}>
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
                  sx={{ mb: 2 }}
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
                sx={{ mb: 2 }}
              />
            </Grid>

            {/* Submit Buttons */}
            <Grid item xs={12} container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Button 
                  fullWidth 
                  variant="contained" 
                  color="secondary" 
                  onClick={() => savePreferences()}
                >
                  Save Preferences
                </Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button 
                  fullWidth 
                  variant="contained" 
                  color="primary" 
                  type="submit"
                >
                  Submit Preferences
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Container>
  );
};

export default StudentPreferenceForm;
import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function PropertyForm() {
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
    image: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCheckboxChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.checked,
    });
  };

  const handleImageChange = (e) => {
    setFormData({
      ...formData,
      image: e.target.files[0],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Submitted', formData);
  };

  return (
    <div className="container-fluid mt-5">
      <h2 className="mb-4 text-center">Add a Property</h2>
      <form
        onSubmit={handleSubmit}
        className="mx-auto"
        style={{ maxWidth: '900px' }}
      >
        {/* Property Name */}
        <div className="row mb-3">
          <label className="col-md-3 col-form-label">Property Name</label>
          <div className="col-md-9">
            <input
              type="text"
              className="form-control"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Property Name"
            />
          </div>
        </div>

        {/* Number of Bedrooms */}
        <div className="row mb-3">
          <label className="col-md-3 col-form-label">Number of Bedrooms</label>
          <div className="col-md-9">
            <input
              type="number"
              className="form-control"
              name="bedrooms"
              value={formData.bedrooms}
              onChange={handleChange}
              placeholder="Number of Bedrooms"
            />
          </div>
        </div>

        {/* Address */}
        <div className="row mb-3">
          <label className="col-md-3 col-form-label">Address</label>
          <div className="col-md-9">
            <input
              type="text"
              className="form-control"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="1234 Main St"
            />
          </div>
        </div>

        {/* Rent */}
        <div className="row mb-3">
          <label className="col-md-3 col-form-label">Rent</label>
          <div className="col-md-9">
            <input
              type="number"
              className="form-control"
              name="rent"
              value={formData.rent}
              onChange={handleChange}
              placeholder="Rent"
            />
          </div>
        </div>

        {/* Bathrooms */}
        <div className="row mb-3">
          <label className="col-md-3 col-form-label">Bathrooms</label>
          <div className="col-md-9">
            <input
              type="number"
              className="form-control"
              name="bathrooms"
              value={formData.bathrooms}
              onChange={handleChange}
              placeholder="Number of Bathrooms"
            />
          </div>
        </div>

        {/* Square Footage */}
        <div className="row mb-3">
          <label className="col-md-3 col-form-label">Square Footage</label>
          <div className="col-md-9">
            <input
              type="number"
              className="form-control"
              name="squareFootage"
              value={formData.squareFootage}
              onChange={handleChange}
              placeholder="Square Footage"
            />
          </div>
        </div>

        {/* Distance to Campus */}
        <div className="row mb-3">
          <label className="col-md-3 col-form-label">
            Distance to Campus (in minutes)
          </label>
          <div className="col-md-9">
            <input
              type="number"
              className="form-control"
              name="distanceToCampus"
              value={formData.distanceToCampus}
              onChange={handleChange}
              placeholder="Distance to Campus"
            />
          </div>
        </div>

        {/* Parking Availability */}
        <div className="row mb-3">
          <label className="col-md-3 col-form-label">Parking Available</label>
          <div className="col-md-9">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                name="parkingAvailable"
                checked={formData.parkingAvailable}
                onChange={handleCheckboxChange}
              />
              <label className="form-check-label">Yes</label>
            </div>
          </div>
        </div>

        {/* Property Description */}
        <div className="row mb-3">
          <label className="col-md-3 col-form-label">
            Property Description
          </label>
          <div className="col-md-9">
            <textarea
              className="form-control"
              name="propertyDescription"
              rows="3"
              value={formData.propertyDescription}
              onChange={handleChange}
              placeholder="Property Description"
            ></textarea>
          </div>
        </div>

        {/* Image Upload */}
        <div className="row mb-3">
          <label className="col-md-3 col-form-label">
            Upload Property Image
          </label>
          <div className="col-md-9">
            <input
              type="file"
              className="form-control-file"
              name="image"
              onChange={handleImageChange}
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="row">
          <div className="col-md-9 offset-md-3 mb-3">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

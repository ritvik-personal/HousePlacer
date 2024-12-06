const request = require('supertest');
const { app, db } = require('./server'); // Adjust the path to your server.js file

describe('Housing Project Backend API Tests (with DB Connection)', () => {
  beforeAll((done) => {
    // Ensure database is connected before running tests
    db.connect((err) => {
      if (err) {
        console.error('Error connecting to the database:', err);
        return done(err);
      }
      console.log('Connected to the database for testing.');
      done();
    });
  });

  afterAll((done) => {
    // Close the database connection after all tests
    db.end((err) => {
      if (err) {
        console.error('Error disconnecting from the database:', err);
        return done(err);
      }
      console.log('Disconnected from the database.');
      done();
    });
  });

  test('GET / - should return backend message', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual('From Backend Side');
  });

  test('POST /register - should register a user successfully', async () => {
    const response = await request(app).post('/register').send({
      classification: 'Student',
      email: 'test@student.com',
      username: 'testuser',
      password: 'password123',
    });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('message', 'User registered successfully');
    expect(response.body).toHaveProperty('userId');
  });

  test('POST /login - should log in successfully with correct credentials', async () => {
    const response = await request(app).post('/login').send({
      classification: 0,
      username: 'testuser',
      password: 'password123',
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('message', 'Success');
    expect(response.body).toHaveProperty('userId');
  });

  test('GET /reviews/:propertyId - should return reviews for a property', async () => {
    const response = await request(app).get('/reviews/1');

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    if (response.body.length > 0) {
      expect(response.body[0]).toHaveProperty('Score');
      expect(response.body[0]).toHaveProperty('Description');
    }
  });

  test('POST /addreview - should add a review successfully', async () => {
    const response = await request(app).post('/addreview').send({
      propertyId: 1,
      studentId: 12345,
      rating: 5,
      description: 'Great property!',
    });

    expect(response.statusCode).toBe(200);
    expect(response.text).toBe('Review added successfully');
  });

  test('POST /newproperty - should add a new property successfully', async () => {
    const response = await request(app)
      .post('/newproperty')
      .field('managerId', 1)
      .field('property_name', 'Test Property')
      .field('no_bedrooms', 2)
      .field('no_bathrooms', 1)
      .field('address', '123 Test St')
      .field('sq_footage', 800)
      .field('dist_campus', 1)
      .field('parking', true)
      .field('property_description', 'A great property')
      .field('rent', 1000)
      .field('website', 'http://testproperty.com')
      .attach('image', Buffer.from('test-image'), 'test.jpg');

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('message', 'Property added successfully');
  });

  test('GET /getpreferences - should return preferences for a student', async () => {
    const response = await request(app).get('/getpreferences').query({
      studentId: 12345,
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('Student_ID', 12345);
    expect(response.body).toHaveProperty('Bedrooms');
    expect(response.body).toHaveProperty('Bathrooms');
  });
});






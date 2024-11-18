module.exports = {
  moduleNameMapper: {
    '\\.(css|scss|sass|less)$': '<rootDir>/fileMock.js', // Mock CSS
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/fileMock.js', // Mock images
  },
  testEnvironment: 'jsdom',
};





  
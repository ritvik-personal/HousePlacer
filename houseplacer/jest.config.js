
module.exports = {
    transform: {
      "^.+\\.jsx?$": "babel-jest",
    },
    moduleNameMapper: {
      "^axios$": "axios/dist/node/axios.cjs", 
    },
      moduleNameMapper: {
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
      },
        moduleNameMapper: {
          '\\.(css|less|scss|sass)$': 'HousePlacer/houseplacer/__mocks__/styleMock.js',
        },
  };
  
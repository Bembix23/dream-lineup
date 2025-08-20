module.exports = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|svg)$": "<rootDir>/mocks/fileMock.js",
    "\\.(css|less|scss)$": "<rootDir>/mocks/styleMock.js",
  }
};
// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

beforeAll(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () =>
        Promise.resolve({
          leagues: [{ id: 1, name: "Ligue 1" }],
          teams: [{ id: 1, name: "PSG" }],
          players: [{ id: 1, name: "Mbappé" }],
        }),
    })
  );

  const localStorageMock = (() => {
    let store = {};
    return {
      getItem: (key) => store[key] || null,
      setItem: (key, value) => (store[key] = value.toString()),
      removeItem: (key) => delete store[key],
      clear: () => (store = {}),
    };
  })();
  Object.defineProperty(window, "localStorage", {
    value: localStorageMock,
  });

  global.Image = class {
    constructor() {
      setTimeout(() => {
        if (this.onload) this.onload();
      }, 0);
    }
  };
});


afterEach(() => {
  jest.clearAllMocks();
});

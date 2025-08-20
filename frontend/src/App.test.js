import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "./App";

jest.mock("./firebase", () => ({
  auth: {
    currentUser: null,
    onAuthStateChanged: jest.fn((callback) => {
      callback(null);
      return jest.fn();
    }),
  },
  signOut: jest.fn(),
  onAuthStateChanged: jest.fn((auth, callback) => {
    callback(null);
    return jest.fn();
  }),
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([]),
  })
);

beforeEach(() => {
  jest.clearAllMocks();
  const { auth } = require("./firebase");
  auth.currentUser = null;
  auth.onAuthStateChanged.mockImplementation((callback) => {
    callback(null);
    return jest.fn();
  });
});

describe("App component", () => {
  test("affiche le titre Dream Lineup", () => {
    render(<App />);
    expect(screen.getByText(/Dream Lineup/i)).toBeInTheDocument();
  });

  test("boutons principaux présents sur la page menu quand user non connecté", () => {
    render(<App />);
    expect(screen.getByText(/Se Connecter/i)).toBeInTheDocument();
    expect(screen.getByText(/Créer une équipe/i)).toBeInTheDocument();
  });

  test("clic sur 'Se connecter' ouvre le choix login/register", async () => {
    render(<App />);
    fireEvent.click(screen.getByText(/Se Connecter/i));
    
    await waitFor(() => {
      expect(screen.getByText(/Se connecter/i)).toBeInTheDocument();
      expect(screen.getByText(/Créer un compte/i)).toBeInTheDocument();
    });
  });

  // TODO: Test complexe à implémenter plus tard
  // test("bouton logout visible si user connecté")
  // });

  test("affiche le menu principal quand aucune action spécifique", () => {
    render(<App />);
    expect(screen.getByText(/Dream Lineup/i)).toBeInTheDocument();
    expect(screen.getByText(/Se Connecter/i)).toBeInTheDocument();
  });
});

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Field from "./Field";

// Mock global de window.alert
Object.defineProperty(window, 'alert', {
  writable: true,
  value: jest.fn(),
});

jest.mock("./firebase", () => ({
  auth: {
    currentUser: {
      getIdToken: jest.fn(() => Promise.resolve("fake-token-12345678901234567890123456789012345"))
    },
    onAuthStateChanged: jest.fn((callback) => {
      callback(null);
      return jest.fn();
    }),
  },
}));

jest.mock("./api", () => ({
  apiGet: jest.fn((url) => {
    if (url.includes("leagues")) {
      return Promise.resolve({
        json: () => Promise.resolve([{ id: 1, name: "Ligue 1" }])
      });
    }
    if (url.includes("teams")) {
      return Promise.resolve({
        json: () => Promise.resolve([{ id: 1, name: "PSG", crest: "psg-logo.png" }])
      });
    }
    if (url.includes("players")) {
      return Promise.resolve({
        json: () => Promise.resolve([{ id: 1, name: "Mbappé" }])
      });
    }
    
    return Promise.resolve({
      json: () => Promise.resolve([])
    });
  }),
  
  apiPost: jest.fn(() => Promise.resolve({
    json: () => Promise.resolve({ success: true })
  }))
}));

beforeEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
  window.alert.mockClear();
});

describe("Field component", () => {
  test("le terrain s'affiche avec la bonne formation et couleur", () => {
    render(<Field formation="4-4-2" onBack={() => {}} />);
    expect(screen.getByAltText(/terrain/i)).toBeInTheDocument();
    expect(screen.getByText(/4-4-2/)).toBeInTheDocument();
  });

  test("bouton Sauvegarder -> popup Auth si pas d'user", () => {
    render(<Field formation="4-4-2" onBack={() => {}} />);
    fireEvent.click(screen.getByLabelText("Sauvegarder l'équipe actuelle"));
    expect(screen.getByText(/Connexion requise/i)).toBeInTheDocument();
  });

  test("bouton Sauvegarder -> popup Save si user avec au moins un joueur", () => {
    // 🔧 Créer une équipe avec au moins un joueur
    const teamWithPlayer = Array(11).fill(null);
    teamWithPlayer[0] = { id: 1, name: "Test Player" };
    
    render(<Field formation="4-4-2" onBack={() => {}} user={{ uid: "123" }} team={teamWithPlayer} />);
    fireEvent.click(screen.getByLabelText("Sauvegarder l'équipe actuelle"));
    expect(screen.getByText(/Nomme ton équipe/i)).toBeInTheDocument();
  });

  test("le bouton Sauvegarder est désactivé si l'équipe n'est pas complète", () => {
    render(<Field formation="4-4-2" onBack={() => {}} user={{ uid: "123" }} />);
    
    const saveButton = screen.getByLabelText("Sauvegarder l'équipe actuelle");
    expect(saveButton).toBeInTheDocument();
    
    // Équipe vide = pas de popup
    fireEvent.click(saveButton);
    expect(screen.queryByText(/Nomme ton équipe/i)).not.toBeInTheDocument();
  });

  test("le bouton Retour appelle la fonction onBack", () => {
    const onBack = jest.fn();
    render(<Field formation="4-4-2" onBack={onBack} />);
    fireEvent.click(screen.getByRole("button", { name: /Retour/i }));
    expect(onBack).toHaveBeenCalled();
  });

  test("la popup joueur s'ouvre et se ferme correctement", async () => {
    const { apiGet } = require('./api');
    
    render(<Field formation="4-4-2" onBack={() => {}} />);
    
    const addButtons = screen.getAllByText("+");
    fireEvent.click(addButtons[0]);
    
    expect(apiGet).toHaveBeenCalledWith("http://localhost:4000/football/leagues");
    
    expect(await screen.findByText(/Choisis une ligue/i)).toBeInTheDocument();
    
    fireEvent.click(screen.getByLabelText("Fermer"));
    
    await waitFor(() => {
      expect(screen.queryByText(/Choisis une ligue/i)).not.toBeInTheDocument();
    });
  });

  test("le bouton Sauvegarder nécessite au moins un joueur", () => {
    render(<Field formation="4-4-2" onBack={() => {}} user={{ uid: "123" }} />);
    
    const saveButton = screen.getByLabelText("Sauvegarder l'équipe actuelle");
    fireEvent.click(saveButton);
    
    // 🔧 Vérifier que l'alerte est affichée
    expect(window.alert).toHaveBeenCalledWith("Ajoutez au moins un joueur avant de sauvegarder !");
    
    // 🔧 Vérifier que la popup ne s'ouvre pas
    expect(screen.queryByText(/Nomme ton équipe/i)).not.toBeInTheDocument();
  });
});

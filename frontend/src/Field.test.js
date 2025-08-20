import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Field from "./Field";

jest.mock("./firebase", () => ({
  auth: {
    currentUser: {
      getIdToken: jest.fn(() => Promise.resolve("fake-token"))
    },
    onAuthStateChanged: jest.fn((callback) => {
      callback(null);
      return jest.fn();
    }),
  },
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([]),
  })
);

beforeEach(() => {
  jest.clearAllMocks();
  
  global.fetch.mockImplementation((url) => {
    if (url.includes("leagues")) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([{ id: 1, name: "Ligue 1" }])
      });
    }
    if (url.includes("teams")) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([{ id: 1, name: "PSG", crest: "psg-logo.png" }])
      });
    }
    if (url.includes("players")) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([{ id: 1, name: "Mbappé" }])
      });
    }
    return Promise.resolve({ 
      ok: true,
      json: () => Promise.resolve([]) 
    });
  });

  localStorage.clear();
});

describe("Field component", () => {
  test("le terrain s'affiche avec la bonne formation et couleur", () => {
    render(<Field formation="4-4-2" onBack={() => {}} />);
    expect(screen.getByAltText(/terrain/i)).toBeInTheDocument();
    expect(screen.getByText(/4-4-2/)).toBeInTheDocument();
  });

  test("bouton Sauvegarder -> popup Auth si pas d'user", () => {
    render(<Field formation="4-4-2" onBack={() => {}} />);
    fireEvent.click(screen.getByLabelText("Sauvegarder l'équipe"));
    expect(screen.getByText(/Connexion requise/i)).toBeInTheDocument();
  });

  test("bouton Sauvegarder -> popup Save si user", () => {
    render(<Field formation="4-4-2" onBack={() => {}} user={{ uid: "123" }} />);
    fireEvent.click(screen.getByLabelText("Sauvegarder l'équipe"));
    expect(screen.getByText(/Nomme ton équipe/i)).toBeInTheDocument();
  });

  test("le bouton Sauvegarder est désactivé si l'équipe n'est pas complète", () => {
    render(<Field formation="4-4-2" onBack={() => {}} user={{ uid: "123" }} />);
    fireEvent.click(screen.getByLabelText("Sauvegarder l'équipe"));
    expect(screen.getByRole("button", { name: "Sauvegarder" })).toBeDisabled();
  });

  test("le bouton Retour appelle la fonction onBack", () => {
    const onBack = jest.fn();
    render(<Field formation="4-4-2" onBack={onBack} />);
    fireEvent.click(screen.getByRole("button", { name: /Retour/i }));
    expect(onBack).toHaveBeenCalled();
  });

  test("la popup joueur s'ouvre et se ferme correctement", async () => {
    render(<Field formation="4-4-2" onBack={() => {}} />);
    fireEvent.click(screen.getAllByText("+")[0]);
    expect(await screen.findByText(/Choisis une ligue/i)).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText("Fermer"));
    await waitFor(() => {
      expect(screen.queryByText(/Choisis une ligue/i)).not.toBeInTheDocument();
    });
  });
});

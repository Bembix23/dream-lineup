import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Account from "./Account";

jest.mock("./firebase", () => ({
  auth: {
    currentUser: {
      email: "test@example.com",
      uid: "test-uid"
    },
    onAuthStateChanged: jest.fn((callback) => {
      callback({ email: "test@example.com", uid: "test-uid" });
      return jest.fn();
    }),
  },
}));

jest.mock("firebase/auth", () => ({
  updateEmail: jest.fn(),
  updatePassword: jest.fn(() => Promise.resolve()), // 🔧 Mock avec Promise résolue
  deleteUser: jest.fn(),
}));

global.confirm = jest.fn(() => true);

// Mock global des timers pour tous les tests
beforeEach(() => {
  jest.clearAllMocks();
  global.confirm.mockReturnValue(true);
  jest.useFakeTimers(); // 🔧
});

describe("Account component", () => {
  test("affiche les informations du compte", () => {
    render(<Account onLogout={() => {}} onBack={() => {}} />);
    
    expect(screen.getByRole("heading", { name: /Mon compte/i })).toBeInTheDocument();
    expect(screen.getByDisplayValue("test@example.com")).toBeInTheDocument();
    expect(screen.getByText(/Changer l'email/i)).toBeInTheDocument();
    expect(screen.getByText(/Nouveau mot de passe/i)).toBeInTheDocument();
  });

  test("bouton Retour au menu appelle onBack", () => {
    const onBack = jest.fn();
    render(<Account onLogout={() => {}} onBack={onBack} />);
    
    fireEvent.click(screen.getByText(/Retour au menu/i));
    expect(onBack).toHaveBeenCalled();
  });

  test("modification d'email affiche un message de succès", async () => {
    const { updateEmail } = require("firebase/auth");
    updateEmail.mockResolvedValue();

    render(<Account onLogout={() => {}} onBack={() => {}} />);
    
    const emailInput = screen.getByDisplayValue("test@example.com");
    fireEvent.change(emailInput, { target: { value: "nouveau@example.com" } });
    
    fireEvent.click(screen.getByText(/Modifier l'email/i));
    
    await waitFor(() => {
      expect(screen.getByText(/Email modifié !/i)).toBeInTheDocument();
    });
    
    expect(updateEmail).toHaveBeenCalled();
  });

  test("modification de mot de passe affiche un message de succès", async () => {
    // 🔧 Mock updatePassword pour qu'il résolve
    const { updatePassword } = require("firebase/auth");
    updatePassword.mockResolvedValue();

    render(<Account onLogout={() => {}} onBack={() => {}} />);
    
    const passwordInput = screen.getByLabelText("Nouveau mot de passe :");
    fireEvent.change(passwordInput, { target: { value: "nouveauMotDePasse123" } });
    
    const submitButton = screen.getByRole("button", { name: "Modifier le mot de passe" });
    fireEvent.click(submitButton);
    
    // 🔧 Attendre que le message apparaisse
    await waitFor(() => {
      expect(screen.getByText(/Mot de passe modifié !/i)).toBeInTheDocument();
    });
    
    expect(updatePassword).toHaveBeenCalled();
  });

  test("erreur lors de la modification d'email affiche un message d'erreur", async () => {
    const { updateEmail } = require("firebase/auth");
    updateEmail.mockRejectedValue(new Error("Email invalide"));

    render(<Account onLogout={() => {}} onBack={() => {}} />);
    
    const emailInput = screen.getByDisplayValue("test@example.com");
    fireEvent.change(emailInput, { target: { value: "email-invalide" } });
    
    fireEvent.click(screen.getByText(/Modifier l'email/i));
    
    await waitFor(() => {
      expect(screen.getByText(/Erreur : Email invalide/i)).toBeInTheDocument();
    });
  });

  test("suppression de compte avec confirmation appelle deleteUser et onLogout", async () => {
    const { deleteUser } = require("firebase/auth");
    const onLogout = jest.fn();
    deleteUser.mockResolvedValue();

    render(<Account onLogout={onLogout} onBack={() => {}} />);
    
    fireEvent.click(screen.getByText(/Supprimer mon compte/i));
    
    // 🔧 Avancer tous les timers
    jest.runAllTimers();
    
    await waitFor(() => {
      expect(deleteUser).toHaveBeenCalled();
      expect(onLogout).toHaveBeenCalled();
    });
  });

  test("annulation de suppression de compte n'appelle pas deleteUser", () => {
    global.confirm.mockReturnValue(false);
    const { deleteUser } = require("firebase/auth");
    const onLogout = jest.fn();

    render(<Account onLogout={onLogout} onBack={() => {}} />);
    
    fireEvent.click(screen.getByText(/Supprimer mon compte/i));
    
    expect(deleteUser).not.toHaveBeenCalled();
    expect(onLogout).not.toHaveBeenCalled();
  });
});
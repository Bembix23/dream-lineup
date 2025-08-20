import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RegisterForm from "./RegisterForm";

jest.mock("./firebase", () => ({
  auth: {
    currentUser: null,
    onAuthStateChanged: jest.fn((callback) => {
      callback(null);
      return jest.fn();
    }),
  },
}));

jest.mock("firebase/auth", () => ({
  createUserWithEmailAndPassword: jest.fn(),
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([]),
  })
);

beforeEach(() => {
  jest.clearAllMocks();
});

describe("RegisterForm component", () => {
  test("affiche le formulaire de création de compte", () => {
    render(<RegisterForm onBack={() => {}} onSuccess={() => {}} />);
    
    expect(screen.getByText(/Créer un compte/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Mot de passe/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Créer/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Retour/i })).toBeInTheDocument();
  });

  test("bouton Retour appelle onBack", () => {
    const onBack = jest.fn();
    render(<RegisterForm onBack={onBack} onSuccess={() => {}} />);
    
    fireEvent.click(screen.getByRole("button", { name: /Retour/i }));
    expect(onBack).toHaveBeenCalled();
  });

  test("création de compte avec succès appelle onSuccess et affiche message", async () => {
    const { createUserWithEmailAndPassword } = require("firebase/auth");
    const onSuccess = jest.fn();
    createUserWithEmailAndPassword.mockResolvedValue({ user: { uid: "123" } });

    render(<RegisterForm onBack={() => {}} onSuccess={onSuccess} />);
    
    fireEvent.change(screen.getByPlaceholderText(/Email/i), {
      target: { value: "nouveau@example.com" }
    });
    fireEvent.change(screen.getByPlaceholderText(/Mot de passe/i), {
      target: { value: "motdepasse123" }
    });
    
    fireEvent.click(screen.getByRole("button", { name: /Créer/i }));
    
    await waitFor(() => {
      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
        expect.anything(),
        "nouveau@example.com",
        "motdepasse123"
      );
      expect(screen.getByText(/Compte créé avec succès !/i)).toBeInTheDocument();
      expect(onSuccess).toHaveBeenCalled();
    });
  });

  test("erreur de création affiche un message d'erreur", async () => {
    const { createUserWithEmailAndPassword } = require("firebase/auth");
    createUserWithEmailAndPassword.mockRejectedValue(new Error("Email already in use"));

    render(<RegisterForm onBack={() => {}} onSuccess={() => {}} />);
    
    fireEvent.change(screen.getByPlaceholderText(/Email/i), {
      target: { value: "existant@example.com" }
    });
    fireEvent.change(screen.getByPlaceholderText(/Mot de passe/i), {
      target: { value: "motdepasse123" }
    });
    
    fireEvent.click(screen.getByRole("button", { name: /Créer/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/Erreur lors de la création du compte : Email already in use/i)).toBeInTheDocument();
    });
  });

  test("les champs email et password sont requis", () => {
    render(<RegisterForm onBack={() => {}} onSuccess={() => {}} />);
    
    const emailInput = screen.getByPlaceholderText(/Email/i);
    const passwordInput = screen.getByPlaceholderText(/Mot de passe/i);
    
    expect(emailInput).toBeRequired();
    expect(passwordInput).toBeRequired();
  });

  test("le type des champs est correct", () => {
    render(<RegisterForm onBack={() => {}} onSuccess={() => {}} />);
    
    const emailInput = screen.getByPlaceholderText(/Email/i);
    const passwordInput = screen.getByPlaceholderText(/Mot de passe/i);
    
    expect(emailInput).toHaveAttribute("type", "email");
    expect(passwordInput).toHaveAttribute("type", "password");
  });

  test("effacement des messages lors d'une nouvelle soumission", async () => {
    const { createUserWithEmailAndPassword } = require("firebase/auth");
    
    createUserWithEmailAndPassword.mockRejectedValueOnce(new Error("Weak password"));
    
    render(<RegisterForm onBack={() => {}} onSuccess={() => {}} />);
    
    fireEvent.change(screen.getByPlaceholderText(/Email/i), {
      target: { value: "test@example.com" }
    });
    fireEvent.change(screen.getByPlaceholderText(/Mot de passe/i), {
      target: { value: "123" }
    });
    fireEvent.click(screen.getByRole("button", { name: /Créer/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/Erreur lors de la création du compte : Weak password/i)).toBeInTheDocument();
    });
    
    createUserWithEmailAndPassword.mockResolvedValue({ user: { uid: "123" } });
    
    fireEvent.change(screen.getByPlaceholderText(/Mot de passe/i), {
      target: { value: "motdepassefort123" }
    });
    fireEvent.click(screen.getByRole("button", { name: /Créer/i }));
    
    await waitFor(() => {
      expect(screen.queryByText(/Erreur lors de la création/i)).not.toBeInTheDocument();
      expect(screen.getByText(/Compte créé avec succès !/i)).toBeInTheDocument();
    });
  });

  test("pas de message d'erreur ni de succès au chargement initial", () => {
    render(<RegisterForm onBack={() => {}} onSuccess={() => {}} />);
    
    expect(screen.queryByText(/Erreur lors de la création/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Compte créé avec succès/i)).not.toBeInTheDocument();
  });
});
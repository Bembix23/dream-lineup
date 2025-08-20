import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginForm from "./LoginForm";

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
  signInWithEmailAndPassword: jest.fn(),
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

describe("LoginForm component", () => {
  test("affiche le formulaire de connexion", () => {
    render(<LoginForm onBack={() => {}} onSuccess={() => {}} />);
    
    expect(screen.getByText(/Connexion/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Mot de passe/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Se connecter/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Retour/i })).toBeInTheDocument();
  });

  test("bouton Retour appelle onBack", () => {
    const onBack = jest.fn();
    render(<LoginForm onBack={onBack} onSuccess={() => {}} />);
    
    fireEvent.click(screen.getByRole("button", { name: /Retour/i }));
    expect(onBack).toHaveBeenCalled();
  });

  test("soumission avec succès appelle onSuccess", async () => {
    const { signInWithEmailAndPassword } = require("firebase/auth");
    const onSuccess = jest.fn();
    signInWithEmailAndPassword.mockResolvedValue({ user: { uid: "123" } });

    render(<LoginForm onBack={() => {}} onSuccess={onSuccess} />);
    
    fireEvent.change(screen.getByPlaceholderText(/Email/i), {
      target: { value: "test@example.com" }
    });
    fireEvent.change(screen.getByPlaceholderText(/Mot de passe/i), {
      target: { value: "password123" }
    });
    
    fireEvent.click(screen.getByRole("button", { name: /Se connecter/i }));
    
    await waitFor(() => {
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
        expect.anything(),
        "test@example.com",
        "password123"
      );
      expect(onSuccess).toHaveBeenCalled();
    });
  });

  test("erreur de connexion affiche un message d'erreur", async () => {
    const { signInWithEmailAndPassword } = require("firebase/auth");
    signInWithEmailAndPassword.mockRejectedValue(new Error("Invalid credentials"));

    render(<LoginForm onBack={() => {}} onSuccess={() => {}} />);
    
    fireEvent.change(screen.getByPlaceholderText(/Email/i), {
      target: { value: "wrong@example.com" }
    });
    fireEvent.change(screen.getByPlaceholderText(/Mot de passe/i), {
      target: { value: "wrongpassword" }
    });
    
    fireEvent.click(screen.getByRole("button", { name: /Se connecter/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/Identifiants incorrects ou utilisateur inconnu/i)).toBeInTheDocument();
    });
  });

  test("les champs email et password sont requis", () => {
    render(<LoginForm onBack={() => {}} onSuccess={() => {}} />);
    
    const emailInput = screen.getByPlaceholderText(/Email/i);
    const passwordInput = screen.getByPlaceholderText(/Mot de passe/i);
    
    expect(emailInput).toBeRequired();
    expect(passwordInput).toBeRequired();
  });

  test("le type des champs est correct", () => {
    render(<LoginForm onBack={() => {}} onSuccess={() => {}} />);
    
    const emailInput = screen.getByPlaceholderText(/Email/i);
    const passwordInput = screen.getByPlaceholderText(/Mot de passe/i);
    
    expect(emailInput).toHaveAttribute("type", "email");
    expect(passwordInput).toHaveAttribute("type", "password");
  });

  test("effacement de l'erreur lors d'une nouvelle soumission", async () => {
    const { signInWithEmailAndPassword } = require("firebase/auth");
    
    signInWithEmailAndPassword.mockRejectedValueOnce(new Error("Invalid credentials"));
    
    render(<LoginForm onBack={() => {}} onSuccess={() => {}} />);
    
    fireEvent.change(screen.getByPlaceholderText(/Email/i), {
      target: { value: "wrong@example.com" }
    });
    fireEvent.change(screen.getByPlaceholderText(/Mot de passe/i), {
      target: { value: "wrongpassword" }
    });
    fireEvent.click(screen.getByRole("button", { name: /Se connecter/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/Identifiants incorrects/i)).toBeInTheDocument();
    });
    
    signInWithEmailAndPassword.mockResolvedValue({ user: { uid: "123" } });
    
    fireEvent.change(screen.getByPlaceholderText(/Email/i), {
      target: { value: "correct@example.com" }
    });
    fireEvent.click(screen.getByRole("button", { name: /Se connecter/i }));
    
    await waitFor(() => {
      expect(screen.queryByText(/Identifiants incorrects/i)).not.toBeInTheDocument();
    });
  });

  test("soumission du formulaire avec la touche Entrée", async () => {
    const { signInWithEmailAndPassword } = require("firebase/auth");
    const onSuccess = jest.fn();
    signInWithEmailAndPassword.mockResolvedValue({ user: { uid: "123" } });

    render(<LoginForm onBack={() => {}} onSuccess={onSuccess} />);
    
    const emailInput = screen.getByPlaceholderText(/Email/i);
    const passwordInput = screen.getByPlaceholderText(/Mot de passe/i);
    
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    
    // eslint-disable-next-line testing-library/no-node-access
    const form = document.querySelector("form");
    fireEvent.submit(form);
    
    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalled();
    });
  });
});
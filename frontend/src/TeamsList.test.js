import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import TeamsList from "./TeamsList";

jest.mock("./firebase", () => ({
  auth: {
    currentUser: null,
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
});

const mockTeams = [
  { id: 1, name: "Équipe PSG" },
  { id: 2, name: "Équipe Barcelona" },
  { id: 3, name: "Mon équipe" }
];

describe("TeamsList component", () => {
  test("affiche le titre et le bouton retour", () => {
    render(
      <TeamsList 
        teams={[]} 
        onSelect={() => {}} 
        onBack={() => {}} 
        onRename={() => {}} 
        onDelete={() => {}} 
      />
    );
    
    expect(screen.getByText(/Mes équipes sauvegardées/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Retour/i })).toBeInTheDocument();
  });

  test("affiche un message si aucune équipe", () => {
    render(
      <TeamsList 
        teams={[]} 
        onSelect={() => {}} 
        onBack={() => {}} 
        onRename={() => {}} 
        onDelete={() => {}} 
      />
    );
    
    expect(screen.getByText(/Aucune équipe sauvegardée/i)).toBeInTheDocument();
  });

  test("affiche la liste des équipes", () => {
    render(
      <TeamsList 
        teams={mockTeams} 
        onSelect={() => {}} 
        onBack={() => {}} 
        onRename={() => {}} 
        onDelete={() => {}} 
      />
    );
    
    expect(screen.getByText("Équipe PSG")).toBeInTheDocument();
    expect(screen.getByText("Équipe Barcelona")).toBeInTheDocument();
    expect(screen.getByText("Mon équipe")).toBeInTheDocument();
  });

  test("bouton Retour appelle onBack", () => {
    const onBack = jest.fn();
    render(
      <TeamsList 
        teams={mockTeams} 
        onSelect={() => {}} 
        onBack={onBack} 
        onRename={() => {}} 
        onDelete={() => {}} 
      />
    );
    
    fireEvent.click(screen.getByRole("button", { name: /Retour/i }));
    expect(onBack).toHaveBeenCalled();
  });

  test("clic sur une équipe appelle onSelect", () => {
    const onSelect = jest.fn();
    render(
      <TeamsList 
        teams={mockTeams} 
        onSelect={onSelect} 
        onBack={() => {}} 
        onRename={() => {}} 
        onDelete={() => {}} 
      />
    );
    
    fireEvent.click(screen.getByText("Équipe PSG"));
    expect(onSelect).toHaveBeenCalledWith(mockTeams[0]);
  });

  test("bouton Supprimer appelle onDelete avec le bon ID", () => {
    const onDelete = jest.fn();
    render(
      <TeamsList 
        teams={mockTeams} 
        onSelect={() => {}} 
        onBack={() => {}} 
        onRename={() => {}} 
        onDelete={onDelete} 
      />
    );
    
    const deleteButtons = screen.getAllByText(/Supprimer/i);
    fireEvent.click(deleteButtons[0]);
    expect(onDelete).toHaveBeenCalledWith(1);
  });

  test("clic sur Renommer active le mode édition", () => {
    render(
      <TeamsList 
        teams={mockTeams} 
        onSelect={() => {}} 
        onBack={() => {}} 
        onRename={() => {}} 
        onDelete={() => {}} 
      />
    );
    
    const renameButtons = screen.getAllByText(/Renommer/i);
    fireEvent.click(renameButtons[0]);
    
    expect(screen.getByPlaceholderText(/Nouveau nom/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Valider/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Annuler/i })).toBeInTheDocument();
  });

  test("mode édition : input pré-rempli avec le nom actuel", () => {
    render(
      <TeamsList 
        teams={mockTeams} 
        onSelect={() => {}} 
        onBack={() => {}} 
        onRename={() => {}} 
        onDelete={() => {}} 
      />
    );
    
    const renameButtons = screen.getAllByText(/Renommer/i);
    fireEvent.click(renameButtons[0]);
    
    const input = screen.getByPlaceholderText(/Nouveau nom/i);
    expect(input).toHaveValue("Équipe PSG");
  });

  test("mode édition : bouton Valider désactivé si nom vide", () => {
    render(
      <TeamsList 
        teams={mockTeams} 
        onSelect={() => {}} 
        onBack={() => {}} 
        onRename={() => {}} 
        onDelete={() => {}} 
      />
    );
    
    const renameButtons = screen.getAllByText(/Renommer/i);
    fireEvent.click(renameButtons[0]);
    
    const input = screen.getByPlaceholderText(/Nouveau nom/i);
    fireEvent.change(input, { target: { value: "   " } });
    
    expect(screen.getByRole("button", { name: /Valider/i })).toBeDisabled();
  });

  test("mode édition : validation appelle onRename et sort du mode édition", () => {
    const onRename = jest.fn();
    render(
      <TeamsList 
        teams={mockTeams} 
        onSelect={() => {}} 
        onBack={() => {}} 
        onRename={onRename} 
        onDelete={() => {}} 
      />
    );
    
    const renameButtons = screen.getAllByText(/Renommer/i);
    fireEvent.click(renameButtons[0]);
    
    const input = screen.getByPlaceholderText(/Nouveau nom/i);
    fireEvent.change(input, { target: { value: "Nouveau nom PSG" } });
    fireEvent.click(screen.getByRole("button", { name: /Valider/i }));
    
    expect(onRename).toHaveBeenCalledWith(1, "Nouveau nom PSG");
    
    expect(screen.queryByPlaceholderText(/Nouveau nom/i)).not.toBeInTheDocument();
  });

  test("mode édition : annulation sort du mode édition sans sauvegarder", () => {
    const onRename = jest.fn();
    render(
      <TeamsList 
        teams={mockTeams} 
        onSelect={() => {}} 
        onBack={() => {}} 
        onRename={onRename} 
        onDelete={() => {}} 
      />
    );
    
    const renameButtons = screen.getAllByText(/Renommer/i);
    fireEvent.click(renameButtons[0]);
    
    fireEvent.click(screen.getByRole("button", { name: /Annuler/i }));
    
    expect(onRename).not.toHaveBeenCalled();
    expect(screen.queryByPlaceholderText(/Nouveau nom/i)).not.toBeInTheDocument();
  });
});
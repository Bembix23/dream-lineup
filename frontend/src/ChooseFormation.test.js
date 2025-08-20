import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ChooseFormation from "./ChooseFormation";

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

describe("ChooseFormation component", () => {
  test("affiche le titre et toutes les formations", () => {
    render(<ChooseFormation onBack={() => {}} onChoose={() => {}} />);
    
    expect(screen.getByText(/Choisis ta formation/i)).toBeInTheDocument();
    expect(screen.getByText("4-4-2")).toBeInTheDocument();
    expect(screen.getByText("4-2-3-1")).toBeInTheDocument();
    expect(screen.getByText("3-4-3")).toBeInTheDocument();
  });

  test("affiche les images des formations", () => {
    render(<ChooseFormation onBack={() => {}} onChoose={() => {}} />);
    
    expect(screen.getByAltText("4-4-2")).toBeInTheDocument();
    expect(screen.getByAltText("4-2-3-1")).toBeInTheDocument();
    expect(screen.getByAltText("3-4-3")).toBeInTheDocument();
  });

  test("bouton Retour appelle onBack", () => {
    const onBack = jest.fn();
    render(<ChooseFormation onBack={onBack} onChoose={() => {}} />);
    
    fireEvent.click(screen.getByRole("button", { name: /Retour/i }));
    expect(onBack).toHaveBeenCalled();
  });

  test("clic sur formation 4-4-2 appelle onChoose avec '4-4-2'", () => {
    const onChoose = jest.fn();
    render(<ChooseFormation onBack={() => {}} onChoose={onChoose} />);
    
    fireEvent.click(screen.getByText("4-4-2"));
    expect(onChoose).toHaveBeenCalledWith("4-4-2");
  });

  test("clic sur formation 4-2-3-1 appelle onChoose avec '4-2-3-1'", () => {
    const onChoose = jest.fn();
    render(<ChooseFormation onBack={() => {}} onChoose={onChoose} />);
    
    fireEvent.click(screen.getByText("4-2-3-1"));
    expect(onChoose).toHaveBeenCalledWith("4-2-3-1");
  });

  test("clic sur formation 3-4-3 appelle onChoose avec '3-4-3'", () => {
    const onChoose = jest.fn();
    render(<ChooseFormation onBack={() => {}} onChoose={onChoose} />);
    
    fireEvent.click(screen.getByText("3-4-3"));
    expect(onChoose).toHaveBeenCalledWith("3-4-3");
  });

  test("toutes les formations ont des boutons cliquables", () => {
    render(<ChooseFormation onBack={() => {}} onChoose={() => {}} />);
    
    const formationButtons = screen.getAllByRole("button").filter(button => 
      button.textContent === "4-4-2" || 
      button.textContent === "4-2-3-1" || 
      button.textContent === "3-4-3"
    );
    
    expect(formationButtons).toHaveLength(3);
    formationButtons.forEach(button => {
      expect(button).not.toBeDisabled();
    });
  });

  test("le bouton Retour est présent et visible", () => {
    render(<ChooseFormation onBack={() => {}} onChoose={() => {}} />);
    
    const backButton = screen.getByRole("button", { name: /Retour/i });
    expect(backButton).toBeInTheDocument();
    expect(backButton).toBeVisible();
  });
});
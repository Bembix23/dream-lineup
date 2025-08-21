import React, { useState } from "react";
import './TeamsList.css';

export default function TeamsList({ teams, onSelect, onBack, onRename, onDelete }) {
  const [editingId, setEditingId] = useState(null);
  const [newName, setNewName] = useState("");

  const safeTeams = Array.isArray(teams) ? teams : [];

  return (
    <div className="teams-list">
      <h2>Mes équipes sauvegardées</h2>
      <ul>
        {safeTeams.length === 0 && <li>Aucune équipe sauvegardée.</li>}
        {safeTeams.map(team => (
          <li key={team.id}>
            {editingId === team.id ? (
              <>
                <label htmlFor={`rename-${team.id}`} className="sr-only">
                  Nouveau nom pour {team.name}
                </label>
                <input
                  id={`rename-${team.id}`}
                  type="text"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  placeholder="Nouveau nom"
                  aria-label={`Nouveau nom pour l'équipe ${team.name}`}
                />
                <button
                  onClick={() => {
                    onRename(team.id, newName);
                    setEditingId(null);
                    setNewName("");
                  }}
                  disabled={!newName.trim()}
                  aria-label={`Valider le nouveau nom pour ${team.name}`}
                >
                  Valider
                </button>
                <button 
                  onClick={() => setEditingId(null)}
                  aria-label={`Annuler la modification de ${team.name}`}
                >
                  Annuler
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => onSelect(team)}
                  aria-label={`Sélectionner l'équipe ${team.name}`}
                >
                  {team.name}
                </button>
                <button
                  className="teams-list-rename"
                  onClick={() => {
                    setEditingId(team.id);
                    setNewName(team.name);
                  }}
                  aria-label={`Renommer l'équipe ${team.name}`}
                >
                  Renommer
                </button>
                <button
                  className="teams-list-delete"
                  onClick={() => onDelete(team.id)}
                  aria-label={`Supprimer l'équipe ${team.name}`}
                >
                  Supprimer
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
      <button className="teams-list-back" onClick={onBack} aria-label="Retour au menu principal">
        Retour
      </button>
    </div>
  );
}
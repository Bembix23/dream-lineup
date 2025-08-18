import React, { useState } from "react";
import './TeamsList.css';

export default function TeamsList({ teams, onSelect, onBack, onRename, onDelete }) {
  const [editingId, setEditingId] = useState(null);
  const [newName, setNewName] = useState("");

  return (
    <div className="teams-list">
      <h2>Mes équipes sauvegardées</h2>
      <ul>
        {teams.length === 0 && <li>Aucune équipe sauvegardée.</li>}
        {teams.map(team => (
          <li key={team.id}>
            {editingId === team.id ? (
              <>
                <input
                  type="text"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  placeholder="Nouveau nom"
                />
                <button
                  onClick={() => {
                    onRename(team.id, newName);
                    setEditingId(null);
                    setNewName("");
                  }}
                  disabled={!newName.trim()}
                >
                  Valider
                </button>
                <button onClick={() => setEditingId(null)}>Annuler</button>
              </>
            ) : (
              <>
                <button onClick={() => onSelect(team)}>
                  {team.name}
                </button>
                <button
                  className="teams-list-rename"
                  onClick={() => {
                    setEditingId(team.id);
                    setNewName(team.name);
                  }}
                >
                  Renommer
                </button>
                <button
                  className="teams-list-delete"
                  onClick={() => onDelete(team.id)}
                >
                  Supprimer
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
      <button className="teams-list-back" onClick={onBack}>Retour</button>
    </div>
  );
}
import React from "react";
import './TeamsList.css';

export default function TeamsList({ teams, onSelect, onBack }) {
  return (
    <div className="teams-list">
      <h2>Mes équipes sauvegardées</h2>
      <ul>
        {teams.length === 0 && <li>Aucune équipe sauvegardée.</li>}
        {teams.map(team => (
          <li key={team.id}>
            <button onClick={() => onSelect(team)}>
              {team.name}
            </button>
          </li>
        ))}
      </ul>
      <button className="teams-list-back" onClick={onBack}>Retour</button>
    </div>
  );
}
import { useState } from "react";
import terrainGreen from './assets/images/fonds/dreamlineup-field-green.png';
import terrainBlack from './assets/images/fonds/dreamlineup-field-black.png';
import './Field.css';

const FORMATIONS = {
  "4-4-2": [
    // [x, y] en pourcentage du conteneur (0-100)
    [50, 90], // Gardien
    [15, 75], [35, 75], [65, 75], [85, 75], // Défenseurs
    [15, 55], [35, 55], [65, 55], [85, 55], // Milieux
    [35, 35], [65, 35], // Attaquants
  ],
  "4-3-3": [
    [50, 90],
    [15, 75], [35, 75], [65, 75], [85, 75],
    [25, 55], [50, 50], [75, 55],
    [20, 30], [50, 20], [80, 30],
  ],
  "3-5-2": [
    [50, 90],
    [25, 75], [50, 75], [75, 75],
    [15, 55], [35, 55], [50, 50], [65, 55], [85, 55],
    [40, 30], [60, 30],
  ],
  "4-2-3-1": [
    [50, 90], // Gardien
    [15, 75], [35, 75], [65, 75], [85, 75], // Défenseurs
    [35, 60], [65, 60], // Milieux défensifs
    [20, 40], [50, 35], [80, 40], // Milieux offensifs
    [50, 20], // Attaquant
  ],
  "3-4-3": [
    [50, 90], // Gardien
    [20, 75], [50, 75], [80, 75], // Défenseurs
    [15, 55], [40, 55], [60, 55], [85, 55], // Milieux
    [20, 35], [50, 20], [80, 35], // Attaquants
  ],
};

const COLORS = [
  { name: "Vert", img: terrainGreen, color: "#1a7e3c" },
  { name: "Noir", img: terrainBlack, color: "#222" },
  // Ajoute d'autres couleurs ici si besoin
];

const FORMATION_LIST = [
  { name: "4-4-2" },
  { name: "4-2-3-1" },
  { name: "3-4-3" },
  //{ name: "4-3-3" },
  //{ name: "3-5-2" },
];

export default function Field({ formation, onBack }) {
  const [terrain, setTerrain] = useState(COLORS[0]);
  const [showPopup, setShowPopup] = useState(false);
  const [showFormationPopup, setShowFormationPopup] = useState(false);
  const [currentFormation, setCurrentFormation] = useState(formation);

  const positions = FORMATIONS[currentFormation];

  return (
    <div className="field-page">
      <div className="side-panel">
        {/* Bouton couleur */}
        <button
          className="color-circle-btn"
          style={{ background: terrain.color }}
          onClick={() => setShowPopup(true)}
          aria-label="Changer la couleur du terrain"
        />
        {showPopup && (
          <div className="color-popup" onMouseLeave={() => setShowPopup(false)}>
            {COLORS.map(c => (
              <button
                key={c.name}
                className="color-choice"
                style={{ background: c.color }}
                onClick={() => {
                  setTerrain(c);
                  setShowPopup(false);
                }}
                aria-label={c.name}
              />
            ))}
          </div>
        )}

        {/* Bouton formation */}
        <button
          className="formation-circle-btn"
          onClick={() => setShowFormationPopup(true)}
          aria-label="Changer la formation"
        >
          <span className="formation-label">{currentFormation}</span>
        </button>
        {showFormationPopup && (
          <div className="formation-popup" onMouseLeave={() => setShowFormationPopup(false)}>
            {FORMATION_LIST.map(f => (
              <button
                key={f.name}
                className={`formation-choice${currentFormation === f.name ? " selected" : ""}`}
                onClick={() => {
                  setCurrentFormation(f.name);
                  setShowFormationPopup(false);
                }}
                aria-label={f.name}
              >
                {f.name}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="field-container">
        <img src={terrain.img} alt="terrain" className="field-bg" />
        {positions.map(([x, y], idx) => (
          <button
            key={idx}
            className="player-spot"
            style={{
              left: `${x}%`,
              top: `${y}%`,
            }}
          >
            +
          </button>
        ))}
        <button className="back-btn" onClick={onBack}>Retour</button>
      </div>
    </div>
  );
}
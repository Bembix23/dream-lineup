import terrainImg from './assets/images/fonds/terrain-background-image.png';
import './Field.css';

const FORMATIONS = {
  "4-4-2": [
    // [x, y] en pourcentage du conteneur (0-100)
    [50, 90], // Gardien
    [15, 75], [35, 75], [65, 75], [85, 75], // Défenseurs
    [15, 55], [35, 55], [65, 55], [85, 55], // Milieux
    [35, 30], [65, 30], // Attaquants
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
    [20, 45], [50, 40], [80, 45], // Milieux offensifs
    [50, 25], // Attaquant
  ],
  "3-4-3": [
    [50, 90], // Gardien
    [20, 75], [50, 75], [80, 75], // Défenseurs
    [15, 55], [40, 55], [60, 55], [85, 55], // Milieux
    [20, 30], [50, 20], [80, 30], // Attaquants
  ],
};

export default function Field({ formation, onBack }) {
  const positions = FORMATIONS[formation];

  return (
    <div className="field-container">
      <img src={terrainImg} alt="terrain" className="field-bg" />
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
  );
}
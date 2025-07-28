import formation442 from './assets/images/icones/formation-442.png';
import formation4231 from './assets/images/icones/formation-4231.png';
import formation343 from './assets/images/icones/formation-343.png';
import './ChooseFormation.css';

const formations = [
  { name: "4-4-2", image: formation442 },
  { name: "4-2-3-1", image: formation4231 },
  { name: "3-4-3", image: formation343 },
];

export default function ChooseFormation({ onBack, onChoose }) {
  return (
    <div className="choose-formation-page">
      <h1>Choisis ta formation</h1>
      <div className="formations-row">
        {formations.map(f => (
          <button key={f.name} className="formation-btn" onClick={() => onChoose(f.name)}>
            <img src={f.image} alt={f.name} />
            <span>{f.name}</span>
          </button>
        ))}
      </div>
      <button className="back-btn" onClick={onBack}>Retour</button>
    </div>
  );
}
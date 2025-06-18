import { useState } from 'react';
import imgConnexion from './assets/images/icones/utilisateur-3.png';
import './App.css';

const buttonsData = [
  {
    id: 1,
    label: 'Se Connecter',
    description: 'Description du bouton 1',
    image: imgConnexion,
  },
  {
    id: 2,
    label: 'Créer une équipe',
    description: 'Description du bouton 2',
    image: '/path/to/image2.png',
  },
  {
    id: 3,
    label: 'Paramètres',
    description: 'Description du bouton 3',
    image: '/path/to/image3.png',
  },
];

function App() {
  const [hoveredId, setHoveredId] = useState(null);
  const current = buttonsData.find(b => b.id === hoveredId) || buttonsData[0];

  return (
    <div className="App">
      <header className="App-header">
        <h1>Dream Lineup</h1>
      </header>

      <main className="content">
        <nav className="button-list">
          {buttonsData.map(button => (
            <button
              key={button.id}
              onMouseEnter={() => setHoveredId(button.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {button.label}
            </button>
          ))}
        </nav>

        <div className={`detail ${hoveredId ? 'visible' : ''}`}>
          <img src={current.image} alt={current.label} />
          <p>{current.description}</p>
        </div>
      </main>
    </div>
  );
}

export default App;

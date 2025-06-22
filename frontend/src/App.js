import { useState, useEffect } from 'react';
import { auth } from './firebase';
import { onAuthStateChanged, signOut } from "firebase/auth";
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import imgConnexion from './assets/images/icones/utilisateur-3.png';
import imgCreerEquipe from './assets/images/icones/football-2.png';
import imgParametres from './assets/images/icones/reglage.png';
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
    image: imgCreerEquipe,
  },
  {
    id: 3,
    label: 'Paramètres',
    description: 'Description du bouton 3',
    image: imgParametres,
  },
];

function App() {
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [hoveredId, setHoveredId] = useState(null);
  const [authMode, setAuthMode] = useState(null); // null | 'choice' | 'login' | 'register'
  const current = buttonsData.find(b => b.id === hoveredId) || buttonsData[0];

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser);
    return () => unsub();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Dream Lineup</h1>
        {user && (
          <button className="logout-btn" onClick={() => signOut(auth)}>
            Déconnexion
          </button>
        )}
      </header>
      <main className="content">
        {authMode === 'choice' ? (
          <div className="auth-choice">
            <button onClick={() => setAuthMode('login')}>Se connecter</button>
            <button onClick={() => setAuthMode('register')}>Créer un compte</button>
            <button onClick={() => setAuthMode(null)}>Retour</button>
          </div>
        ) : authMode === 'login' ? (
          <LoginForm onBack={() => setAuthMode('choice')} />
        ) : authMode === 'register' ? (
          <RegisterForm onBack={() => setAuthMode('choice')} />
        ) : (
          <>
            <nav className="button-list">
              {buttonsData.map(button => (
                <button
                  key={button.id}
                  onMouseEnter={() => setHoveredId(button.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onClick={() => {
                    if (button.label === "Se Connecter" && !user) setAuthMode('choice');
                  }}
                >
                  {user && button.label === "Se Connecter"
                    ? "Mon Profil"
                    : button.label}
                </button>
              ))}
            </nav>
            <div className={`detail ${hoveredId ? 'visible' : ''}`}>
              <img src={current.image} alt={current.label} class={current.id === 2 ? 'rotated' : ''}/>
              <p>{current.description}</p>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default App;

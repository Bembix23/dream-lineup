import { useState, useEffect } from 'react';
import { auth } from './firebase';
import { onAuthStateChanged, signOut } from "firebase/auth";
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import Account from './Account';
import ChooseFormation from './ChooseFormation';
import Field from './Field';
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
  const [hoveredId, setHoveredId] = useState(null);
  const [authMode, setAuthMode] = useState(null); // null | 'choice' | 'login' | 'register'
  const [showAccount, setShowAccount] = useState(false);
  const [showFormation, setShowFormation] = useState(false);
  const [selectedFormation, setSelectedFormation] = useState(null);
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
        {authMode === 'login' ? (
          <LoginForm
            onBack={() => setAuthMode('choice')}
            onSuccess={() => {
              setAuthMode(null);
            }}
          />
        ) : authMode === 'register' ? (
          <RegisterForm
            onBack={() => setAuthMode('choice')}
            onSuccess={() => {
              setAuthMode(null);
            }}
          />
        ) : showAccount ? (
          <Account onBack={() => { setShowAccount(false); setAuthMode(null); }} />
        ) : showFormation ? (
          selectedFormation ? (
            <Field
              formation={selectedFormation}
              onBack={() => setSelectedFormation(null)}
              user={user}
              onRequestLogin={() => setAuthMode('login')}
              onRequestRegister={() => setAuthMode('register')}
            />
          ) : (
            <ChooseFormation
              onBack={() => setShowFormation(false)}
              onChoose={name => setSelectedFormation(name)}
            />
          )
        ) : authMode === 'choice' ? (
          <div className="button-list">
            <button onClick={() => setAuthMode('login')}>Se connecter</button>
            <button onClick={() => setAuthMode('register')}>Créer un compte</button>
            <button onClick={() => setAuthMode(null)}>Retour</button>
          </div>
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
                    if (button.label === "Se Connecter" && user) setShowAccount(true);
                    if (button.label === "Créer une équipe") setShowFormation(true);
                  }}
                >
                  {user && button.label === "Se Connecter"
                    ? "Voir le profil"
                    : button.label}
                </button>
              ))}
            </nav>
            <div className={`detail ${hoveredId ? 'visible' : ''}`}>
              <img src={current.image} alt={current.label} className={current.id === 2 ? 'rotated' : ''}/>
              <p>{current.description}</p>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default App;

import { useState, useEffect } from 'react';
import { auth } from './firebase';
import { onAuthStateChanged, signOut } from "firebase/auth";
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import Account from './Account';
import ChooseFormation from './ChooseFormation';
import Field from './Field';
import TeamsList from './TeamsList';
import imgConnexion from './assets/images/icones/utilisateur-3.png';
import imgCreerEquipe from './assets/images/icones/football-2.png';
import imgParametres from './assets/images/icones/reglage.png';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);
  const [authMode, setAuthMode] = useState(null); // null | 'choice' | 'login' | 'register'
  const [showAccount, setShowAccount] = useState(false);
  const [showFormation, setShowFormation] = useState(false);
  const [selectedFormation, setSelectedFormation] = useState(null);
  const [showTeamsList, setShowTeamsList] = useState(false);
  const [savedTeams, setSavedTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);

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

  if (user) {
    buttonsData.splice(2, 0, {
      id: 4,
      label: 'Mes équipes',
      description: 'Voir toutes mes équipes sauvegardées',
      image: imgCreerEquipe,
    });
  }

  const current = buttonsData.find(b => b.id === hoveredId) || buttonsData[0];

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser);
    return () => unsub();
  }, []);

  useEffect(() => {
    const page = localStorage.getItem("currentPage");
    if (page === "login") setAuthMode("login");
    else if (page === "register") setAuthMode("register");
    else if (page === "account") setShowAccount(true);
    else if (page === "chooseFormation") setShowFormation(true);
    else if (page === "field") {
      setShowFormation(true);
      // Optionnel: restaurer selectedFormation depuis localStorage si tu veux
    }
    else if (page === "teamsList") setShowTeamsList(true);
    else if (page === "fieldSaved") {
      setShowTeamsList(true);
      // Optionnel: restaurer selectedTeam depuis localStorage si tu veux
    }
  }, []);

  useEffect(() => {
    let page = "menu";
    if (authMode) page = authMode;
    else if (showAccount) page = "account";
    else if (showFormation) page = selectedFormation ? "field" : "chooseFormation";
    else if (showTeamsList) page = selectedTeam ? "fieldSaved" : "teamsList";
    localStorage.setItem("currentPage", page);
  }, [authMode, showAccount, showFormation, selectedFormation, showTeamsList, selectedTeam]);

  const handleRenameTeam = async (teamId, newName) => {
    const token = await auth.currentUser.getIdToken();
    await fetch(`http://localhost:4000/football/rename-team`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ teamId, newName }),
    });
    // Recharge la liste des équipes
    fetch(`http://localhost:4000/football/teams-saved?userId=${user.uid}`)
      .then(res => res.json())
      .then(data => setSavedTeams(data));
  };

  const handleDeleteTeam = async (teamId) => {
    const token = await auth.currentUser.getIdToken();
    await fetch(`http://localhost:4000/football/delete-team`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ teamId }),
    });
    // Recharge la liste des équipes
    fetch(`http://localhost:4000/football/teams-saved?userId=${user.uid}`)
      .then(res => res.json())
      .then(data => setSavedTeams(data));
  };

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
        ) : showTeamsList ? (
          selectedTeam ? (
            <Field
              formation={selectedTeam.formation}
              team={selectedTeam.team}
              user={user}
              onBack={() => setSelectedTeam(null)}
              readOnly={true}
            />
          ) : (
            <TeamsList
              teams={savedTeams}
              onSelect={setSelectedTeam}
              onBack={() => setShowTeamsList(false)}
              onRename={handleRenameTeam}
              onDelete={handleDeleteTeam}
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
                    if (button.label === "Mes équipes") {
                      setShowTeamsList(true);
                      if (user) {
                        fetch(`http://localhost:4000/football/teams-saved?userId=${user.uid}`)
                          .then(res => res.json())
                          .then(data => setSavedTeams(data));
                      }
                    }
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

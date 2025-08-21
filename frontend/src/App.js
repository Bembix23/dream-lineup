import React, { useState, useEffect } from 'react';
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
import imgVoirEquipe from './assets/images/icones/groupe.png';
import imgLogout from './assets/images/icones/logout.png';
import './App.css';
import { apiGet, apiPost } from './api';

function App() {
  const [user, setUser] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);
  const [authMode, setAuthMode] = useState(null);
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
      description: 'En étant connecté, vous pourrez par exemple sauvegarder les équipes que vous construisez ainsi que les visualiser.',
      image: imgConnexion,
    },
    {
      id: 2,
      label: 'Créer une équipe',
      description: "Vous pouvez créer l'équipe de vos rêves en sélectionnant les joueurs que vous préférez en Europe et dans le Monde.",
      image: imgCreerEquipe,
    },
  ];

  if (user) {
    buttonsData.splice(2, 0, {
      id: 4,
      label: 'Mes équipes',
      description: 'Vous allez accéder à la liste des équipes que vous avez sauvegardées et vous pourrez les visualiser, les renommer ou les supprimer.',
      image: imgVoirEquipe,
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
    }
    else if (page === "teamsList") setShowTeamsList(true);
    else if (page === "fieldSaved") {
      setShowTeamsList(true);
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
    await apiPost('http://localhost:4000/football/rename-team', { teamId, newName });
    
    const response = await apiGet(`http://localhost:4000/football/teams-saved`);
    const data = await response.json();
    setSavedTeams(data);
  };

  const handleDeleteTeam = async (teamId) => {
    await apiPost(`http://localhost:4000/football/delete-team`, { teamId });
    
    const response = await apiGet(`http://localhost:4000/football/teams-saved`);
    const data = await response.json();
    setSavedTeams(data);
  };

  const handleLogout = () => {
    signOut(auth);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Dream Lineup</h1>
        {user && (
          <button className="logout-btn" onClick={handleLogout}>
            <span>Déconnexion</span>
            <img src={imgLogout} alt="Déconnexion" />
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
                      if (user) {
                        console.log('👤 User connecté:', user.uid);
                        console.log('🔐 Auth state:', auth.currentUser ? 'OK' : 'NULL');
                        
                        (async () => {
                          try {
                            if (!auth.currentUser) {
                              console.log('❌ Utilisateur déconnecté');
                              return;
                            }
                            
                            const response = await apiGet(`http://localhost:4000/football/teams-saved`);
                            const data = await response.json();
                            setSavedTeams(data);
                            setShowTeamsList(true);
                          } catch (error) {
                            console.error('❌ Erreur:', error);
                            setSavedTeams([]);
                            setShowTeamsList(true);
                          }
                        })();
                      } else {
                        setShowTeamsList(true);
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

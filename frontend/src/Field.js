import React, { useState, useEffect } from "react";
import terrainGreen from "./assets/images/fonds/dreamlineup-field-green.png";
import terrainBlack from "./assets/images/fonds/dreamlineup-field-black.png";
import terrainBlueSky from "./assets/images/fonds/dreamlineup-field-bluesky.png";
import terrainRed from "./assets/images/fonds/dreamlineup-field-red.png";
import terrainPurple from "./assets/images/fonds/dreamlineup-field-purple.png";
import paletteIcon from "./assets/images/icones/palette.png";
import backArrow from './assets/images/icones/backArrow.png';
import saveIcon from './assets/images/icones/sauvegarder.png';
import "./Field.css";
import { auth } from "./firebase";

const FORMATIONS = {
  "4-4-2": [
    // [x, y] en pourcentage du conteneur (0-100)
    [50, 90], // Gardien
    [15, 72],
    [35, 78],
    [65, 78],
    [85, 72], // Défenseurs
    [15, 52],
    [35, 58],
    [65, 58],
    [85, 52], // Milieux
    [35, 35],
    [65, 35], // Attaquants
  ],
  "4-3-3": [
    [50, 90],
    [15, 72],
    [35, 78],
    [65, 78],
    [85, 72],
    [25, 55],
    [50, 50],
    [75, 55],
    [20, 30],
    [50, 20],
    [80, 30],
  ],
  "3-5-2": [
    [50, 90],
    [25, 75],
    [50, 75],
    [75, 75],
    [15, 55],
    [35, 55],
    [50, 50],
    [65, 55],
    [85, 55],
    [40, 30],
    [60, 30],
  ],
  "4-2-3-1": [
    [50, 90], // Gardien
    [15, 72],
    [35, 78],
    [65, 78],
    [85, 72], // Défenseurs
    [35, 60],
    [65, 60], // Milieux défensifs
    [20, 40],
    [50, 35],
    [80, 40], // Milieux offensifs
    [50, 20], // Attaquant
  ],
  "3-4-3": [
    [50, 90], // Gardien
    [20, 75],
    [50, 75],
    [80, 75], // Défenseurs
    [15, 52],
    [35, 58],
    [65, 58],
    [85, 52], // Milieux
    [20, 35],
    [50, 20],
    [80, 35], // Attaquants
  ],
};

const COLORS = [
  { name: "Vert", img: terrainGreen, color: "#1a7e3c" },
  { name: "Noir", img: terrainBlack, color: "#222" },
  { name: "Bleu Ciel", img: terrainBlueSky, color: "#00bcc1" },
  { name: "Rouge", img: terrainRed, color: "#B50000" },
  { name: "Violet", img: terrainPurple, color: "#6000b5" },
  // Ajoute d'autres couleurs ici si besoin
];

const FORMATION_LIST = [
  { name: "4-4-2" },
  { name: "4-2-3-1" },
  { name: "3-4-3" },
  //{ name: "4-3-3" },
  //{ name: "3-5-2" },
];

export default function Field({ formation, team: initialTeam, onBack, onRequestLogin, onRequestRegister, user, readOnly }) {
  const [terrain, setTerrain] = useState(COLORS[0]);
  const [showPopup, setShowPopup] = useState(false);
  const [showFormationPopup, setShowFormationPopup] = useState(false);
  const draftTeam = JSON.parse(localStorage.getItem("draftTeam") || "null");
  const draftFormation = localStorage.getItem("draftFormation") || formation;
  const [currentFormation, setCurrentFormation] = useState(draftFormation);
  const positions = FORMATIONS[currentFormation];
  const [team, setTeam] = useState(draftTeam || initialTeam || Array(positions.length).fill(null));
  const [showSavePopup, setShowSavePopup] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [showAuthPopup, setShowAuthPopup] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);
  const [step, setStep] = useState(1); // 1: ligue, 2: club, 3: joueur
  const [leagues, setLeagues] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [players, setPlayers] = useState([]);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [playerError, setPlayerError] = useState("");

  useEffect(() => {
    console.log("Équipe actuelle :", team);
  }, [team]);

  useEffect(() => {
    localStorage.setItem("draftTeam", JSON.stringify(team));
    localStorage.setItem("draftFormation", currentFormation);
  }, [team, currentFormation]);

  // Ouvre la pop-up et mémorise le poste du bouton "+" cliqué
  const handleAddPlayerClick = (idx) => {
    const positionLabel = getPositionLabel(currentFormation, idx);
    setSelectedPosition(positionLabel);
    setSelectedIdx(idx); // <-- mémorise l'index
    setPopupOpen(true);
    setStep(1);
    fetch("http://localhost:4000/football/leagues")
      .then((res) => res.json())
      .then((data) => setLeagues(data.leagues || data));
  };

  // Sélection de la ligue
  const handleLeagueSelect = (leagueId) => {
    setStep(2);
    fetch(`http://localhost:4000/football/teams?competitionId=${leagueId}`)
      .then((res) => res.json())
      .then((data) => setClubs(data.teams)); // adapte selon la structure renvoyée
  };

  // Sélection du club
  const handleClubSelect = (clubId) => {
    const positions = mapCategoryToPositions(selectedPosition); // Convertit la catégorie en postes spécifiques
    console.log(
      "clubId:",
      clubId,
      "selectedPosition:",
      selectedPosition,
      "positions:",
      positions
    ); // debug
    setStep(3);
    fetch(
      `http://localhost:4000/football/players-by-category?teamId=${clubId}&positions=${positions.join(
        ","
      )}`
    )
      .then((res) => res.json())
      .then((data) => {
        console.log("Données reçues des joueurs:", data); // Inspecte la réponse
        setPlayers(data);
      })
      .catch((err) => {
        console.error("Erreur fetch joueurs:", err);
      });
  };

  // Sélection du joueur (à compléter selon ton besoin)
  const handlePlayerSelect = (playerId) => {
    const selectedPlayer = players.find((p) => p.id === playerId);
    if (selectedPlayer && selectedIdx !== null) {
      // Vérifie si le joueur est déjà dans l’équipe
      if (team.some((p) => p && p.id === playerId)) {
        setPlayerError("Ce joueur est déjà sélectionné dans l'équipe !");
        return;
      }
      const newTeam = [...team];
      newTeam[selectedIdx] = selectedPlayer;
      setTeam(newTeam);
      setPlayerError(""); // Réinitialise l’erreur
    }
    setPopupOpen(false);
    setSelectedIdx(null);
  };

  const handlePopupBack = () => {
    if (step === 2) setStep(1);
    else if (step === 3) setStep(2);
  };

  function getPositionLabel(formation, idx) {
    // Exemple pour 4-4-2
    if (formation === "4-4-2") {
      if (idx === 0) return "Goalkeeper";
      if (idx >= 1 && idx <= 4) return "Defender";
      if (idx >= 5 && idx <= 8) return "Midfielder";
      return "Attacker";
    }
    if (formation === "4-2-3-1") {
      if (idx === 0) return "Goalkeeper";
      if (idx >= 1 && idx <= 4) return "Defender";
      if (idx >= 5 && idx <= 6) return "Midfielder";
      return "Attacker";
    }
    if (formation === "3-4-3") {
      if (idx === 0) return "Goalkeeper";
      if (idx >= 1 && idx <= 3) return "Defender";
      if (idx >= 4 && idx <= 7) return "Midfielder";
      return "Attacker";
    }
    if (formation === "4-3-3") {
      if (idx === 0) return "Goalkeeper";
      if (idx >= 1 && idx <= 4) return "Defender";
      if (idx >= 5 && idx <= 7) return "Midfielder";
      return "Attacker";
    }
    if (formation === "3-5-2") {
      if (idx === 0) return "Goalkeeper";
      if (idx >= 1 && idx <= 3) return "Defender";
      if (idx >= 4 && idx <= 8) return "Midfielder";
      return "Attacker";
    }
    return "Attacker";
  }

  function mapCategoryToPositions(category) {
    if (category === "Defender") {
      return ["Right-Back", "Centre-Back", "Left-Back"];
    }
    if (category === "Midfielder") {
      return [
        "Central Midfield",
        "Defensive Midfield",
        "Attacking Midfield",
        "Midfield",
      ];
    }
    if (category === "Attacker") {
      return ["Left Winger", "Right Winger", "Centre-Forward", "Offence"];
    }
    if (category === "Goalkeeper") {
      return ["Goalkeeper"];
    }
    return [];
  }

  return (
    <div className="field-page">
      <div className="side-panel">
        {/* Bouton couleur */}
        <button
          className="color-circle-btn"
          style={{ background: terrain.color }}
          onClick={() => setShowPopup(true)}
          aria-label="Changer la couleur du terrain"
        >
          <img src={paletteIcon} alt="Palette" className="palette-icon" />
        </button>
        {showPopup && (
          <div className="color-popup" onMouseLeave={() => setShowPopup(false)}>
            {COLORS.map((c) => (
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
          onClick={!readOnly ? () => setShowFormationPopup(true) : undefined}
          aria-label="Changer la formation"
          disabled={readOnly}
          style={readOnly ? { opacity: 0.6, cursor: "not-allowed" } : {}}
        >
          <span className="formation-label">{currentFormation}</span>
        </button>
        {showFormationPopup && (
          <div
            className="formation-popup"
            onMouseLeave={() => setShowFormationPopup(false)}
          >
            {FORMATION_LIST.map((f) => (
              <button
                key={f.name}
                className={`formation-choice${
                  currentFormation === f.name ? " selected" : ""
                }`}
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
        {!readOnly && (
          <button
            className="popup-save-btn"
            onClick={() => {
              if (!user) {
                setShowAuthPopup(true); // Affiche la popup d’auth
              } else {
                setShowSavePopup(true); // Affiche la popup de sauvegarde
              }
            }}
            aria-label="Sauvegarder l'équipe"
          >
            <img src={saveIcon} alt="Sauvegarder" />
          </button>
        )}
      </div>
      <div className="field-container">
        <img src={terrain.img} alt="terrain" className="field-bg" />
        {positions.map(([x, y], idx) =>
          team[idx] ? (
            <div
              key={idx}
              className="player-rect"
              style={{
                position: "absolute",
                left: `${x}%`,
                top: `${y}%`,
                transform: "translate(-50%, -50%)",
                zIndex: 2,
                cursor: readOnly ? "default" : "pointer"
              }}
              onClick={!readOnly ? () => handleAddPlayerClick(idx) : undefined}
            >
              {team[idx].name}
            </div>
          ) : (
            !readOnly && (
              <button
                key={idx}
                className="player-spot"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                }}
                onClick={() => handleAddPlayerClick(idx)}
              >
                +
              </button>
            )
          )
        )}
        <button className="back-btn" onClick={
          () => {
            localStorage.removeItem("draftTeam");
            localStorage.removeItem("draftFormation");
            onBack();
          }
        }>
          <span>Retour</span>
          <img src={backArrow} alt="Retour" />
        </button>
      </div>

      {/* Pop-up */}
      {popupOpen && (
        <div className="player-popup-overlay">
          <div className="popup">
            {selectedPosition && (
              <div className="selected-position-info">
                <strong>Poste choisi :</strong> {selectedPosition}
              </div>
            )}
            <button
              className="popup-close-btn"
              onClick={() => { setPopupOpen(false); setPlayerError(""); }}
              aria-label="Fermer"
            >
              <span style={{ fontWeight: "bold", fontSize: "2rem" }}>
                &times;
              </span>
            </button>
            {step === 1 && (
              <div>
                <h3>Choisis une ligue</h3>
                <ul>
                  {leagues.map((league) => (
                    <li key={league.id}>
                      <button onClick={() => handleLeagueSelect(league.id)}>
                        {league.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {step === 2 && (
              <div>
                <h3>Choisis un club</h3>
                <ul>
                  {clubs.map((club) => (
                    <li
                      key={club.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      {club.crest && (
                        <img
                          src={club.crest}
                          alt={club.name}
                          style={{ width: 24, height: 24, objectFit: "contain" }}
                        />
                      )}
                      <button onClick={() => handleClubSelect(club.id)}>
                        {club.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {step === 3 && (
              <div>
                <h3>Choisis un joueur</h3>
                {playerError && (
                  <div style={{ color: "#B50000", marginBottom: "1rem", fontWeight: "bold" }}>
                    {playerError}
                  </div>
                )}
                <ul>
                  {players.map((player) => (
                    <li key={player.id}>
                      <button onClick={() => handlePlayerSelect(player.id)}>
                        {player.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {/* Bouton retour */}
            {step > 1 && (
              <>
                <button
                  className="popup-back-btn"
                  onClick={() => { handlePopupBack(); setPlayerError(""); }}
                  aria-label="Retour"
                >
                  <span style={{ fontWeight: "bold", fontSize: "2rem" }}>
                    &larr;
                  </span>
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Pop-up sauvegarde */}
      {showSavePopup && (
        <div className="save-popup-overlay">
          <div className="save-popup">
            <h3>Nomme ton équipe</h3>
            <input
              type="text"
              placeholder="Nom de l'équipe"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="team-name-input"
              required
            />
            <button
              className="save-team-btn"
              onClick={async () => {
                // Sauvegarde
                const token = await auth.currentUser.getIdToken();
                fetch('http://localhost:4000/football/save-team', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // ou user.accessToken
                  },
                  body: JSON.stringify({
                    name: teamName,
                    formation: currentFormation,
                    team,
                  }),
                })
                  .then(res => res.json())
                  .then(data => {
                    console.log('Réponse backend:', data);
                    setShowSavePopup(false);
                    setTeamName("");
                    alert("Équipe sauvegardée !");
                  });
              }}
              disabled={team.includes(null) || !teamName.trim()}
            >
              Sauvegarder
            </button>
            <button
              className="save-popup-close-btn"
              onClick={() => setShowSavePopup(false)}
              aria-label="Fermer"
            >
              <span style={{ fontWeight: "bold", fontSize: "2rem" }}>
                &times;
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Pop-up auth */}
      {showAuthPopup && (
        <div className="save-popup-overlay">
          <div className="save-popup">
            <h3>Connexion requise</h3>
            <p>Vous devez être connecté pour sauvegarder une équipe.</p>
            <button
              className="save-team-btn"
              onClick={() => {
                setShowAuthPopup(false);
                onRequestLogin(); // fonction à définir pour ouvrir LoginForm
              }}
            >
              Se connecter
            </button>
            <button
              className="save-team-btn"
              onClick={() => {
                setShowAuthPopup(false);
                onRequestRegister(); // fonction à définir pour ouvrir RegisterForm
              }}
            >
              Créer un compte
            </button>
            <button
              className="save-popup-close-btn"
              onClick={() => setShowAuthPopup(false)}
              aria-label="Fermer"
            >
              <span style={{ fontWeight: "bold", fontSize: "2rem" }}>
                &times;
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

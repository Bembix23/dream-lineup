import { useState } from "react";
import { auth } from "./firebase";
import { updateEmail, updatePassword, deleteUser } from "firebase/auth";
import './Account.css';

export default function Account({ onLogout, onBack }) {
  const user = auth.currentUser;
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleEmailChange = async (e) => {
    e.preventDefault();
    try {
      await updateEmail(user, email);
      setMessage("Email modifié !");
    } catch (err) {
      setMessage("Erreur : " + err.message);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      await updatePassword(user, password);
      setMessage("Mot de passe modifié !");
    } catch (err) {
      setMessage("Erreur : " + err.message);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.")) {
      try {
        await deleteUser(user);
        setMessage("Compte supprimé.");
        if (onLogout) onLogout();
      } catch (err) {
        setMessage("Erreur : " + err.message);
      }
    }
  };

  return (
    <div className="account-container">
      <h2>Mon compte</h2>
      <form onSubmit={handleEmailChange}>
        <label htmlFor="email-change">Changer l'email :</label>
        <input
          id="email-change"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          aria-describedby={message ? "account-message" : undefined}
        />
        <button type="submit">Modifier l'email</button>
      </form>
      <form onSubmit={handlePasswordChange}>
        <label htmlFor="password-change">Nouveau mot de passe :</label>
        <input
          id="password-change"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          minLength="6"
          aria-describedby={message ? "account-message" : undefined}
        />
        <button type="submit">Modifier le mot de passe</button>
      </form>
      <button
        className="account-logout"
        style={{ marginTop: "2rem" }}
        onClick={onBack}
        aria-label="Retour au menu principal"
      >
        Retour au menu
      </button>
      <button
        className="account-delete"
        style={{ marginTop: "1rem" }}
        onClick={handleDeleteAccount}
        aria-label="Supprimer définitivement mon compte"
      >
        Supprimer mon compte
      </button>
      {message && <div id="account-message" style={{ marginTop: "1rem", color: "#B50000" }} role="alert">{message}</div>}
    </div>
  );
}
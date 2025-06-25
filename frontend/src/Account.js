import { useState } from "react";
import { auth } from "./firebase";
import { updateEmail, updatePassword } from "firebase/auth";

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

  return (
    <div className="account-container">
      <h2>Mon compte</h2>
      <form onSubmit={handleEmailChange}>
        <label>Changer l'email :</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <button type="submit">Modifier l'email</button>
      </form>
      <form onSubmit={handlePasswordChange}>
        <label>Nouveau mot de passe :</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit">Modifier le mot de passe</button>
      </form>
      {message && <div style={{ marginTop: "1rem", color: "#B50000" }}>{message}</div>}
      <button style={{ marginTop: "2rem" }} onClick={onBack}>Retour au menu</button>
    </div>
  );
}
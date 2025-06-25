import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";
import './LoginForm.css';

export default function LoginForm({ onBack, onSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      onSuccess();
    } catch (err) {
      setError("Identifiants incorrects ou utilisateur inconnu.");
    }
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <h2>Connexion</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Mot de passe"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      {error && <div className="erreur">{error}</div>}
      <button type="submit">Se connecter</button>
      <button type="button" onClick={onBack}>Retour</button>
    </form>
  );
}
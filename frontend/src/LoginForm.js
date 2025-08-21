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
      <label htmlFor="email-login">Email</label>
      <input
        id="email-login"
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        aria-describedby={error ? "login-error" : undefined}
      />
      <label htmlFor="password-login">Mot de passe</label>
      <input
        id="password-login"
        type="password"
        placeholder="Mot de passe"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
        aria-describedby={error ? "login-error" : undefined}
      />
      {error && <div id="login-error" className="erreur" role="alert">{error}</div>}
      <button type="submit">Se connecter</button>
      <button type="button" onClick={onBack} aria-label="Retour au menu principal">Retour</button>
    </form>
  );
}
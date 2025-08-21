import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";

export default function RegisterForm({ onBack, onSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setSuccess(true);
      onSuccess();
    } catch (err) {
      setError("Erreur lors de la création du compte : " + err.message);
    }
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <h2>Créer un compte</h2>
      <label htmlFor="email-register">Email</label>
      <input
        id="email-register"
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        aria-describedby={error ? "register-error" : undefined}
      />
      <label htmlFor="password-register">Mot de passe</label>
      <input
        id="password-register"
        type="password"
        placeholder="Mot de passe"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
        minLength="6"
        aria-describedby={error ? "register-error" : undefined}
      />
      {error && <div id="register-error" className="erreur" role="alert">{error}</div>}
      {success && <div className="succes" role="alert" style={{ color: "green", marginBottom: "1rem" }}>Compte créé avec succès !</div>}
      <button type="submit">Créer</button>
      <button type="button" onClick={onBack} aria-label="Retour au menu principal">Retour</button>
    </form>
  );
}
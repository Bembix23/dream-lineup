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
      {success && <div style={{ color: "green", marginBottom: "1rem" }} className="succes">Compte créé avec succès !</div>}
      <button type="submit">Créer</button>
      <button type="button" onClick={onBack}>Retour</button>
    </form>
  );
}
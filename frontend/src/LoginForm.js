export default function LoginForm({ onBack }) {
  return (
    <div>
      <h2>Connexion</h2>
      {/* ...formulaire de connexion... */}
      <button onClick={onBack}>Retour</button>
    </div>
  );
}
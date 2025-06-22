export default function RegisterForm({ onBack }) {
  return (
    <div>
      <h2>Créer un compte</h2>
      {/* ...formulaire d'inscription... */}
      <button onClick={onBack}>Retour</button>
    </div>
  );
}
// Exemple simple sans base de données

exports.adminLogin = (req, res) => {
  const { username, password } = req.body;

  const ADMIN_USERNAME = "root";
  const ADMIN_PASSWORD = "root";

  // Vérifie les identifiants admin
  if (username === ADMIN_USERNAME && password === ADMIN_USERNAME) {
    return res.status(200).json({ message: "✅ Connexion admin réussie" });
  } else {
    return res.status(401).json({ message: "❌ Identifiants invalides" });
  }
};

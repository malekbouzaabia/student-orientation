const jwt = require("jsonwebtoken"); // 🔹 OBLIGATOIRE !

// 🔹 Connexion Admin (hardcodée, sans DB pour simplicité)
exports.adminLogin = (req, res) => {
  const { email, password } = req.body;

  const ADMIN_EMAIL = "root@gmail.com";
  const ADMIN_PASSWORD = "root";

  console.log('Email admin reçu:', email);
  console.log('Password admin reçu:', password ? '***' : 'absent');

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const token = jwt.sign(
      { role: 'admin', email: ADMIN_EMAIL },
      process.env.JWT_SECRET || "ton_secret_jwt",
      { expiresIn: "1h" }
    );

    return res.status(200).json({ 
      success: true,
      message: "✅ Connexion admin réussie",
      token,
      user: { email: ADMIN_EMAIL, role: 'admin' }
    });
  } else {
    return res.status(401).json({ 
      success: false,
      message: "❌ Identifiants admin invalides" 
    });
  }
};

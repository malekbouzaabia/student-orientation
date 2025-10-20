const Student = require("../models/Student");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken"); // 🔹 pour le token

// 🔹 Inscription
exports.registerStudent = async (req, res) => {
  const { nom, prenom, email, password } = req.body; // Supprimé confirmPassword (validation frontend uniquement)

  // Debug : Log des données reçues
  console.log('Body reçu pour inscription:', { nom, prenom, email, password: '***' });

  if (!nom?.trim() || !prenom?.trim() || !email?.trim() || !password?.trim()) {
    return res.status(400).json({ msg: "Veuillez remplir tous les champs" });
  }

  try {
    // Vérifier si l'email existe déjà
    let existing = await Student.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(400).json({ msg: "Email déjà utilisé" });
    }

    // Hachage du mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    // Création de l'étudiant
    const student = new Student({ 
      nom: nom.trim(), 
      prenom: prenom.trim(), 
      email: email.toLowerCase().trim(), 
      password: hashed 
    });
    await student.save();

    // Réponse de succès (sans password)
    res.status(201).json({
      success: true, // Ajouté pour cohérence avec frontend
      id: student._id,
      nom: student.nom,
      prenom: student.prenom,
      email: student.email
    });
  } catch (err) {
    console.error('Erreur inscription:', err);
    res.status(500).json({ msg: "Erreur serveur" }); // JSON pour cohérence
  }
};

// 🔹 Connexion
exports.loginStudent = async (req, res) => {
  const { email, password } = req.body;

  // Debug : Log des données reçues
  console.log('Email reçu pour connexion:', email);
  console.log('Password reçu (masqué):', password ? '***' : 'absent');

  if (!email?.trim() || !password?.trim()) {
    return res.status(400).json({ msg: "Veuillez remplir tous les champs" });
  }

  try {
    const student = await Student.findOne({ email: email.toLowerCase().trim() });
    console.log('Utilisateur trouvé en DB:', student ? { id: student._id, email: student.email } : 'Aucun');

    if (!student) {
      return res.status(401).json({ msg: "Identifiants incorrects" });
    }

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(401).json({ msg: "Identifiants incorrects" });
    }

    // Génération du token JWT
    const token = jwt.sign(
      { id: student._id, email: student.email },
      process.env.JWT_SECRET || "ton_secret_jwt", // Utilise une env var pour prod
      { expiresIn: "1h" }
    );

    // Réponse de succès
    res.json({ 
      success: true, // Ajouté pour cohérence avec frontend
      msg: "Connexion réussie", 
      token,
      user: {
        id: student._id,
        nom: student.nom,
        prenom: student.prenom,
        email: student.email
      }
    });
  } catch (err) {
    console.error('Erreur connexion:', err);
    res.status(500).json({ msg: "Erreur serveur" });
  }
};

// 🔹 GET par ID
exports.getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).select("-password");
    if (!student) {
      return res.status(404).json({ msg: "Étudiant non trouvé" });
    }
    res.status(200).json({ success: true, student });
  } catch (err) {
    console.error('Erreur getStudentById:', err.message);
    res.status(500).json({ msg: "Erreur serveur" });
  }
};
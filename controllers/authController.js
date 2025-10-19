const Student = require("../models/Student");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken"); // 🔹 pour le token

// 🔹 Inscription
exports.registerStudent = async (req, res) => {
  const { nom, prenom, email, password, confirmPassword } = req.body;

  if (!nom || !prenom || !email || !password || !confirmPassword) {
    return res.status(400).json({ msg: "Veuillez remplir tous les champs" });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ msg: "Les mots de passe ne correspondent pas" });
  }

  try {
    let existing = await Student.findOne({ email });
    if (existing) return res.status(400).json({ msg: "Email déjà utilisé" });

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const student = new Student({ nom, prenom, email, password: hashed });
    await student.save();

    res.status(201).json({
      id: student._id,
      nom: student.nom,
      prenom: student.prenom,
      email: student.email
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur serveur");
  }
};

// 🔹 Connexion
exports.loginStudent = async (req, res) => {
  const { email, password } = req.body;
console.log("Email reçu :", email);
  console.log("Password reçu :", password);
  if (!email || !password) return res.status(400).json({ msg: "Veuillez remplir tous les champs" });

  try {
    const student = await Student.findOne({ email });
     console.log("Utilisateur DB :", student);
    if (!student) return res.status(401).json({ msg: "Identifiants incorrects" });

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) return res.status(401).json({ msg: "Identifiants incorrects" });

    // 🔹 Génération du token JWT
    const token = jwt.sign(
      { id: student._id, email: student.email },
      "ton_secret_jwt", // remplace par une variable d'environnement pour la production
      { expiresIn: "1h" }
    );

    res.json({ msg: "Connexion réussie", token });
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur serveur");
  }
};

// 🔹 GET par ID
exports.getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).select("-password");
    if (!student) return res.status(404).json({ msg: "Étudiant non trouvé" });
    res.status(200).json(student);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erreur serveur");
  }
};

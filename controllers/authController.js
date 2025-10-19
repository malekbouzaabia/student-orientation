const Student = require("../models/Student");
const bcrypt = require("bcryptjs");

exports.registerStudent = async (req, res) => {
  const { nom, prenom, email, password } = req.body;

  // validation simple
  if (!nom || !prenom || !email || !password) {
    return res.status(400).json({ msg: "Veuillez remplir tous les champs" });
  }

  try {
    // vérifie si email existe déjà
    let existing = await Student.findOne({ email });
    if (existing) return res.status(400).json({ msg: "Email déjà utilisé" });

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    // créer et sauvegarder
    const student = new Student({ nom, prenom, email, password: hashed });
    await student.save();

    // renvoyer l'objet sans password
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
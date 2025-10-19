const express = require("express");
const router = express.Router();
const { registerStudent, loginStudent, getStudentById } = require("../controllers/authController");

// Inscription
router.post("/enregistrer", registerStudent);

// Connexion
router.post("/loginStudent", loginStudent);

// GET par ID
router.get("/:id", getStudentById);

module.exports = router;

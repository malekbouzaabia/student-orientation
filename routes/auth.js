const express = require("express");
const router = express.Router();
const {
  registerStudent,
  getStudentById,
} = require("../controllers/authController"); // 👈 Import des fonctions du controller

// Route d'inscription
router.post("/enregistrer", registerStudent);

// Route GET par ID
router.get("/:id", getStudentById);

module.exports = router;

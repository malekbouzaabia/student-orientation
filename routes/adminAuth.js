const express = require("express");
const router = express.Router();
const { adminLogin } = require("../controllers/adminController");

// Route de connexion admin
router.post("/login", adminLogin);

module.exports = router;

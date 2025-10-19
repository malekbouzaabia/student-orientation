const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
require("dotenv").config();

const app = express();

// 🔹 Middleware pour parser le JSON
app.use(cors());
app.use(express.json()); // <-- c'est indispensable pour req.body

connectDB();
// 🔹 Routes

app.use("/api/auth", require("./routes/auth"));
app.use("/api/admin", require("./routes/adminAuth"));



// 🔹 Lancer le serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Serveur démarré sur le port ${PORT}`));

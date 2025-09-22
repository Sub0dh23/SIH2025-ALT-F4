// server.js
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const apiRoutes = require("./routes/index"); // Imports the main router

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // To parse JSON request bodies

// API Routes
// All routes defined in the /routes folder will be prefixed with /api
app.use("/api", apiRoutes);

// Simple welcome route for the root URL
app.get("/", (req, res) => {
	res.send("<h1>Smart Timetable API</h1><p>Welcome!</p>");
});

app.listen(PORT, () => {
	console.log(`🚀 Server is running on http://localhost:${PORT}`);
});

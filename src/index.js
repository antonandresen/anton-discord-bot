const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const { connectDiscordBot } = require("./bot");

// Load env
dotenv.config({ path: "./src/config.env" });

// Init app.
const app = express();

// Connect discord bot.
connectDiscordBot();

// Middlewares.
app.use(cors()); // Cors headers.
app.use(express.json({ extended: false })); // Parse JSON.

// Make sure everythings working endpoint.
app.get("/", (req, res) => {
  res.json({ hi: "its working!" });
});

// Handle production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(__dirname + "/public"));
}

// Start server.
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

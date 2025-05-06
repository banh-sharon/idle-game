const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("public")); // for index.html etc.

const db = new sqlite3.Database("leaderboard.db");

// Create table if it doesn't exist
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS leaderboard (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      cookies INTEGER
    )
  `);
});

// Get top 10 leaderboard scores
app.get("/leaderboard", (req, res) => {
  db.all("SELECT name, cookies FROM leaderboard ORDER BY cookies DESC LIMIT 10", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }
    res.json(rows);
  });
});

// Submit a score
app.post("/leaderboard", (req, res) => {
  const { name, cookies } = req.body;
  if (!name || typeof cookies !== "number") {
    return res.status(400).json({ error: "Invalid submission" });
  }

  db.run("INSERT INTO leaderboard (name, cookies) VALUES (?, ?)", [name, cookies], function(err) {
    if (err) {
      return res.status(500).json({ error: "Failed to save score" });
    }
    res.json({ success: true });
  });
});

app.listen(PORT, () => {
  console.log(`Leaderboard server running at http://localhost:${PORT}`);
});

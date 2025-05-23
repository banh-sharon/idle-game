// ✅ server.js
const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("public")); // Serve frontend

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

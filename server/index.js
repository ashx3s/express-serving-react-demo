"use strict";
const path = require("path");
const express = require("express");

const app = express();
const PORT = 3000;

const distPath = path.join(__dirname, "..", "client", "dist");
app.use(express.static(distPath));

app.get("/api/hello", (req, res) => {
  res.json({
    message: "Hello from the Express server!",
    timestamp: new Date().toISOString(),
  });
});

app.get("/*splat", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Uh Oh, Server Error");
});

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const projectRoutes = require("./routes/project.routes");
const bugRoutes = require("./routes/bug.routes");


const app = express();

app.use(cors());
console.log("✅ App.js Loaded");

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/bugs", bugRoutes);

app.get("/", (req, res) => {
  res.send("API Running");
});

module.exports = app;

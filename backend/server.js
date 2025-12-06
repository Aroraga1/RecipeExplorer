const express = require("express");
const cors = require("cors");
const connectDB = require("./config/database");
const routes = require("./config/routes");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get(routes.health, (req, res) => {
  const mongoose = require("mongoose");
  res.json({
    status: "OK",
    message: "Recipe Explorer API is running",
    mongodb:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

const recipeRoutes = require("./routes/recipeRoutes");
const aiRoutes = require("./routes/aiRoutes");

app.use(routes.recipes, recipeRoutes);
app.use(routes.ai, aiRoutes);

app.use((err, req, res, next) => {
  if (process.env.NODE_ENV === "development") {
    console.error("Error:", err.stack);
  } else {
    console.error("Error:", err.message);
  }
  res.status(err.status || 500).json({
    success: false,
    error: "Something went wrong!",
    message: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

app.use((req, res) => {
  if (process.env.NODE_ENV === "development") {
    console.log(`404: ${req.method} ${req.path}`);
  }
  res.status(404).json({
    success: false,
    error: "Route not found",
    path: req.path,
    method: req.method,
  });
});

if (process.env.NODE_ENV === "development") {
  console.log("Registered Routes:");
  console.log(`  Recipe Routes: ${routes.recipes}`);
  console.log(`  AI Routes: ${routes.ai}`);
  console.log(`  Health Check: ${routes.health}`);
}

const startServer = async () => {
  try {
    await connectDB();

    const PORT = process.env.PORT;

    if (!PORT) {
      console.error("PORT environment variable is required");
      process.exit(1);
    }

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();

module.exports = app;

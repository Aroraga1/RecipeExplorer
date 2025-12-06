require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/database");
const routes = require("./config/routes");
const recipeRoutes = require("./routes/recipeRoutes");
const aiRoutes = require("./routes/aiRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === "development") {
  app.use((req, res, next) => {
    if (req.path.startsWith("/api/")) {
      console.log(`Request: ${req.method} ${req.path}`);
    }
    next();
  });
}

app.get(routes.health, (req, res) => {
  const mongoose = require("mongoose");
  res.json({
    status: "OK",
    message: "Recipe Explorer API is running",
    mongodb:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

app.use(routes.recipes, recipeRoutes);
app.use(routes.ai, aiRoutes);

console.log("Registered Routes:");
console.log(`  Health: ${routes.health}`);
console.log(`  Recipes: ${routes.recipes}`);
console.log(`  AI: ${routes.ai}`);
console.log("  AI Routes:");
console.log(`    POST ${routes.ai}/suggest`);
console.log(`    POST ${routes.ai}/simplify`);
console.log(`    POST ${routes.ai}/cooking-tips`);

if (aiRoutes && aiRoutes.stack) {
  console.log(`  AI Router has ${aiRoutes.stack.length} registered routes`);
  aiRoutes.stack.forEach((layer, index) => {
    if (layer.route) {
      const method = Object.keys(layer.route.methods)[0].toUpperCase();
      console.log(
        `    ${index + 1}. ${method} ${routes.ai}${layer.route.path}`
      );
    }
  });
}

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
      console.log("Available AI endpoints:");
      console.log(`  POST http://localhost:${PORT}${routes.ai}/suggest`);
      console.log(`  POST http://localhost:${PORT}${routes.ai}/simplify`);
      console.log(`  POST http://localhost:${PORT}${routes.ai}/search`);
      console.log(`  POST http://localhost:${PORT}${routes.ai}/cooking-tips`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();

module.exports = app;

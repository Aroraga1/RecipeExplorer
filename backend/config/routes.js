const API_PREFIX = process.env.API_PREFIX || "/api";
const API_VERSION = process.env.API_VERSION || "v1";

const routes = {
  prefix: API_PREFIX,
  version: API_VERSION,
  health: `${API_PREFIX}/health`,
  recipes: `${API_PREFIX}/recipes`,
  ai: `${API_PREFIX}/ai`,
};

module.exports = routes;


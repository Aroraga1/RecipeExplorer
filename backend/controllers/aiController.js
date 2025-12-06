const aiService = require("../services/aiService");
const Recipe = require("../models/Recipe");

exports.suggestRecipe = async (req, res) => {
  try {
    const { ingredients } = req.body;

    if (!ingredients) {
      return res.status(400).json({
        success: false,
        error: 'Ingredients are required'
      });
    }

    const result = await aiService.suggestRecipeFromIngredients(ingredients);
    
    res.json({
      success: result.success,
      data: result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error generating recipe suggestion',
      message: error.message
    });
  }
};

exports.simplifyInstructions = async (req, res) => {
  try {
    let instructions = req.body.instructions;
    const { recipeId } = req.body;

    if (recipeId && !instructions) {
      const recipe = await Recipe.findById(recipeId);
      if (!recipe) {
        return res.status(404).json({
          success: false,
          error: 'Recipe not found'
        });
      }
      instructions = recipe.instructions;
    }

    if (!instructions) {
      return res.status(400).json({
        success: false,
        error: 'Instructions or recipeId is required'
      });
    }

    const result = await aiService.simplifyInstructions(instructions);
    
    res.json({
      success: result.success,
      data: result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error simplifying instructions',
      message: error.message
    });
  }
};

exports.aiSearch = async (req, res) => {
  try {
    const { query } = req.body;

    if (!query || typeof query !== 'string' || query.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Search query is required'
      });
    }

    const result = await aiService.parseSearchQuery(query);
    
    res.json({
      success: result.success,
      data: result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error processing AI search',
      message: error.message
    });
  }
};

exports.getCookingTips = async (req, res) => {
  try {
    const { recipeId } = req.body;

    if (!recipeId) {
      return res.status(400).json({
        success: false,
        error: 'Recipe ID is required'
      });
    }

    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({
        success: false,
        error: 'Recipe not found'
      });
    }

    const result = await aiService.getCookingTips(recipe);
    
    res.json({
      success: result.success,
      data: result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error in getCookingTips controller:", error);
    }
    res.status(500).json({
      success: false,
      error: "Error generating cooking tips",
      message: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

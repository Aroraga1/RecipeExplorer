const Recipe = require("../models/Recipe");

exports.getAllRecipes = async (req, res) => {
  try {
    const {
      cuisine,
      isVegetarian,
      maxPrepTime,
      minPrepTime,
      difficulty,
      tags,
      ingredient,
      search
    } = req.query;

    let query = {};

    if (cuisine) {
      query.cuisine = { $regex: cuisine, $options: 'i' };
    }

    if (isVegetarian !== undefined) {
      query.isVegetarian = isVegetarian === 'true';
    }

    if (minPrepTime || maxPrepTime) {
      query.prepTimeMinutes = {};
      if (minPrepTime) {
        query.prepTimeMinutes.$gte = parseInt(minPrepTime);
      }
      if (maxPrepTime) {
        query.prepTimeMinutes.$lte = parseInt(maxPrepTime);
      }
    }

    if (difficulty) {
      query.difficulty = difficulty;
    }

    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : [tags];
      query.tags = { $in: tagArray.map(tag => new RegExp(tag, 'i')) };
    }

    if (ingredient) {
      query.ingredients = { $regex: ingredient, $options: 'i' };
    }

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      const searchConditions = {
        $or: [
          { name: searchRegex },
          { cuisine: searchRegex },
          { tags: searchRegex },
          { ingredients: searchRegex }
        ]
      };
      
      if (Object.keys(query).length > 0) {
        query = {
          $and: [
            query,
            searchConditions
          ]
        };
      } else {
        query = searchConditions;
      }
    }

    const recipes = await Recipe.find(query).sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: recipes.length,
      data: recipes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error fetching recipes',
      message: error.message
    });
  }
};

exports.getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    
    if (!recipe) {
      return res.status(404).json({
        success: false,
        error: 'Recipe not found'
      });
    }

    res.json({
      success: true,
      data: recipe
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid recipe ID'
      });
    }
    res.status(500).json({
      success: false,
      error: 'Error fetching recipe',
      message: error.message
    });
  }
};

exports.createRecipe = async (req, res) => {
  try {
    const recipe = new Recipe(req.body);
    const savedRecipe = await recipe.save();
    
    res.status(201).json({
      success: true,
      data: savedRecipe
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        messages: errors
      });
    }
    res.status(500).json({
      success: false,
      error: 'Error creating recipe',
      message: error.message
    });
  }
};

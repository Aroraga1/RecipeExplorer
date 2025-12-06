const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Recipe name is required'],
    trim: true,
    maxlength: [200, 'Recipe name cannot exceed 200 characters']
  },
  cuisine: {
    type: String,
    required: [true, 'Cuisine type is required'],
    trim: true
  },
  isVegetarian: {
    type: Boolean,
    required: [true, 'Vegetarian status is required'],
    default: false
  },
  prepTimeMinutes: {
    type: Number,
    required: [true, 'Preparation time is required'],
    min: [1, 'Preparation time must be at least 1 minute']
  },
  ingredients: {
    type: [String],
    required: [true, 'Ingredients list is required'],
    validate: {
      validator: function(v) {
        return v && v.length > 0;
      },
      message: 'At least one ingredient is required'
    }
  },
  difficulty: {
    type: String,
    required: [true, 'Difficulty level is required'],
    enum: {
      values: ['Easy', 'Medium', 'Hard'],
      message: 'Difficulty must be Easy, Medium, or Hard'
    }
  },
  instructions: {
    type: [String],
    required: [true, 'Instructions are required'],
    validate: {
      validator: function(v) {
        return v && v.length > 0;
      },
      message: 'At least one instruction step is required'
    }
  },
  tags: {
    type: [String],
    default: [],
    trim: true
  }
}, {
  timestamps: true
});

recipeSchema.index({ name: 'text', cuisine: 'text', tags: 'text' });
recipeSchema.index({ isVegetarian: 1 });
recipeSchema.index({ prepTimeMinutes: 1 });
recipeSchema.index({ difficulty: 1 });

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;

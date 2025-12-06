import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { recipeAPI } from '../services/api';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Loader2, ArrowLeft, Plus, X, CheckCircle2, AlertCircle } from 'lucide-react';

const RecipeForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    cuisine: '',
    isVegetarian: false,
    prepTimeMinutes: '',
    difficulty: 'Easy',
    ingredients: [''],
    instructions: [''],
    tags: []
  });

  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleIngredientChange = (index, value) => {
    const newIngredients = [...formData.ingredients];
    newIngredients[index] = value;
    setFormData(prev => ({
      ...prev,
      ingredients: newIngredients
    }));
  };

  const addIngredient = () => {
    setFormData(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, '']
    }));
  };

  const removeIngredient = (index) => {
    if (formData.ingredients.length > 1) {
      const newIngredients = formData.ingredients.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        ingredients: newIngredients
      }));
    }
  };

  const handleInstructionChange = (index, value) => {
    const newInstructions = [...formData.instructions];
    newInstructions[index] = value;
    setFormData(prev => ({
      ...prev,
      instructions: newInstructions
    }));
  };

  const addInstruction = () => {
    setFormData(prev => ({
      ...prev,
      instructions: [...prev.instructions, '']
    }));
  };

  const removeInstruction = (index) => {
    if (formData.instructions.length > 1) {
      const newInstructions = formData.instructions.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        instructions: newInstructions
      }));
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const submitData = {
        ...formData,
        ingredients: formData.ingredients.filter(ing => ing.trim() !== ''),
        instructions: formData.instructions.filter(inst => inst.trim() !== ''),
        prepTimeMinutes: parseInt(formData.prepTimeMinutes)
      };

      const response = await recipeAPI.create(submitData);
      setSuccess(true);
      setTimeout(() => {
        navigate(`/recipe/${response.data._id}`);
      }, 1500);
    } catch (err) {
      const errorMessage = err.response?.data?.error || 
                          err.response?.data?.messages?.join(', ') || 
                          'Unable to save recipe. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <Button variant="ghost" asChild className="mb-6">
        <Link to="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">
            Create New Recipe
          </CardTitle>
        </CardHeader>

        <CardContent>
          {success && (
            <div className="mb-6 p-4 bg-green-50 border-2 border-green-300 rounded-lg flex items-center gap-2 text-green-700">
              <CheckCircle2 className="h-5 w-5" />
              Recipe created successfully! Redirecting...
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-destructive/10 border-2 border-destructive/40 rounded-lg flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Basic Information</h2>
              
              <div className="space-y-2">
                <Label htmlFor="name">
                  Recipe Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Recipe name"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cuisine">
                    Cuisine <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.cuisine}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, cuisine: value }))}
                    required
                  >
                    <SelectTrigger id="cuisine">
                      <SelectValue placeholder="Select Cuisine" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Italian">Italian</SelectItem>
                      <SelectItem value="Chinese">Chinese</SelectItem>
                      <SelectItem value="Indian">Indian</SelectItem>
                      <SelectItem value="Mexican">Mexican</SelectItem>
                      <SelectItem value="French">French</SelectItem>
                      <SelectItem value="Thai">Thai</SelectItem>
                      <SelectItem value="Japanese">Japanese</SelectItem>
                      <SelectItem value="American">American</SelectItem>
                      <SelectItem value="Asian">Asian</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="prepTimeMinutes">
                    Prep Time (minutes) <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    type="number"
                    id="prepTimeMinutes"
                    name="prepTimeMinutes"
                    value={formData.prepTimeMinutes}
                    onChange={handleChange}
                    required
                    min="1"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="difficulty">
                    Difficulty <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.difficulty}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, difficulty: value }))}
                  >
                    <SelectTrigger id="difficulty">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Easy">Easy</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isVegetarian"
                  name="isVegetarian"
                  checked={formData.isVegetarian}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="isVegetarian" className="cursor-pointer">
                  Vegetarian Recipe
                </Label>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold">
                Ingredients <span className="text-destructive">*</span>
              </h2>
              {formData.ingredients.map((ingredient, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={ingredient}
                    onChange={(e) => handleIngredientChange(index, e.target.value)}
                    placeholder={`Ingredient ${index + 1}`}
                    required={index === 0}
                    className="flex-1"
                  />
                  {formData.ingredients.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeIngredient(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button type="button" variant="outline" onClick={addIngredient}>
                <Plus className="mr-2 h-4 w-4" />
                Add Ingredient
              </Button>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold">
                Instructions <span className="text-destructive">*</span>
              </h2>
              {formData.instructions.map((instruction, index) => (
                <div key={index} className="space-y-2">
                  <Label>Step {index + 1}</Label>
                  <div className="flex gap-2">
                    <Textarea
                      value={instruction}
                      onChange={(e) => handleInstructionChange(index, e.target.value)}
                      placeholder={`Describe step ${index + 1}...`}
                      rows="3"
                      required={index === 0}
                      className="flex-1"
                    />
                    {formData.instructions.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeInstruction(index)}
                        className="self-start"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={addInstruction}>
                <Plus className="mr-2 h-4 w-4" />
                Add Step
              </Button>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Tags (Optional)</h2>
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  placeholder="Enter a tag and press Enter"
                  className="flex-1"
                />
                <Button type="button" variant="outline" onClick={handleAddTag}>
                  Add Tag
                </Button>
              </div>
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="gap-2">
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t-2 border-border">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Create Recipe'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecipeForm;


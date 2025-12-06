import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { recipeAPI } from '../services/api';
import SearchFilters from './SearchFilters';
import AISearchAssistant from './AISearchAssistant';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Badge } from './ui/badge';
import { Loader2 } from 'lucide-react';

const RecipeList = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [availableTags, setAvailableTags] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    cuisine: '',
    isVegetarian: '',
    maxPrepTime: '',
    difficulty: '',
    ingredient: '',
    tags: []
  });
  const debounceTimerRef = useRef(null);

  useEffect(() => {
    const loadRecipes = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const activeFilters = {};
        Object.keys(filters).forEach(key => {
          if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
            if (Array.isArray(filters[key]) && filters[key].length === 0) {
              return;
            }
            activeFilters[key] = filters[key];
          }
        });

        const response = await recipeAPI.getAll(activeFilters);
        
        if (response) {
          if (response.success === false) {
            setRecipes([]);
            setError(response.error || 'Unable to load recipes. Please try again.');
          } else {
            const recipeList = response.data && Array.isArray(response.data) 
              ? response.data 
              : Array.isArray(response) 
                ? response 
                : [];
            
            setRecipes(recipeList);
            
            const allTags = new Set();
            recipeList.forEach(recipe => {
              if (recipe.tags && Array.isArray(recipe.tags)) {
                recipe.tags.forEach(tag => allTags.add(tag));
              }
            });
            setAvailableTags(Array.from(allTags).sort());
          }
        } else {
          setRecipes([]);
        }
      } catch (err) {
        const errorMessage = err.message || err.response?.data?.error || 'Unable to load recipes. Please try again.';
        setError(errorMessage);
        setRecipes([]);
      } finally {
        setLoading(false);
      }
    };

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(loadRecipes, 500);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      cuisine: '',
      isVegetarian: '',
      maxPrepTime: '',
      difficulty: '',
      ingredient: '',
      tags: []
    });
  };

  if (loading && recipes.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-muted-foreground">Loading recipes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Recipes</h1>
        <p className="text-muted-foreground">
          Discover recipes from around the world
        </p>
      </div>

      <SearchFilters 
        filters={filters} 
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        availableTags={availableTags}
      />
      
      <AISearchAssistant 
        onSearchResults={setFilters}
        currentFilters={filters}
      />

      {error && (
        <Card className="mb-6 border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : recipes.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">
              No recipes found. {Object.values(filters).some(v => v && (!Array.isArray(v) || v.length > 0)) ? 'Try adjusting your filters.' : 'Add a new recipe to get started!'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recipes.map(recipe => (
            <RecipeCard key={recipe._id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  );
};

const RecipeCard = ({ recipe }) => {
  return (
    <Link to={`/recipe/${recipe._id}`}>
      <Card className="h-full hover:shadow-md transition-shadow">
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-lg">{recipe.name}</CardTitle>
            <Badge variant={recipe.isVegetarian ? "default" : "secondary"}>
              {recipe.isVegetarian ? 'Veg' : 'Non-Veg'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription className="mb-4">
            <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
              <span>{recipe.cuisine}</span>
              <span>•</span>
              <span>{recipe.prepTimeMinutes} min</span>
              <span>•</span>
              <span>{recipe.difficulty}</span>
            </div>
          </CardDescription>
          
          {recipe.tags && recipe.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {recipe.tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
};

export default RecipeList;


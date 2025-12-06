import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { recipeAPI } from "../services/api";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Loader2, Grid3x3, LayoutGrid, List, RefreshCw } from "lucide-react";
import { cn } from "../lib/utils";

const BrowsePage = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedCuisine, setSelectedCuisine] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");

  useEffect(() => {
    loadRecipes();
  }, []);

  const loadRecipes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await recipeAPI.getAll({});

      if (response) {
        if (response.success === false) {
          setRecipes([]);
          setError(
            response.error || "Unable to load recipes. Please try again."
          );
        } else {
          const recipeList =
            response.data && Array.isArray(response.data)
              ? response.data
              : Array.isArray(response)
              ? response
              : [];
          setRecipes(recipeList);
        }
      } else {
        setRecipes([]);
      }
    } catch (err) {
      setError(err.message || "Unable to load recipes. Please try again.");
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  const cuisines = [
    "all",
    ...new Set(recipes.map((r) => r.cuisine).filter(Boolean)),
  ];
  const difficulties = ["all", "Easy", "Medium", "Hard"];

  const filteredAndSortedRecipes = recipes
    .filter((recipe) => {
      const cuisineMatch =
        selectedCuisine === "all" || recipe.cuisine === selectedCuisine;
      const difficultyMatch =
        selectedDifficulty === "all" ||
        recipe.difficulty === selectedDifficulty;
      return cuisineMatch && difficultyMatch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "prepTime":
          return a.prepTimeMinutes - b.prepTimeMinutes;
        case "difficulty":
          const difficultyOrder = { Easy: 1, Medium: 2, Hard: 3 };
          return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
        case "newest":
        default:
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      }
    });

  const getDifficultyVariant = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "default";
      case "Medium":
        return "secondary";
      case "Hard":
        return "destructive";
      default:
        return "outline";
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-muted-foreground">Loading recipes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-20">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="pt-6 text-center space-y-4">
            <p className="text-destructive">{error}</p>
            <Button onClick={loadRecipes}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Recipes</h1>
        <p className="text-muted-foreground">
          Discover {filteredAndSortedRecipes.length} recipes from around the
          world
        </p>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">View:</span>
              <div className="flex border-2 border-border rounded-md">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-r-none"
                >
                  <Grid3x3 className="h-4 w-4 mr-1" />
                  Grid
                </Button>
                <Button
                  variant={viewMode === "masonry" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("masonry")}
                  className="rounded-none border-x-2 border-border"
                >
                  <LayoutGrid className="h-4 w-4 mr-1" />
                  Masonry
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4 mr-1" />
                  List
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Sort by:</span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="name">Name A-Z</SelectItem>
                  <SelectItem value="prepTime">Prep Time</SelectItem>
                  <SelectItem value="difficulty">Difficulty</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Cuisine:</span>
              <Select
                value={selectedCuisine}
                onValueChange={setSelectedCuisine}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {cuisines.map((cuisine) => (
                    <SelectItem key={cuisine} value={cuisine}>
                      {cuisine === "all" ? "All Cuisines" : cuisine}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Difficulty:</span>
              <Select
                value={selectedDifficulty}
                onValueChange={setSelectedDifficulty}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {difficulties.map((difficulty) => (
                    <SelectItem key={difficulty} value={difficulty}>
                      {difficulty === "all" ? "All Levels" : difficulty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {filteredAndSortedRecipes.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center space-y-4">
            <p className="text-muted-foreground">
              No recipes found matching your filters.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedCuisine("all");
                setSelectedDifficulty("all");
              }}
            >
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div
          className={cn(
            "grid gap-4",
            viewMode === "grid" && "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
            viewMode === "masonry" && "columns-1 md:columns-2 lg:columns-3",
            viewMode === "list" && "grid-cols-1"
          )}
        >
          {filteredAndSortedRecipes.map((recipe) => (
            <RecipeBrowseCard
              key={recipe._id}
              recipe={recipe}
              viewMode={viewMode}
              getDifficultyVariant={getDifficultyVariant}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const RecipeBrowseCard = ({ recipe, viewMode, getDifficultyVariant }) => {
  if (viewMode === "list") {
    return (
      <Link to={`/recipe/${recipe._id}`}>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-2">
                <h3 className="text-xl font-bold">{recipe.name}</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">{recipe.cuisine}</Badge>
                  <Badge variant="outline">{recipe.prepTimeMinutes} min</Badge>
                  <Badge variant={getDifficultyVariant(recipe.difficulty)}>
                    {recipe.difficulty}
                  </Badge>
                  {recipe.isVegetarian && (
                    <Badge variant="default">Vegetarian</Badge>
                  )}
                </div>
              </div>
              <div className="text-sm text-muted-foreground space-y-2">
                {recipe.ingredients && recipe.ingredients.length > 0 && (
                  <div>
                    <strong>Ingredients:</strong>{" "}
                    {recipe.ingredients.slice(0, 5).join(", ")}
                    {recipe.ingredients.length > 5 && "..."}
                  </div>
                )}
                {recipe.tags && recipe.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {recipe.tags.slice(0, 4).map((tag, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  }

  return (
    <Link
      to={`/recipe/${recipe._id}`}
      className={viewMode === "masonry" ? "break-inside-avoid mb-4" : ""}
    >
      <Card className="h-full hover:shadow-md transition-shadow">
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-lg">{recipe.name}</CardTitle>
            <div className="flex gap-2">
              {recipe.isVegetarian && <Badge variant="default">Veg</Badge>}
              <Badge variant={getDifficultyVariant(recipe.difficulty)}>
                {recipe.difficulty}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-muted-foreground mb-4">
            <div>{recipe.cuisine}</div>
            <div>{recipe.prepTimeMinutes} min</div>
            <div>{recipe.ingredients?.length || 0} ingredients</div>
          </div>

          {recipe.tags && recipe.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {recipe.tags.slice(0, 3).map((tag, idx) => (
                <Badge key={idx} variant="outline" className="text-xs">
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

export default BrowsePage;


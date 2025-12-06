import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { recipeAPI, aiAPI } from "../services/api";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Loader2, ArrowLeft, ChefHat } from "lucide-react";

const RecipeDetailPage = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [aiError, setAiError] = useState(null);
  const [showAiSection, setShowAiSection] = useState(false);
  const [aiMode, setAiMode] = useState("simplify");

  useEffect(() => {
    fetchRecipe();
  }, [id]);

  const fetchRecipe = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await recipeAPI.getById(id);
      setRecipe(response.data);
    } catch (err) {
      setError(err.response?.data?.error || "Unable to load recipe details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSimplifyInstructions = async () => {
    if (!recipe) return;
    try {
      setAiLoading(true);
      setAiError(null);
      setAiResult(null);
      setShowAiSection(true);
      setAiMode("simplify");
      const response = await aiAPI.simplifyInstructions(null, recipe._id);
      setAiResult(response.data);
    } catch (err) {
      setAiError(err.response?.data?.error || "Unable to simplify instructions at this time. Please try again.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleGetSuggestion = async () => {
    if (!recipe) return;
    try {
      setAiLoading(true);
      setAiError(null);
      setAiResult(null);
      setShowAiSection(true);
      setAiMode("suggest");
      const response = await aiAPI.suggestRecipe(recipe.ingredients);
      setAiResult(response.data);
    } catch (err) {
      setAiError(err.response?.data?.error || "Unable to get recipe suggestion. Please try again.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleGetCookingTips = async () => {
    if (!recipe) return;
    try {
      setAiLoading(true);
      setAiError(null);
      setAiResult(null);
      setShowAiSection(true);
      setAiMode("tips");
      const response = await aiAPI.getCookingTips(recipe._id);
      setAiResult(response.data);
    } catch (err) {
      setAiError(err.response?.data?.error || "Unable to load cooking tips. Please try again.");
    } finally {
      setAiLoading(false);
    }
  };

  if (loading && !recipe) {
    return (
      <div className="container mx-auto px-4 py-20 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-muted-foreground">Loading recipe details...</p>
        </div>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="container mx-auto px-4 py-20">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="pt-6 text-center space-y-4">
            <p className="text-destructive">{error || "Recipe not found"}</p>
            <Button asChild>
              <Link to="/">Back to Recipes</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-5xl">
      <Button variant="ghost" asChild className="mb-6">
        <Link to="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex-1">
              <CardTitle className="text-3xl mb-4">{recipe.name}</CardTitle>
              <div className="flex flex-wrap gap-2">
                <Badge variant={recipe.isVegetarian ? "default" : "secondary"}>
                  {recipe.isVegetarian ? "Vegetarian" : "Non-Vegetarian"}
                </Badge>
                <Badge variant="outline">{recipe.cuisine}</Badge>
                <Badge variant="outline">{recipe.difficulty}</Badge>
                <Badge variant="outline">{recipe.prepTimeMinutes} min</Badge>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {recipe.tags && recipe.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {recipe.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          <div className="space-y-6">
            <section>
              <h2 className="text-2xl font-bold mb-4">Ingredients</h2>
              <ul className="space-y-2 list-disc list-inside ml-2">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="text-muted-foreground">
                    {ingredient}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Instructions</h2>
              <ol className="space-y-3 list-decimal list-inside ml-2">
                {recipe.instructions.map((instruction, index) => (
                  <li key={index} className="text-muted-foreground">
                    {instruction}
                  </li>
                ))}
              </ol>
            </section>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ChefHat className="h-5 w-5" />
                Cooking Helper
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3 flex-wrap">
                <Button
                  onClick={handleGetCookingTips}
                  disabled={aiLoading}
                  variant="default"
                  className="bg-primary hover:bg-primary/90"
                >
                  {aiLoading && aiMode === "tips" ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Getting Tips...
                    </>
                  ) : (
                    <>
                      <ChefHat className="mr-2 h-4 w-4" />
                      Get Cooking Tips
                    </>
                  )}
                </Button>
                <Button
                  onClick={handleSimplifyInstructions}
                  disabled={aiLoading}
                  variant="outline"
                >
                  {aiLoading && aiMode === "simplify" ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Simplify Instructions"
                  )}
                </Button>
                <Button
                  onClick={handleGetSuggestion}
                  disabled={aiLoading}
                  variant="outline"
                >
                  {aiLoading && aiMode === "suggest" ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Get Recipe Suggestion"
                  )}
                </Button>
              </div>

              {showAiSection && (
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  {aiLoading ? (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Processing with AI...
                    </div>
                  ) : aiError ? (
                    <div className="text-destructive space-y-2">
                      <p>{aiError}</p>
                      {aiResult?.fallback && (
                        <div className="mt-4 p-3 bg-background rounded-md">
                          <h4 className="font-semibold mb-2">Fallback:</h4>
                          <p className="text-sm">{aiResult.fallback}</p>
                        </div>
                      )}
                    </div>
                  ) : aiResult ? (
                    <div className="space-y-4">
                      {aiMode === "tips" ? (
                        <div className="space-y-4">
                          <div className="flex items-center gap-2">
                            <ChefHat className="h-5 w-5 text-primary" />
                            <h3 className="text-lg font-semibold">Cooking Tips & Preparation Guide</h3>
                          </div>
                          <div className="text-sm text-foreground whitespace-pre-wrap bg-background p-4 rounded-lg border">
                            {aiResult.tips ||
                              aiResult.fallback ||
                              "No cooking tips available."}
                          </div>
                        </div>
                      ) : aiMode === "simplify" ? (
                        <div>
                          <h3 className="font-semibold mb-2">Simplified Instructions:</h3>
                          <div className="text-sm text-muted-foreground whitespace-pre-wrap">
                            {aiResult.simplified ||
                              aiResult.fallback ||
                              "No simplified version available."}
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold mb-3">Recipe Suggestion:</h3>
                          <div className="text-sm text-foreground whitespace-pre-wrap bg-background p-6 rounded-lg border-2 border-border space-y-3 leading-relaxed">
                            {aiResult.suggestion ||
                              aiResult.fallback ||
                              "No suggestion available."}
                          </div>
                          {aiResult.ingredients && (
                            <div className="mt-4 p-3 bg-muted rounded-md text-sm">
                              <strong className="text-foreground">Based on ingredients:</strong>{" "}
                              <span className="text-muted-foreground">{aiResult.ingredients.join(", ")}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ) : null}
                </div>
              )}
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecipeDetailPage;


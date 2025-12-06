import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

const SearchFilters = ({
  filters,
  onFilterChange,
  onClearFilters,
  availableTags = [],
}) => {
  const handleChange = (field, value) => {
    onFilterChange({
      ...filters,
      [field]: value,
    });
  };

  const handleTagToggle = (tag) => {
    const currentTags = Array.isArray(filters.tags)
      ? filters.tags
      : filters.tags
      ? [filters.tags]
      : [];
    const newTags = currentTags.includes(tag)
      ? currentTags.filter((t) => t !== tag)
      : [...currentTags, tag];

    onFilterChange({
      ...filters,
      tags: newTags.length > 0 ? newTags : "",
    });
  };

  const hasActiveFilters = Object.values(filters).some((value) => {
    if (Array.isArray(value)) {
      return value.length > 0;
    }
    return value !== "";
  });

  const selectedTags = Array.isArray(filters.tags)
    ? filters.tags
    : filters.tags
    ? [filters.tags]
    : [];

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Search & Filter</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="search">Search</Label>
            <Input
              id="search"
              placeholder="Search recipes..."
              value={filters.search || ""}
              onChange={(e) => handleChange("search", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cuisine">Cuisine</Label>
            <Select
              value={filters.cuisine || "all"}
              onValueChange={(value) => handleChange("cuisine", value === "all" ? "" : value)}
            >
              <SelectTrigger id="cuisine">
                <SelectValue placeholder="All Cuisines" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cuisines</SelectItem>
                <SelectItem value="Italian">Italian</SelectItem>
                <SelectItem value="Asian">Asian</SelectItem>
                <SelectItem value="Indian">Indian</SelectItem>
                <SelectItem value="American">American</SelectItem>
                <SelectItem value="Mexican">Mexican</SelectItem>
                <SelectItem value="French">French</SelectItem>
                <SelectItem value="Chinese">Chinese</SelectItem>
                <SelectItem value="Thai">Thai</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="isVegetarian">Diet Type</Label>
            <Select
              value={filters.isVegetarian || "all"}
              onValueChange={(value) => handleChange("isVegetarian", value === "all" ? "" : value)}
            >
              <SelectTrigger id="isVegetarian">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="true">Vegetarian</SelectItem>
                <SelectItem value="false">Non-Vegetarian</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxPrepTime">Max Prep Time (minutes)</Label>
            <Input
              type="number"
              id="maxPrepTime"
              placeholder="30"
              min="1"
              value={filters.maxPrepTime || ""}
              onChange={(e) => handleChange("maxPrepTime", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="difficulty">Difficulty</Label>
            <Select
              value={filters.difficulty || "all"}
              onValueChange={(value) => handleChange("difficulty", value === "all" ? "" : value)}
            >
              <SelectTrigger id="difficulty">
                <SelectValue placeholder="All Levels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="Easy">Easy</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ingredient">Ingredient</Label>
            <Input
              type="text"
              id="ingredient"
              placeholder="Search by ingredient..."
              value={filters.ingredient || ""}
              onChange={(e) => handleChange("ingredient", e.target.value)}
            />
          </div>

          {availableTags.length > 0 && (
            <div className="space-y-2 md:col-span-2 lg:col-span-3">
              <Label>Tags</Label>
              <div className="flex flex-wrap gap-2 rounded-md border-2 border-border p-4">
                {availableTags.slice(0, 12).map((tag, index) => (
                  <Badge
                    key={index}
                    variant={selectedTags.includes(tag) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => handleTagToggle(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {hasActiveFilters && (
          <div className="mt-6 flex justify-end border-t-2 border-border pt-4">
            <Button variant="outline" onClick={onClearFilters}>
              Clear Filters
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SearchFilters;


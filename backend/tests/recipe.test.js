const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const Recipe = require('../models/Recipe');
const routes = require('../config/routes');

describe('Recipe API Tests', () => {
  const sampleRecipe = {
    name: 'Test Pasta',
    cuisine: 'Italian',
    isVegetarian: true,
    prepTimeMinutes: 30,
    ingredients: ['pasta', 'tomato', 'garlic', 'olive oil'],
    difficulty: 'Easy',
    instructions: [
      'Boil water in a large pot',
      'Add pasta and cook until al dente',
      'Heat olive oil in a pan',
      'Add garlic and tomatoes',
      'Mix with pasta and serve'
    ],
    tags: ['quick', 'dinner', 'vegetarian']
  };

  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      const mongoURI = process.env.MONGODB_URI || process.env.MONGODB_TEST_URI;
      if (!mongoURI) {
        throw new Error('MONGODB_URI or MONGODB_TEST_URI environment variable is required for tests');
      }
      await mongoose.connect(mongoURI);
    }
  });

  afterAll(async () => {
    await Recipe.deleteMany({});
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await Recipe.deleteMany({});
  });

  describe('POST /api/recipes', () => {
    it('should create a new recipe', async () => {
      const response = await request(app)
        .post(routes.recipes)
        .send(sampleRecipe)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(sampleRecipe.name);
      expect(response.body.data.cuisine).toBe(sampleRecipe.cuisine);
    });

    it('should return validation error for missing required fields', async () => {
      const response = await request(app)
        .post(routes.recipes)
        .send({ name: 'Incomplete Recipe' })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/recipes', () => {
    it('should get all recipes', async () => {
      await Recipe.create(sampleRecipe);
      
      const response = await request(app)
        .get(routes.recipes)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(1);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should filter recipes by cuisine', async () => {
      await Recipe.create(sampleRecipe);
      await Recipe.create({ ...sampleRecipe, name: 'French Bread', cuisine: 'French' });

      const response = await request(app)
        .get(`${routes.recipes}?cuisine=Italian`)
        .expect(200);

      expect(response.body.count).toBe(1);
      expect(response.body.data[0].cuisine).toBe('Italian');
    });

    it('should filter recipes by vegetarian status', async () => {
      await Recipe.create(sampleRecipe);
      await Recipe.create({ ...sampleRecipe, name: 'Beef Steak', isVegetarian: false });

      const response = await request(app)
        .get(`${routes.recipes}?isVegetarian=true`)
        .expect(200);

      expect(response.body.count).toBe(1);
      expect(response.body.data[0].isVegetarian).toBe(true);
    });

    it('should filter recipes by preparation time', async () => {
      await Recipe.create(sampleRecipe);
      await Recipe.create({ ...sampleRecipe, name: 'Quick Salad', prepTimeMinutes: 10 });

      const response = await request(app)
        .get(`${routes.recipes}?maxPrepTime=20`)
        .expect(200);

      expect(response.body.count).toBe(1);
      expect(response.body.data[0].prepTimeMinutes).toBeLessThanOrEqual(20);
    });

    it('should search recipes by ingredient', async () => {
      await Recipe.create(sampleRecipe);

      const response = await request(app)
        .get(`${routes.recipes}?ingredient=tomato`)
        .expect(200);

      expect(response.body.count).toBe(1);
      expect(response.body.data[0].ingredients).toContain('tomato');
    });
  });

  describe('GET /api/recipes/:id', () => {
    it('should get a recipe by ID', async () => {
      const recipe = await Recipe.create(sampleRecipe);

      const response = await request(app)
        .get(`${routes.recipes}/${recipe._id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(sampleRecipe.name);
    });

    it('should return 404 for non-existent recipe', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .get(`${routes.recipes}/${fakeId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/recipes/:id', () => {
    it('should update a recipe', async () => {
      const recipe = await Recipe.create(sampleRecipe);

      const response = await request(app)
        .put(`${routes.recipes}/${recipe._id}`)
        .send({ name: 'Updated Pasta' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe('Updated Pasta');
    });
  });

  describe('DELETE /api/recipes/:id', () => {
    it('should delete a recipe', async () => {
      const recipe = await Recipe.create(sampleRecipe);

      const response = await request(app)
        .delete(`${routes.recipes}/${recipe._id}`)
        .expect(200);

      expect(response.body.success).toBe(true);

      const deletedRecipe = await Recipe.findById(recipe._id);
      expect(deletedRecipe).toBeNull();
    });
  });
});

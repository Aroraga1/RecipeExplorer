const request = require("supertest");
const app = require("../server");
const routes = require("../config/routes");

describe("AI API Tests", () => {
  describe("POST /api/ai/suggest", () => {
    it("should return error if ingredients are not provided", async () => {
      const response = await request(app)
        .post(`${routes.ai}/suggest`)
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });

    it("should accept ingredients and return response structure", async () => {
      const response = await request(app)
        .post(`${routes.ai}/suggest`)
        .send({ ingredients: ["tomato", "onion", "garlic"] })
        .expect(200);

      expect(response.body).toHaveProperty("success");
      expect(response.body).toHaveProperty("data");
      expect(response.body).toHaveProperty("timestamp");
    });
  });

  describe("POST /api/ai/simplify", () => {
    it("should return error if instructions and recipeId are not provided", async () => {
      const response = await request(app)
        .post(`${routes.ai}/simplify`)
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });

    it("should accept instructions and return response structure", async () => {
      const response = await request(app)
        .post(`${routes.ai}/simplify`)
        .send({
          instructions: [
            "First, prepare all ingredients",
            "Then, heat the pan",
            "Finally, cook and serve",
          ],
        })
        .expect(200);

      expect(response.body).toHaveProperty("success");
      expect(response.body).toHaveProperty("data");
      expect(response.body).toHaveProperty("timestamp");
    });
  });
});

const express = require("express");
const router = express.Router();
const aiController = require("../controllers/aiController");

router.post("/suggest", aiController.suggestRecipe);
router.post("/simplify", aiController.simplifyInstructions);
router.post("/cooking-tips", aiController.getCookingTips);

module.exports = router;

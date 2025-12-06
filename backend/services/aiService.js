const { GoogleGenerativeAI } = require("@google/generative-ai");

const API_KEY = process.env.GEMINI_API_KEY;

let genAI = null;
if (API_KEY) {
  genAI = new GoogleGenerativeAI(API_KEY);
}

function sanitizeErrorMessage(error) {
  let errorMessage = error.message || String(error);
  let logMessage = errorMessage;

  if (API_KEY) {
    logMessage = errorMessage.replace(
      new RegExp(API_KEY, "g"),
      "[API_KEY_REDACTED]"
    );

    if (API_KEY.length > 10) {
      const keyStart = API_KEY.substring(0, 5);
      const keyEnd = API_KEY.substring(API_KEY.length - 5);
      logMessage = logMessage.replace(new RegExp(keyStart, "g"), "[REDACTED]");
      logMessage = logMessage.replace(new RegExp(keyEnd, "g"), "[REDACTED]");
    }
  }

  const sensitivePatterns = [
    /api[_-]?key["\s:=]+[a-zA-Z0-9_-]{20,}/gi,
    /auth[_-]?token["\s:=]+[a-zA-Z0-9_-]{20,}/gi,
    /bearer\s+[a-zA-Z0-9_-]{20,}/gi,
  ];

  sensitivePatterns.forEach((pattern) => {
    logMessage = logMessage.replace(pattern, "[SENSITIVE_DATA_REDACTED]");
  });

  return {
    originalMessage: errorMessage,
    logMessage: logMessage,
    safeMessage: errorMessage.includes("API key")
      ? "API authentication error"
      : "An error occurred while processing the request",
  };
}

exports.suggestRecipeFromIngredients = async (ingredients) => {
  try {
    if (!API_KEY) {
      throw new Error(
        "Gemini API key is not configured. Please set GEMINI_API_KEY in your .env file"
      );
    }

    if (!genAI) {
      genAI = new GoogleGenerativeAI(API_KEY);
    }

    const ingredientList = Array.isArray(ingredients)
      ? ingredients.join(", ")
      : ingredients;

    let model;
    try {
      model = genAI.getGenerativeModel({ model: "gemini-pro" });
    } catch (modelError) {
      try {
        model = genAI.getGenerativeModel({ model: "models/gemini-pro" });
      } catch (modelError2) {
        model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
      }
    }

    const prompt = `You are a good cook who helps people make food. Use very simple words. Use words that a child can understand. No big words. No fancy words.

The user has these things: ${ingredientList}

Tell them how to make a good meal with these things. Use very simple words.

Write it like this:

Recipe Name: [A good name for the dish]

Description: [Tell what the dish is. Keep it short. Use simple words.]

Prep Time: [How many minutes to get things ready]
Cook Time: [How many minutes to cook]
How Hard: [Easy/Medium/Hard]
How Many People: [How many people can eat this]

Things You Need:
[List all things you need. Say how much of each thing.]

How to Make It (Simple Way):
1. [Step one - tell them what to do. Use simple words.]
2. [Step two - tell them what to do next.]
3. [Keep going with more steps. Use simple words only.]

How to Make It Simple (Easy Tips):
- [Tell them one easy way to make this recipe simpler. Maybe skip a step or use an easier method.]
- [Tell them another way to make it easier. Maybe use ready-made things or shortcuts.]
- [Tell them how to save time or make less mess.]
- [Tell them what they can do ahead of time to make cooking faster.]

How to Make It More Creative and Tasty (Add More Flavor):
- [Tell them what extra ingredient they can add to make it taste better. Say why it helps.]
- [Tell them another ingredient they can add for more flavor or texture.]
- [Tell them a special way to cook or season that makes it taste amazing.]
- [Tell them what spices or herbs they can add to make it more interesting.]
- [Tell them a creative twist or variation they can try.]
- [Tell them how to make it look nicer or more fancy.]

Good Tips:
- [One tip that helps. Use simple words.]
- [Another tip that helps.]
- [If they don't have something, what can they use instead?]

Don't Do This:
- [One mistake people make. How to not do it.]
- [Another mistake. How to not do it.]

What to Eat With It:
[What else to serve with this food. Keep it simple.]

Remember: Use only simple words. No big words. Write like you are talking to a child. Make it easy to understand. Give real, practical advice that actually works.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let generatedText = response.text();

    generatedText = generatedText.replace(/\*\*/g, "").trim();

    return {
      success: true,
      suggestion: generatedText,
      ingredients: Array.isArray(ingredients) ? ingredients : [ingredients],
      enhanced: true,
    };
  } catch (error) {
    const sanitizedError = sanitizeErrorMessage(error);

    console.error("AI Service Error:", sanitizedError.logMessage);

    if (
      error.message?.includes("API key") ||
      error.message?.includes("API_KEY")
    ) {
      return {
        success: false,
        error:
          "Invalid or missing Gemini API key. Please check your GEMINI_API_KEY in .env file",
        fallback: generateFallbackSuggestion(ingredients),
      };
    }

    if (
      error.message?.includes("quota") ||
      error.message?.includes("rate limit")
    ) {
      return {
        success: false,
        error: "API rate limit exceeded. Please try again later.",
        fallback: generateFallbackSuggestion(ingredients),
      };
    }

    return {
      success: false,
      error:
        sanitizedError.safeMessage || "Failed to generate recipe suggestion",
      fallback: generateFallbackSuggestion(ingredients),
    };
  }
};

exports.simplifyInstructions = async (instructions) => {
  try {
    if (!API_KEY) {
      throw new Error(
        "Gemini API key is not configured. Please set GEMINI_API_KEY in your .env file"
      );
    }

    if (!genAI) {
      genAI = new GoogleGenerativeAI(API_KEY);
    }

    const instructionText = Array.isArray(instructions)
      ? instructions.join("\n")
      : instructions;

    let model;
    try {
      model = genAI.getGenerativeModel({ model: "gemini-pro" });
    } catch (modelError) {
      try {
        model = genAI.getGenerativeModel({ model: "models/gemini-pro" });
      } catch (modelError2) {
        model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
      }
    }

    const prompt = `Make these cooking steps very easy to read. Use very simple words. Use words a child can understand. No big words. No fancy words.

Here are the original steps:
${instructionText}

Make new steps that:
- Use only simple words
- Break big steps into small steps
- Add helpful tips where needed
- Number each step clearly
- Are easy to follow

Write the new simple steps here:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let simplifiedText = response.text();

    simplifiedText = simplifiedText.replace(/\*\*/g, "").trim();

    return {
      success: true,
      original: instructions,
      simplified: simplifiedText,
    };
  } catch (error) {
    const sanitizedError = sanitizeErrorMessage(error);

    console.error("AI Service Error:", sanitizedError.logMessage);

    if (
      error.message?.includes("API key") ||
      error.message?.includes("API_KEY")
    ) {
      return {
        success: false,
        error:
          "Invalid or missing Gemini API key. Please check your GEMINI_API_KEY in .env file",
        fallback: generateFallbackSimplification(instructions),
      };
    }

    if (
      error.message?.includes("quota") ||
      error.message?.includes("rate limit")
    ) {
      return {
        success: false,
        error: "API rate limit exceeded. Please try again later.",
        fallback: generateFallbackSimplification(instructions),
      };
    }

    return {
      success: false,
      error: sanitizedError.safeMessage || "Failed to simplify instructions",
      fallback: generateFallbackSimplification(instructions),
    };
  }
};

function generateFallbackSuggestion(ingredients) {
  const ingredientList = Array.isArray(ingredients)
    ? ingredients.join(", ")
    : ingredients;
  return `You have these things: ${ingredientList}

Here is a simple way to cook with them:

1. Get all your things ready
2. Cut and mix them together
3. Cook them how you like
4. Add salt and spices if you want, then eat!

Tip: Look in our recipe list to find more ways to use these things.`;
}

exports.getCookingTips = async (recipe) => {
  try {
    if (!API_KEY) {
      throw new Error(
        "Gemini API key is not configured. Please set GEMINI_API_KEY in your .env file"
      );
    }

    if (!genAI) {
      genAI = new GoogleGenerativeAI(API_KEY);
    }

    if (!recipe) {
      throw new Error("Recipe information is required");
    }

    let model;
    try {
      model = genAI.getGenerativeModel({ model: "gemini-pro" });
    } catch (modelError) {
      try {
        model = genAI.getGenerativeModel({ model: "models/gemini-pro" });
      } catch (modelError2) {
        model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
      }
    }

    const recipeInfo = `
Recipe Name: ${recipe.name || "Unknown"}
Cuisine: ${recipe.cuisine || "Not specified"}
Ingredients: ${
      Array.isArray(recipe.ingredients)
        ? recipe.ingredients.join(", ")
        : recipe.ingredients || "Not specified"
    }
Instructions: ${
      Array.isArray(recipe.instructions)
        ? recipe.instructions
            .map((inst, idx) => `Step ${idx + 1}: ${inst}`)
            .join("\n")
        : recipe.instructions || "Not specified"
    }
Prep Time: ${
      recipe.prepTimeMinutes || recipe.prepTime || "Not specified"
    } minutes
Difficulty: ${recipe.difficulty || "Not specified"}
`;

    const prompt = `You are a friendly cooking helper who talks like a friend in the kitchen. Use very simple words. Write like you're helping someone cook for the first time. No big words. No fancy words. Be encouraging and helpful.

Recipe Info:
${recipeInfo}

Give them real, practical help to cook this recipe well. Write it like this:

Before You Start - Getting Ready:
- [Tell them step by step how to prepare. What to do first, second, third. Use simple words.]
- [What tools they need - list them simply. Like: "You need a big pot" or "A knife will help".]
- [How much time they need. Break it down simply. Like: "It takes about 30 minutes total"]
- [What they can do ahead of time to make cooking easier. Simple words only.]

How to Cook This Recipe - Step by Step Guide:
For this recipe, walk them through it like you're standing next to them:

Go through each step from the recipe and tell them:
- What they should see at each step (colors, how it should look, smells)
- How they will know when each step is done
- What temperature or heat to use - explain it simply
- How long each step takes - be clear about timing
- What to watch for - warning signs that something needs attention
- If something looks wrong, what to do about it
- How to make each step work better

Write it friendly, like you're explaining to a friend. Use simple words only.

Tips for Each Ingredient:
- [For each main ingredient, tell them how to handle it. Simple advice.]
- [How to cut or prepare each food - simple steps.]
- [If they don't have an ingredient, what can they use instead? Give real options.]
- [Which ingredients are most important - tell them simply.]

Making It Taste Good - Flavor Tips:
- [How to season this recipe - what spices work well and when to add them.]
- [How much salt or spices to use - simple guidance.]
- [What makes this recipe taste great - the secret tips.]
- [How to taste and adjust as you cook.]

Common Mistakes People Make:
- [List real mistakes people make with this recipe. Use simple words.]
- [For each mistake, tell them how to avoid it - be clear and helpful.]
- [What to do if they already made the mistake - how to fix it.]

Making It Look Nice:
- [How to serve it so it looks good. Simple tips.]
- [What to put on top - simple garnish ideas.]
- [What temperature to serve it at.]

If Things Go Wrong:
- [If it's too salty, what to do - simple fix.]
- [If it's too spicy, what to do - simple fix.]
- [If it's too dry, what to do - simple fix.]
- [If it's not cooked enough, what to do - simple fix.]
- [If it's overcooked, what to do - simple fix.]

Saving Leftovers:
- [How to keep leftovers good. Simple steps.]
- [How to heat it up later so it still tastes good.]
- [How long it stays good in the fridge.]
- [Other ways to use the leftovers - simple ideas.]

Final Tips:
- [One or two final encouraging tips. Be friendly.]
- [What makes this recipe special. Use simple words.]
- [Remind them that cooking takes practice and they're doing great.]

Remember: Write like you're a friend helping them cook. Use only simple words. Be encouraging. Make them feel confident. Give real, practical advice that actually works.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let generatedText = response.text();

    generatedText = generatedText.replace(/\*\*/g, "").trim();

    return {
      success: true,
      tips: generatedText,
      recipeName: recipe.name,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    const sanitizedError = sanitizeErrorMessage(error);

    console.error("AI Cooking Tips Error:", sanitizedError.logMessage);

    if (
      error.message?.includes("API key") ||
      error.message?.includes("API_KEY")
    ) {
      return {
        success: false,
        error:
          "Invalid or missing Gemini API key. Please check your GEMINI_API_KEY in .env file",
        fallback: generateFallbackCookingTips(recipe),
      };
    }

    if (
      error.message?.includes("quota") ||
      error.message?.includes("rate limit")
    ) {
      return {
        success: false,
        error: "API rate limit exceeded. Please try again later.",
        fallback: generateFallbackCookingTips(recipe),
      };
    }

    return {
      success: false,
      error: sanitizedError.safeMessage || "Failed to generate cooking tips",
      fallback: generateFallbackCookingTips(recipe),
    };
  }
};

function generateFallbackSimplification(instructions) {
  const steps = Array.isArray(instructions) ? instructions : [instructions];
  return steps.map((step, index) => `Step ${index + 1}: ${step}`).join("\n\n");
}

function generateFallbackCookingTips(recipe) {
  const recipeName = recipe?.name || "this recipe";
  return `Here are some simple cooking tips for ${recipeName}:

Before You Start:
- Read all the steps first
- Get all your food ready before you start
- Make sure you have all the tools you need

While Cooking:
- Follow the steps carefully
- Taste your food as you cook and add more spices if needed
- Take your time - good food takes time to make

Good Tips:
- Keep your cooking area clean
- Use good food for best results
- Trust yourself but watch the time

For more tips about this recipe, make sure the AI is working.`;
}

# Recipe Explorer

Hey there! This is my Recipe Explorer project. I built it because I wanted to make something that helps people discover and cook recipes easily. It's a full website where you can search recipes, add your own, and even get AI help with cooking tips!

## What This Does

Think of it like a smart recipe book. You can:
- Browse tons of recipes from different cuisines
- Search for recipes using simple words (like "quick vegetarian pasta")
- Filter recipes by how hard they are, cooking time, what's in them
- Get AI-powered cooking tips for any recipe
- Add, edit, and delete your own recipes
- See recipes in different ways (grid, list, or card view)

The cool part? I added AI that can give you helpful tips while you're cooking, suggest recipes based on what ingredients you have, and even simplify complicated recipe instructions so anyone can understand them.

## Why I Built It This Way

I wanted to learn how to build a complete web application from scratch. Here's my thinking:

**The Tech Stack:**
- I chose MongoDB because recipe data is flexible - some recipes have more ingredients, some have more steps. MongoDB lets me store that without forcing everything into the same shape.
- React for the frontend because it makes building interactive pages really smooth. Users can filter, search, and see updates instantly.
- Node.js with Express for the backend - it's simple, works great, and lots of people use it so finding help is easy.
- Google Gemini AI because it's free to start and gives really good results. Plus it understands simple language, which is perfect for helping people cook.

**Why Simple Language?**
When I started, I realized most recipe apps use fancy words that make people feel confused. I wanted my AI to talk like a friend - using simple words that anyone can understand. So when you ask for help, it talks to you like you're standing in the kitchen together, not like you're in a cooking school.

**The Design:**
I used shadcn/ui components because they look clean and professional without me having to write tons of custom CSS. The interface is simple on purpose - I want people to focus on cooking, not figuring out how to use the website.

## What You Need Before Starting

Before you can run this project, you need:

1. **Node.js** - This runs JavaScript code. Download it from [nodejs.org](https://nodejs.org/). Get version 14 or higher.
2. **MongoDB** - This is where recipes are stored. You can install it locally or use MongoDB Atlas (free cloud version).
3. **A Google Account** - For the Gemini API key (it's free to get started!)
4. **A code editor** - I use VS Code, but any editor works.

## How to Get It Running

### Step 1: Get the Code

First, download or clone this project to your computer. If you have Git installed:

```bash
git clone <the-repository-url>
cd RecipeExplorer
```

Or just download the ZIP file and extract it somewhere.

### Step 2: Set Up the Backend

The backend is the part that handles saving recipes, searching, and talking to the AI.

1. Open a terminal (or command prompt on Windows) and go to the backend folder:

```bash
cd backend
```

2. Install all the packages it needs:

```bash
npm install
```

This might take a minute. It's downloading all the tools the backend needs to work.

3. Create a `.env` file in the backend folder. This file stores your secret keys (don't worry, it won't be shared with anyone).

Create a new file called `.env` in the `backend` folder and put this in it:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/recipe-explorer
GEMINI_API_KEY=your_gemini_api_key_here
```

Replace `your_gemini_api_key_here` with your actual API key (I'll tell you how to get that below).

4. Make sure MongoDB is running on your computer:
   - **Windows**: MongoDB usually runs automatically if you installed it. If not, check your Services.
   - **Mac**: Open Terminal and type: `brew services start mongodb-community`
   - **Linux**: Type: `sudo systemctl start mongod`

5. Start the backend server:

```bash
npm run dev
```

You should see something like "Server is running on port 5000" and "Connected to MongoDB". If you see errors, make sure MongoDB is running first.

Keep this terminal window open! The backend needs to keep running.

### Step 3: Set Up the Frontend

The frontend is the website part that users see and interact with.

1. Open a NEW terminal window (keep the backend one running!). Go to the frontend folder:

```bash
cd frontend
```

2. Install the packages:

```bash
npm install
```

Again, this might take a minute.

3. Create a `.env` file in the frontend folder. Create a new file called `.env` and put this in it:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

This tells the frontend where to find the backend.

4. Start the frontend:

```bash
npm start
```

Your browser should automatically open to `http://localhost:3000` and you'll see the Recipe Explorer! If it doesn't open automatically, just go to that address in your browser.

## Setting Up the AI (Google Gemini)

The AI features need an API key from Google. Don't worry, it's free to get started!

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account (or create one if you don't have it)
3. Click the "Create API Key" button
4. Copy the key it gives you (it looks like a long string of letters and numbers)
5. Paste it into your `backend/.env` file where it says `GEMINI_API_KEY=your_gemini_api_key_here`

So your backend `.env` file should look like:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/recipe-explorer
GEMINI_API_KEY=AIzaSyD-sQOXOG6WLhFB2Ks6T2YzWBm8eMCFZlM
```

(That's just an example - use YOUR actual key!)

6. Restart your backend server (stop it with Ctrl+C and run `npm run dev` again) for the changes to take effect.

Now the AI features should work! Try clicking "Get Cooking Tips" on any recipe to see it in action.

## My Thought Process (Why I Made These Choices)

### Why MongoDB Instead of a Regular Database?

I chose MongoDB because recipes are messy. Some recipes have 3 ingredients, some have 20. Some have 2 steps, some have 15. MongoDB lets me store each recipe exactly how it is, without forcing everything to fit the same template. Plus, it's great for searching through recipe names, ingredients, and tags.

### Why React for the Frontend?

React makes it really easy to build pages that update without refreshing. When you filter recipes, React just shows the new list instantly. It's like having a smart page that changes what you see based on what you click. Also, there are tons of ready-made components (like shadcn/ui) that make building a nice-looking website much faster.

### Why Google Gemini for AI?

I tried a few AI services, and Gemini was the best for cooking help. It gives practical, helpful advice and doesn't use too many fancy words. Plus, the free tier is generous - enough for testing and learning. The API is also easy to use, which meant I could focus on making the features work well instead of fighting with the AI integration.

### Why Simple Language Everywhere?

When I first tested this with friends, they said the AI sounded too fancy. Like it was trying to impress them instead of help them. So I rewrote all the prompts to use simple words. Now when you ask for help, it talks like a friend who's helping you cook, not a chef trying to show off.

### The Component Structure

I organized the code so everything has its own job:
- Components handle what you see on screen
- Services handle talking to the backend
- The backend has controllers (handle requests), models (define recipe structure), and services (the AI logic)

This makes it easy to find things and change them later. Want to change how recipes look? Go to the components folder. Need to fix AI responses? Check the services folder.

### Error Handling

I learned early that things break. A lot. So I made sure errors show friendly messages instead of scary technical stuff. Instead of "ECONNREFUSED" you'll see "Unable to connect. Please try again later." Small thing, but it makes a big difference.

### Why No Connection Status Indicator?

At first, I had a widget showing if the backend was connected. But then I realized - users don't care about that! They just want it to work. So I removed it. If something's wrong, they'll see a friendly error message, but I won't show them the technical details they don't need.

## How to Use It

Once everything is running:

1. **Browse Recipes**: Go to the home page to see all recipes. Use the filters on the left to find what you want.
2. **Search with AI**: Type something like "quick vegetarian dinner" in the search box. The AI will understand and find matching recipes.
3. **View a Recipe**: Click any recipe to see full details.
4. **Get Cooking Tips**: On any recipe page, click "Get Cooking Tips" to get step-by-step help for cooking that specific recipe.
5. **Add Your Own**: Click "Add Recipe" in the header to create your own recipe.
6. **Explore Showcase**: Click "Showcase" to see recipes in a grid or list view with different sorting options.

## If Something Goes Wrong

**Backend won't start?**
- Make sure MongoDB is running
- Check that your `.env` file is in the backend folder and has all the required fields
- Make sure port 5000 isn't already being used by something else

**Frontend won't connect?**
- Make sure the backend is running (check that terminal window)
- Verify your `frontend/.env` file has the correct API URL
- Try refreshing your browser

**AI features not working?**
- Double-check your Gemini API key in the backend `.env` file
- Make sure you restarted the backend after adding the key
- Check the backend terminal for error messages

**Can't see any recipes?**
- Or add your own recipe through the website!

## What's Next?

I'm always adding new features! Some ideas I'm thinking about:
- Let users save their favorite recipes
- Add photos to recipes
- Recipe sharing between users
- Meal planning features
- Cooking timer built into the app

## Final Thoughts

This project was a great learning experience. I got to combine databases, APIs, AI, and frontend development all in one place. The hardest part was making everything work together smoothly, but that's also what made it fun.

If you're learning to code and want to build something similar, my advice is: start simple. Get the basic recipe list working first, then add search, then filters, then AI features. Build one thing at a time, and don't worry if it's not perfect at first.

Thanks for checking out my project! I hope you find it useful. Happy cooking! 🍳

---

**Note**: This project uses free tiers of services. For heavy use, you might need to upgrade to paid plans. Always be careful with API keys and never share them publicly!

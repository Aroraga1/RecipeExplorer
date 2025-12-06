# Recipe Explorer

A full-stack recipe management web application where you can browse recipes, search with natural language, filter by various criteria, and get AI-powered cooking tips.

## Features

- Browse recipes from different cuisines
- Search recipes using simple words (like "quick vegetarian pasta")
- Filter by difficulty, cooking time, cuisine, and ingredients
- AI-powered cooking tips and recipe suggestions
- Add your own recipes
- Dynamic recipe showcase with multiple view options

## Tech Stack

- **Backend**: Node.js, Express, MongoDB
- **Frontend**: React, shadcn/ui
- **AI**: Google Gemini API

## Getting Started

### Prerequisites

- Node.js (v14+)
- MongoDB (local or Atlas)
- Google Gemini API key (optional, for AI features)

### Backend Setup

1. Navigate to backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env` file in `backend/` folder:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/DB_nanme
GEMINI_API_KEY=your_gemini_api_key_here
```

4. Start MongoDB service on your system

5. Start the backend server:

```bash
npm run dev
```

### Frontend Setup

1. Open a new terminal and navigate to frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env` file in `frontend/` folder:

```env
REACT_APP_API_URL=BACKEND_ROUTE
```

4. Start the frontend:

```bash
npm start
```
just go to that address mantioned in terminal (probably 3000) in your browser.

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

**Note**: This project uses free tiers of services.

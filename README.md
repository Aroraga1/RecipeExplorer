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
MONGODB_URI=mongodb://localhost:27017/recipe-explorer
GEMINI_API_KEY=your_api_key_here
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
REACT_APP_API_URL=http://localhost:5000/api
```

4. Start the frontend:

```bash
npm start
```

The application will open at `http://localhost:3000`

## Usage

- Browse recipes on the home page
- Use filters to find specific recipes
- Search with natural language using the smart search
- View recipe details and get cooking tips
- Add new recipes through the "Add Recipe" page
- Explore recipes in different views on the Showcase page

## Troubleshooting

If you encounter issues:

- Ensure MongoDB is running
- Verify `.env` files are configured correctly
- Check that backend server is running on port 5000
- Restart both servers after changing environment variables

For detailed troubleshooting, see `TROUBLESHOOTING.md`

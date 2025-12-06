# Quick Setup Guide

## Prerequisites Check

Before starting, ensure you have:
- ✅ Node.js (v14+) installed
- ✅ MongoDB installed and running
- ✅ npm or yarn installed

## Step-by-Step Setup

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file (copy from example)
# Windows PowerShell:
Copy-Item .env.example .env

# Linux/Mac:
cp .env.example .env

# Edit .env file and add your Google Gemini API key
# Get free API key from: https://makersuite.google.com/app/apikey
```

### 2. Start MongoDB

**Windows:**
- MongoDB usually runs as a service automatically
- Or run: `mongod` in a terminal

**macOS:**
```bash
brew services start mongodb-community
```

**Linux:**
```bash
sudo systemctl start mongod
```

### 3. Start Backend Server

```bash
cd backend
npm run dev
```

Backend should be running on `http://localhost:5000`

### 5. Frontend Setup

Open a **new terminal window**:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env file
# Windows PowerShell:
Copy-Item .env.example .env

# Linux/Mac:
cp .env.example .env

# Start frontend
npm start
```

Frontend should open automatically at `http://localhost:3000`

## Verify Installation

1. Check backend: Visit `http://localhost:5000/api/health`
   - Should return: `{"status":"OK","message":"Recipe Explorer API is running"}`

2. Check frontend: Visit `http://localhost:3000`
   - Should see the Recipe Explorer homepage

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check `MONGODB_URI` in `backend/.env`

### Port Already in Use
- Change `PORT` in `backend/.env` to a different port (e.g., 5001)
- Update `REACT_APP_API_URL` in `frontend/.env` accordingly

### AI API Not Working
- Verify Gemini API key is correct in `.env` file
- Ensure the Generative Language API is enabled in your Google Cloud project
- Free tier has rate limits - wait a few moments if you hit limits

## Next Steps

- Import `postman_collection.json` into Postman to test API endpoints
- Explore the application features
- Check `README.md` for detailed documentation



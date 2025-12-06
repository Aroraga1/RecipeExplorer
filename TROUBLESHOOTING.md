# Troubleshooting Guide

## "Failed to fetch recipes" Error

This error typically occurs when the frontend cannot connect to the backend API. Follow these steps to diagnose and fix the issue:

### Step 1: Check Backend Server Status

**Verify the backend is running:**
```bash
cd backend
npm run dev
```

You should see:
```
Server is running on port 5000
Connected to MongoDB
```

**If the server doesn't start:**
- Check if port 5000 is already in use
- Verify Node.js is installed: `node --version`
- Check for missing dependencies: `npm install`

### Step 2: Check MongoDB Connection

**Verify MongoDB is running:**
```bash
# Windows
# Check Services or run: mongod

# macOS
brew services list | grep mongodb

# Linux
sudo systemctl status mongod
```

**If MongoDB is not running:**
```bash
# Start MongoDB
# Windows: Check Services panel
# macOS: brew services start mongodb-community
# Linux: sudo systemctl start mongod
```

**Test MongoDB connection:**
```bash
mongosh
# Should connect successfully
```

### Step 3: Check Environment Variables

**Backend `.env` file should contain:**
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/recipe-explorer
GEMINI_API_KEY=your_key_here
```

**Frontend `.env` file should contain:**
```env
REACT_APP_API_URL=http://localhost:5000/api
```

**Important:** After changing `.env` files:
- Backend: Restart the server
- Frontend: Restart the development server (React requires restart)

### Step 4: Test Backend API Directly

**Test the health endpoint:**
```bash
# Using curl
curl http://localhost:5000/api/health

# Using browser
# Navigate to: http://localhost:5000/api/health
```

**Expected response:**
```json
{
  "status": "OK",
  "message": "Recipe Explorer API is running",
  "mongodb": "connected"
}
```

**Test recipes endpoint:**
```bash
curl http://localhost:5000/api/recipes
```

### Step 5: Check Browser Console

1. Open browser Developer Tools (F12)
2. Go to Console tab
3. Look for error messages
4. Check Network tab for failed requests

**Common console errors:**
- `ECONNREFUSED` - Backend server not running
- `Network Error` - CORS issue or server unreachable
- `404 Not Found` - Wrong API URL
- `500 Internal Server Error` - Backend error (check backend logs)

### Step 6: Verify CORS Configuration

The backend should have CORS enabled. Check `backend/server.js`:
```javascript
app.use(cors());
```

If you're running frontend on a different port, ensure CORS allows it.

### Step 7: Check Firewall/Antivirus

Sometimes firewalls or antivirus software block localhost connections:
- Temporarily disable firewall/antivirus
- Add exceptions for Node.js and MongoDB
- Check Windows Firewall settings

### Step 8: Add Recipes

If the database is empty, recipes won't load. You can add recipes through the website using the "Add Recipe" feature.

### Step 9: Clear Browser Cache

Sometimes cached data causes issues:
- Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
- Clear browser cache
- Try incognito/private mode

### Step 10: Check Port Conflicts

**If port 5000 is in use:**
1. Change `PORT` in `backend/.env` to another port (e.g., 5001)
2. Update `REACT_APP_API_URL` in `frontend/.env` accordingly
3. Restart both servers

## Common Error Messages and Solutions

### "Cannot connect to backend server"
- **Solution:** Start the backend server

### "MongoDB connection error"
- **Solution:** Start MongoDB service

### "Route not found"
- **Solution:** Check API URL in frontend `.env` file

### "Network Error"
- **Solution:** Check if backend is running and CORS is configured

### "No recipes found"
- **Solution:** Add recipes through the "Add Recipe" feature on the website

## Quick Diagnostic Checklist

- [ ] Backend server is running (`npm run dev` in backend folder)
- [ ] MongoDB is running and connected
- [ ] Frontend server is running (`npm start` in frontend folder)
- [ ] `.env` files are configured correctly
- [ ] No port conflicts
- [ ] Browser console shows no errors
- [ ] Database has been seeded (optional but recommended)

## Still Having Issues?

1. **Check backend logs** - Look at the terminal where backend is running
2. **Check frontend logs** - Look at browser console and terminal
3. **Verify all dependencies** - Run `npm install` in both folders
4. **Try restarting everything:**
   - Stop both servers (Ctrl+C)
   - Restart MongoDB
   - Start backend: `cd backend && npm run dev`
   - Start frontend: `cd frontend && npm start`

## Getting Help

If you're still experiencing issues:
1. Check the error message in browser console
2. Check backend terminal for error logs
3. Verify all prerequisites are installed
4. Review the README.md for setup instructions



# Environment Variables Template

This file shows the required environment variables for the Recipe Explorer application. Copy these templates to create your `.env` files.

## Backend Environment Variables

Create a file named `.env` in the `backend/` directory with the following content:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/recipe-explorer

# AI Service Configuration (Google Gemini API)
# Get your API key from: https://makersuite.google.com/app/apikey
GEMINI_API_KEY=your_gemini_api_key_here
```

### Variable Descriptions

- **PORT**: The port number for the backend server (default: 5000)
- **NODE_ENV**: Environment mode - `development`, `production`, or `test`
- **MONGODB_URI**: MongoDB connection string
  - Local: `mongodb://localhost:27017/recipe-explorer`
  - Atlas: `mongodb+srv://username:password@cluster.mongodb.net/database`
- **GEMINI_API_KEY**: Your Google Gemini API key (required for AI features)

## Frontend Environment Variables

Create a file named `.env` in the `frontend/` directory with the following content:

```env
# API Configuration
REACT_APP_API_URL=http://localhost:5000/api
```

### Variable Descriptions

- **REACT_APP_API_URL**: The base URL for the backend API
  - Local development: `http://localhost:5000/api`
  - Production: Update to your production backend URL

## Setup Instructions

1. **Backend Setup:**
   ```bash
   cd backend
   # Create .env file manually or copy from template
   # Windows PowerShell:
   # Copy-Item ENV_TEMPLATE.md .env
   # Then edit .env and replace placeholder values
   ```

2. **Frontend Setup:**
   ```bash
   cd frontend
   # Create .env file manually
   # Add: REACT_APP_API_URL=http://localhost:5000/api
   ```

## Security Reminders

- ⚠️ **Never commit `.env` files to version control**
- ⚠️ **Never share your API keys or credentials**
- ⚠️ **Use different keys for development and production**
- ⚠️ **Keep your `.env` files secure and private**

## Getting Your Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated key
5. Paste it in your `.env` file as `GEMINI_API_KEY`

## Verification

After setting up your `.env` files:

1. **Backend**: The server will validate environment variables at startup
   - You'll see validation messages when starting the server
   - Errors will be shown if required variables are missing

2. **Frontend**: The React app will use the configured API URL
   - Check browser console for connection status
   - Verify API calls are going to the correct endpoint

For more security information, see [SECURITY.md](./SECURITY.md)




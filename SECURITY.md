# Security Best Practices

This document outlines security best practices for the Recipe Explorer application, focusing on API keys, environment variables, and sensitive data handling.

## 🔐 Environment Variables & API Keys

### Secure Storage

1. **Never commit API keys or secrets to version control**
   - All sensitive data must be stored in `.env` files
   - `.env` files are automatically ignored by git (see `.gitignore`)
   - Never share `.env` files or commit them to repositories

2. **Use environment variables for all sensitive configuration**
   ```env
   # ✅ GOOD - Store in .env file
   GEMINI_API_KEY=your_actual_api_key_here
   MONGODB_URI=mongodb://username:password@host:port/database
   
   # ❌ BAD - Never hardcode in source code
   const API_KEY = "AIzaSyC-example-key-here";
   ```

3. **Create `.env.example` files as templates**
   - Include all required variables with placeholder values
   - Document what each variable is for
   - Never include actual keys or secrets

### Environment Variable Handling

Make sure all required environment variables are set in your `.env` file. The application will fail with clear error messages at runtime if required variables are missing (e.g., MongoDB connection errors, API authentication errors).

### Example `.env` File Structure

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

## 🛡️ API Key Security

### Google Gemini API Key

1. **Obtaining Your API Key**
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key or use an existing one
   - Store it securely in your `.env` file

2. **Key Protection**
   - Never log or expose API keys in error messages
   - Use different keys for development and production
   - Rotate keys regularly, especially if exposed
   - Restrict API key permissions when possible

3. **Key Validation**
   - Ensure your API key is valid before deploying
   - Test API functionality after adding the key
   - The application will show clear errors if the key is invalid

### Error Handling Security

The application sanitizes error messages to prevent API key exposure:
- Removes API keys from log messages
- Replaces sensitive data with `[REDACTED]` placeholders
- Provides user-friendly error messages without technical details

## 🔒 Security Features Implemented

### 1. Error Message Sanitization
- **Location**: `backend/services/aiService.js`
- **Purpose**: Prevents API key exposure in error messages
- **Features**:
  - Removes API keys from error logs
  - Masks sensitive patterns
  - Provides safe error messages to users

### 2. Secure Configuration
- **Location**: `backend/server.js`
- **Purpose**: Uses environment variables for all sensitive configuration
- **Features**:
  - All secrets stored in `.env` files
  - No hardcoded credentials
  - Environment variables loaded securely

## 📋 Security Checklist

Before deploying or sharing your application:

- [ ] All API keys stored in `.env` files (never in code)
- [ ] `.env` files added to `.gitignore`
- [ ] `.env.example` files created with placeholders
- [ ] No hardcoded credentials in source code
- [ ] Different API keys for development and production
- [ ] Error messages don't expose sensitive data
- [ ] MongoDB connection strings secured
- [ ] CORS properly configured
- [ ] Regular security audits of dependencies

## 🚨 Common Security Mistakes to Avoid

### ❌ Don't Do This:

```javascript
// Hardcoding API keys
const API_KEY = "AIzaSyC-example-key";

// Logging API keys
console.log("API Key:", process.env.GEMINI_API_KEY);

// Exposing keys in error messages
throw new Error(`API call failed with key: ${API_KEY}`);

// Committing .env files
git add .env
git commit -m "Add config"
```

### ✅ Do This Instead:

```javascript
// Use environment variables
const API_KEY = process.env.GEMINI_API_KEY;

// Sanitize logs
console.log("API Key configured:", !!API_KEY);

// Safe error messages
throw new Error("API authentication failed");

// Use .env.example
git add .env.example
```

## 🔄 Key Rotation

If an API key is exposed or compromised:

1. **Immediately revoke the exposed key**
   - Go to Google AI Studio
   - Delete or disable the compromised key

2. **Generate a new key**
   - Create a new API key in Google AI Studio
   - Update your `.env` file with the new key

3. **Restart your application**
   - Restart the backend server
   - Verify the new key works correctly

4. **Review access logs**
   - Check for any unauthorized usage
   - Monitor for suspicious activity

## 🌐 Production Security

For production deployments:

1. **Use secure environment variable management**
   - Use cloud provider secrets management (AWS Secrets Manager, Azure Key Vault, etc.)
   - Or use environment variable injection from your hosting platform

2. **Enable HTTPS**
   - Always use HTTPS in production
   - Configure SSL/TLS certificates

3. **Restrict API key permissions**
   - Use the most restrictive permissions possible
   - Enable IP restrictions if available

4. **Monitor and log**
   - Set up monitoring for API usage
   - Log security events
   - Set up alerts for suspicious activity

5. **Regular updates**
   - Keep dependencies updated
   - Review security advisories
   - Update API keys periodically

## 📚 Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Google Cloud API Security](https://cloud.google.com/docs/security/api-keys)
- [Environment Variables Security](https://www.twilio.com/blog/environment-variables-python)

## 🆘 Reporting Security Issues

If you discover a security vulnerability:

1. **Do not** create a public GitHub issue
2. Contact the maintainers privately
3. Provide details about the vulnerability
4. Allow time for the issue to be addressed before disclosure

---

**Remember**: Security is an ongoing process. Regularly review and update your security practices.




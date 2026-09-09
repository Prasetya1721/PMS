# 📋 How to Check Vercel Function Logs

## Method 1: Via Vercel Dashboard (Recommended)

### Step 1: Open Deployment
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your **PMS Kapal** project
3. Click **Deployments** tab
4. Click on the **FAILED** deployment (commit `c23137f` or `1b6c7c8`)

### Step 2: View Function Logs
1. Scroll down to **Functions** section
2. Click on `api/index` function
3. Click **View Function Logs** button
4. Look for error message with stack trace

### Step 3: Copy Error Details
Copy the error message, should look like:
```
Error: Cannot find module 'xxx'
  at Function.Module._resolveFilename (internal/modules/cjs/loader.js:xxx)
  at Function.Module._load (internal/modules/cjs/loader.js:xxx)
  ...
```

---

## Method 2: Via Vercel CLI

If you have Vercel CLI installed:

```bash
# Install Vercel CLI (if not installed)
npm i -g vercel

# Login
vercel login

# Link project
vercel link

# Get deployment logs
vercel logs https://your-deployment-url.vercel.app

# Or get latest deployment
vercel logs --follow
```

---

## Method 3: Browser DevTools

### Test the endpoint manually:

```bash
# Open browser console (F12) and run:
fetch('https://your-app.vercel.app/api/health')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error)
```

This will show:
- Network tab: HTTP status code
- Console: Error response body

---

## What to Look For

### Common Error Patterns:

#### 1. Module Not Found
```
Error: Cannot find module 'xxx'
```
**Solution:** Missing dependency or wrong import syntax

#### 2. Syntax Error
```
SyntaxError: Unexpected token 'export'
```
**Solution:** ESM vs CommonJS mismatch

#### 3. Timeout
```
Task timed out after 10.00 seconds
```
**Solution:** Function took too long (cold start issue)

#### 4. Memory Limit
```
Process exited before completing request
```
**Solution:** Function used too much memory

#### 5. Uncaught Exception
```
UnhandledPromiseRejectionWarning: ...
```
**Solution:** Missing try-catch or await

---

## After Getting Logs

**Send me:**
1. Full error stack trace
2. Request URL that caused error
3. Request method (GET/POST)
4. Any other error details

Then I can fix the exact issue! 🔧

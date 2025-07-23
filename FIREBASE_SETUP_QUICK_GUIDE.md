# How to Get Firebase Client Credentials

## Quick Fix for the Error

The error `Firebase: Error (auth/invalid-api-key)` occurs because you need to add Firebase client-side configuration to your `.env.local` file.

## Step-by-Step Instructions

### 1. Go to Firebase Console
1. Visit [Firebase Console](https://console.firebase.google.com/)
2. Select your `phygen-ai` project (or create it if it doesn't exist)

### 2. Get Web App Configuration
1. Click the gear icon (⚙️) next to "Project Overview"
2. Select "Project settings"
3. Scroll down to "Your apps" section
4. If you don't have a web app, click "Add app" and select "Web" (</>) icon
5. If you already have a web app, you'll see it listed

### 3. Copy the Configuration
You'll see a config object like this:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...",
  authDomain: "phygen-ai.firebaseapp.com",
  projectId: "phygen-ai",
  storageBucket: "phygen-ai.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123..."
};
```

### 4. Update Your .env.local File
Replace the placeholder values in your `.env.local` file:

```bash
# Replace these values with your actual Firebase config
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyC...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=phygen-ai.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=phygen-ai
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=phygen-ai.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123...
```

### 5. Enable Google Authentication
1. In Firebase Console, go to "Authentication" 
2. Click on "Sign-in method" tab
3. Click on "Google" provider
4. Toggle "Enable"
5. Add your domain to "Authorized domains" if needed

### 6. Restart Your Development Server
```bash
npm run dev
```

## Current Status

✅ Your Firebase Admin SDK is already configured (server-side)
✅ Your API authentication system is working
❌ Missing Firebase client credentials (client-side Google auth)

## Temporary Workaround

The application will work normally for email/password authentication. The Google login button will show "Google auth not configured" until you add the credentials.

## Alternative: Skip Google Authentication

If you don't want to use Google authentication right now, you can comment out the Google login button in your login and register pages and continue using only email/password authentication with your API.

## Need Help?

If you have any issues getting the Firebase credentials:
1. Make sure you're logged in with the same Google account that owns the Firebase project
2. Ensure the project ID matches: `phygen-ai`
3. Check that you're looking at the correct project in Firebase Console

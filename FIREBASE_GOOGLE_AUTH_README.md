# Firebase Google Authentication Integration

This guide explains how to integrate Firebase Google authentication with your existing JWT token-based API authentication system.

## Overview

The system is designed to:
- Use Firebase only for Google authentication
- Use your custom API for email/password authentication and user management
- Generate JWT tokens from your API for both authentication methods
- Store tokens in localStorage for consistent authentication flow

## Architecture

```
Frontend (Google Login) 
    ↓ Firebase Authentication
Firebase Client SDK 
    ↓ ID Token
Next.js API Route (/api/auth/google-login)
    ↓ Verify ID Token & Extract User Data
Your Backend API (/Auth/google-login)
    ↓ Create/Find User & Generate JWT
Frontend (JWT Token Storage)
```

## Setup Instructions

### 1. Firebase Project Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use existing `phygen-ai` project
3. Enable Authentication and add Google as a sign-in provider
4. Add your domain to authorized domains in Authentication settings

### 2. Environment Variables

Copy `.env.example` to `.env.local` and fill in your Firebase credentials:

```bash
cp .env.example .env.local
```

Required environment variables:

#### Firebase Admin SDK (Server-side)
```env
FIREBASE_PROJECT_ID=phygen-ai
FIREBASE_PRIVATE_KEY_ID=your_private_key_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour_private_key\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@phygen-ai.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=your_client_id
FIREBASE_CLIENT_X509_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxxxx%40phygen-ai.iam.gserviceaccount.com
```

#### Firebase Client SDK (Client-side)
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_web_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=phygen-ai.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=phygen-ai
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=phygen-ai.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=1:your_sender_id:web:your_app_id
```

### 3. Backend API Endpoint

Your backend API needs to implement the `/Auth/google-login` endpoint:

**Endpoint:** `POST /Auth/google-login`

**Request Body:**
```json
{
  "firebaseUid": "firebase_user_uid",
  "email": "user@example.com",
  "displayName": "User Name",
  "photoURL": "https://example.com/photo.jpg",
  "provider": "google"
}
```

**Response:**
```json
{
  "accessToken": "your_jwt_token",
  "id": "user_id",
  "email": "user@example.com",
  "username": "username",
  "role": 2
}
```

**Implementation Notes:**
- Verify the `firebaseUid` is valid (optional, since we already verify on Next.js side)
- Check if user exists by email or firebaseUid
- If user doesn't exist, create a new user
- Generate and return your JWT token
- Return user data in the same format as your regular login endpoint

## Usage

### Using Google Login Button

```tsx
import { GoogleLoginButton } from '@/components/auth/GoogleLoginButton';

function LoginPage() {
  return (
    <GoogleLoginButton 
      onSuccess={(role) => {
        // Handle successful login
        console.log('User logged in with role:', role);
      }}
      onError={(error) => {
        // Handle login error
        console.error('Login failed:', error);
      }}
    />
  );
}
```

### Using Auth Context

```tsx
import { useAuth } from '@/context/AuthContext';

function MyComponent() {
  const { loginWithGoogle, isLoading, isAuthenticated, user } = useAuth();

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      // User is now authenticated
    } catch (error) {
      console.error('Google login failed:', error);
    }
  };

  return (
    <button onClick={handleGoogleLogin} disabled={isLoading}>
      {isLoading ? 'Signing in...' : 'Login with Google'}
    </button>
  );
}
```

## Authentication Flow

### Google Login Flow
1. User clicks "Sign in with Google"
2. Firebase opens Google authentication popup
3. User authenticates with Google
4. Firebase returns ID token
5. Frontend sends ID token to `/api/auth/google-login`
6. Next.js API verifies ID token with Firebase Admin
7. Verified user data is sent to your backend API
8. Your API creates/finds user and generates JWT token
9. JWT token is stored in localStorage
10. User is redirected based on their role

### Regular Login Flow
1. User submits email/password form
2. Frontend calls your `/Auth/login` endpoint directly
3. Your API validates credentials and returns JWT token
4. JWT token is stored in localStorage
5. User is redirected based on their role

## API Integration

### Authentication Headers

All API requests automatically include the JWT token:

```javascript
// Automatic header attachment via httpClient
const response = await httpClient.get('/protected-endpoint');
// Headers: { Authorization: 'Bearer your_jwt_token' }
```

### Manual Token Access

```javascript
import { tokenStorage } from '@/lib/auth-token';

// Get current token
const token = tokenStorage.getToken();

// Get user data
const userData = tokenStorage.getUserData();

// Check if token is expired
const isExpired = jwtUtils.isTokenExpired(token);
```

## Security Considerations

1. **Firebase ID Token Verification**: ID tokens are verified server-side using Firebase Admin SDK
2. **JWT Token Management**: Your API generates and manages JWT tokens
3. **Token Expiry**: Automatic token expiry monitoring and cleanup
4. **HTTPS Required**: Firebase requires HTTPS in production
5. **Domain Whitelist**: Only authorized domains can use Firebase authentication

## Error Handling

Common error scenarios and handling:

```javascript
try {
  await loginWithGoogle();
} catch (error) {
  if (error.message.includes('popup-closed-by-user')) {
    // User closed the popup
  } else if (error.message.includes('network-request-failed')) {
    // Network error
  } else if (error.message.includes('Invalid Firebase ID token')) {
    // Token verification failed
  } else {
    // Other errors
  }
}
```

## Migration from Session-based Auth

If you're migrating from session-based authentication:

1. Replace session login with token-based login
2. Update protected routes to use `ProtectedRoute` component
3. Replace session checks with `useAuth` hook
4. Update API calls to use `httpClient` for automatic token attachment

## Testing

1. Start the development server: `npm run dev`
2. Navigate to `/login-token`
3. Click "Continue with Google"
4. Complete Google authentication
5. Verify JWT token is stored in localStorage
6. Verify user is redirected based on role

## Troubleshooting

### Common Issues

1. **Firebase not configured**: Check environment variables
2. **API endpoint not found**: Implement `/Auth/google-login` on your backend
3. **Token not included in requests**: Use `httpClient` instead of fetch
4. **Popup blocked**: Check browser popup settings
5. **Domain not authorized**: Add domain to Firebase authorized domains

### Debug Mode

Enable debug logging:

```javascript
// In firebase-client.ts
import { connectAuthEmulator } from 'firebase/auth';

if (process.env.NODE_ENV === 'development') {
  // Enable auth emulator for testing
  // connectAuthEmulator(auth, 'http://localhost:9099');
}
```

## Production Deployment

1. Update Firebase authorized domains
2. Set production environment variables
3. Ensure HTTPS is enabled
4. Update API base URL if needed
5. Test Google authentication flow

## Support

For issues related to:
- Firebase setup: Check Firebase documentation
- API integration: Verify your backend implementation
- Token management: Check auth-token.ts utility functions
- UI components: Check component props and usage examples

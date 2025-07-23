import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Firebase client configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'phygen-ai',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Check if all required Firebase config is available and not placeholder values
const isFirebaseConfigured = !!(
  firebaseConfig.apiKey &&
  firebaseConfig.apiKey !== 'your_web_api_key_here' &&
  firebaseConfig.authDomain &&
  firebaseConfig.projectId &&
  firebaseConfig.messagingSenderId &&
  firebaseConfig.messagingSenderId !== 'your_messaging_sender_id_here' &&
  firebaseConfig.appId &&
  firebaseConfig.appId !== 'your_app_id_here'
);

// Initialize Firebase client app only if configured
let firebaseApp: any = null;
let auth: any = null;
let googleProvider: GoogleAuthProvider | null = null;

if (isFirebaseConfigured) {
  firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  
  // Initialize Firebase Auth
  auth = getAuth(firebaseApp);
  
  // Google Auth Provider
  googleProvider = new GoogleAuthProvider();
  googleProvider.setCustomParameters({
    prompt: 'select_account'
  });
} else {
  console.warn('Firebase client configuration is incomplete. Google authentication will not be available.');
}

export { auth, googleProvider };
export default firebaseApp;

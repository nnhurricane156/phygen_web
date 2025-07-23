# PhyGen - Token-Based Authentication System

## 🎯 Project Overview

PhyGen is now a streamlined physics exam generation application using **JWT token-based authentication only**. All session-based authentication has been removed for a cleaner, more secure, and modern approach.

## 🚀 Authentication Features

### ✅ **JWT Token Authentication**
- **Login**: `/login` - Email/password authentication
- **Register**: `/register` - User registration 
- **Google Login**: Optional Google authentication via Firebase
- **Token Storage**: Secure localStorage with automatic expiry
- **API Integration**: Automatic Bearer token attachment to all requests

### ❌ **Removed Features**
- Session-based authentication
- Firebase Admin SDK
- Server-side session management
- Cookie-based authentication
- Middleware session checks

## 📁 **Current Project Structure**

```
src/
├── app/
│   ├── login/page.tsx           # JWT-based login page
│   ├── register/page.tsx        # JWT-based register page
│   ├── admin/                   # Admin dashboard
│   ├── manager/                 # Manager dashboard  
│   ├── createExam/             # User exam creation
│   └── api/
│       └── auth/
│           └── google-login/    # Google auth endpoint
├── components/
│   ├── auth/
│   │   ├── GoogleLoginButton.tsx    # Google login component
│   │   └── ProtectedRoute.tsx       # Route protection
│   ├── common/
│   │   ├── ErrorBoundary.tsx        # Error handling
│   │   └── PerformanceMonitor.tsx   # Performance tracking
│   └── ui/
│       └── loading/Loading.tsx      # Loading components
├── context/
│   ├── AuthContext.tsx             # JWT token management
│   └── ThemeContext.tsx            # Theme management
├── lib/
│   ├── auth-token.ts              # Token utilities
│   ├── http-client.ts             # API client with auto token
│   ├── firebase-client.ts         # Firebase client (Google auth)
│   └── api.ts                     # API configuration
└── actions/
    └── auth-token.tsx             # Server actions for auth
```

## 🔧 **Key Components**

### **AuthContext** (`/src/context/AuthContext.tsx`)
- Global authentication state management
- JWT token storage and retrieval
- Automatic token expiry monitoring
- Login, register, logout functions
- Google authentication integration

### **ProtectedRoute** (`/src/components/auth/ProtectedRoute.tsx`)
- Role-based route protection
- Automatic redirects for unauthorized users
- Supports ADMIN, USER, MANAGER roles

### **HTTP Client** (`/src/lib/http-client.ts`)
- Automatic Bearer token attachment
- 401 error handling with auto-logout
- Centralized API error management

### **Token Utilities** (`/src/lib/auth-token.ts`)
- localStorage token management
- JWT token decoding and validation
- Token expiry checking
- User data persistence

## 🌐 **API Integration**

### **Your Backend Endpoints**
```
POST /Auth/login          # Email/password login
POST /Auth/register       # User registration
POST /Auth/google-login   # Google authentication (optional)
```

### **Request/Response Format**
**Login Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "accessToken": "jwt_token_here",
  "id": "user_id",
  "email": "user@example.com",
  "username": "username",
  "role": 2
}
```

## 🔐 **Security Features**

- ✅ JWT tokens stored securely in localStorage
- ✅ Automatic token expiry handling
- ✅ Bearer token authentication headers
- ✅ Role-based access control
- ✅ Client-side route protection
- ✅ Error boundary for graceful error handling
- ✅ Input validation with Zod schemas

## 🎨 **User Interface**

- **Modern Design**: Clean, responsive authentication forms
- **Loading States**: Optimized loading spinners and skeletons
- **Error Handling**: User-friendly error messages
- **Success Feedback**: Registration and login success messages
- **Google Integration**: Optional Google login button
- **Dark/Light Theme**: Theme switching support

## 🚀 **Getting Started**

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment**:
   - Update `/src/lib/api.ts` with your API base URL
   - Optionally configure Firebase for Google auth in `.env.local`

3. **Start Development**:
   ```bash
   npm run dev
   ```

4. **Access Application**:
   - Main app: `http://localhost:3000`
   - Login: `http://localhost:3000/login`
   - Register: `http://localhost:3000/register`

## 🔄 **Authentication Flow**

1. **User Registration/Login** → JWT Token from your API
2. **Token Storage** → Secure localStorage management
3. **API Requests** → Automatic Bearer token attachment
4. **Route Protection** → Role-based access control
5. **Token Expiry** → Automatic logout and cleanup

## 📊 **Performance**

- **Lightweight**: Removed unnecessary session management
- **Fast**: Client-side token validation
- **Secure**: JWT-based stateless authentication
- **Scalable**: No server-side session storage required

## 🎯 **Ready for Production**

Your PhyGen application now has a clean, modern, JWT token-based authentication system that's ready for production deployment!

- ✅ No session dependencies
- ✅ Stateless authentication
- ✅ Modern React patterns
- ✅ Secure token management
- ✅ Error boundaries and performance monitoring
- ✅ Optional Google authentication
- ✅ Role-based authorization

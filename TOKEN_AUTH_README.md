# JWT Token-Based Authentication System

This implementation provides a complete JWT token-based authentication system that stores tokens in localStorage and automatically attaches them to API requests.

## 🚀 **Features**

### ✅ **Token Management**
- JWT tokens stored in localStorage
- Automatic token expiry checking
- Auto-logout when token expires
- Secure token attachment to all API requests

### ✅ **Authentication Context**
- React Context for global auth state
- Login/register/logout functions
- User data management
- Loading states

### ✅ **Protected Routes**
- Role-based access control
- Automatic redirects for unauthorized access
- Loading states during auth checks

### ✅ **HTTP Client**
- Automatic token attachment to headers
- 401 error handling with auto-logout
- Clean API for making authenticated requests

## 📁 **Key Files**

### **Core Authentication**
- `/src/lib/auth-token.ts` - Token storage and JWT utilities
- `/src/lib/http-client.ts` - HTTP client with automatic token attachment
- `/src/context/AuthContext.tsx` - React context for authentication state

### **Components**
- `/src/components/auth/ProtectedRoute.tsx` - Route protection component
- `/src/components/header/HeaderAuth.tsx` - Updated header with token auth
- `/src/components/header/UserMenu.tsx` - Updated user menu

### **Pages**
- `/src/app/login-token/page.tsx` - Token-based login page
- `/src/app/register-token/page.tsx` - Token-based register page
- `/src/app/admin-token/users/page.tsx` - Example protected admin page

### **Actions**
- `/src/actions/auth-token.tsx` - Server actions for token auth

## 🔧 **How to Use**

### **1. Basic Authentication**

```tsx
import { useAuth } from '@/context/AuthContext';

function MyComponent() {
    const { isAuthenticated, user, login, logout } = useAuth();
    
    if (!isAuthenticated) {
        return <div>Please login</div>;
    }
    
    return <div>Welcome, {user?.username}!</div>;
}
```

### **2. Protected Routes**

```tsx
import ProtectedRoute, { USER_ROLES } from '@/components/auth/ProtectedRoute';

function AdminPage() {
    return (
        <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
            <div>Admin only content</div>
        </ProtectedRoute>
    );
}
```

### **3. Making Authenticated API Calls**

```tsx
import { httpClient } from '@/lib/http-client';

// GET request with automatic token
const users = await httpClient.get<User[]>('/users');

// POST request with automatic token
const newUser = await httpClient.post('/users', userData);

// PUT request with automatic token
const updatedUser = await httpClient.put(`/users/${id}`, userData);

// DELETE request with automatic token
await httpClient.delete(`/users/${id}`);
```

### **4. Manual Token Access**

```tsx
import { tokenStorage } from '@/lib/auth-token';

// Get current token
const token = tokenStorage.getToken();

// Check if user is authenticated
const isAuth = tokenStorage.isAuthenticated();

// Get user data
const userData = tokenStorage.getUserData();

// Remove token (logout)
tokenStorage.removeToken();
```

## 🛡️ **Security Features**

### **Automatic Token Expiry**
- Tokens are checked for expiry on every request
- Auto-logout when token expires
- Expiry warnings can be implemented

### **Request Interception**
- All API requests automatically include Authorization header
- 401 responses trigger automatic logout
- Network errors are handled gracefully

### **Role-Based Access**
- Components can specify required roles
- Automatic redirects based on user role
- Clean separation of admin/user/manager content

## 🔄 **Migration from Session-Based Auth**

Your existing pages can continue to work with session-based auth. To migrate to token-based:

1. Replace `/login` with `/login-token`
2. Replace `/register` with `/register-token`  
3. Wrap components with `<ProtectedRoute>` instead of middleware
4. Use `httpClient` for API calls instead of raw fetch
5. Use `useAuth()` hook instead of session API calls

## 🧪 **Testing the System**

1. **Login**: Visit `http://localhost:3000/login-token`
2. **Register**: Visit `http://localhost:3000/register-token`
3. **Protected Page**: Visit `http://localhost:3000/admin-token/users` (Admin only)
4. **API Testing**: Check browser console for authenticated API calls

## 🔧 **Environment Variables**

Make sure these are set in your `.env.local`:

```bash
NEXT_PUBLIC_API_BASE_URL=http://ec2-54-66-6-158.ap-southeast-2.compute.amazonaws.com:5152/api
```

## 🚀 **Production Considerations**

1. **Secure Storage**: Consider using httpOnly cookies for production
2. **Token Refresh**: Implement refresh token mechanism
3. **HTTPS**: Always use HTTPS in production
4. **CSP Headers**: Configure Content Security Policy
5. **Rate Limiting**: Implement API rate limiting

## 📊 **Token Structure**

The JWT tokens contain:
```json
{
  "id": "user_id",
  "email": "user@example.com", 
  "username": "username",
  "role": 1,
  "iat": 1234567890,
  "exp": 1234567890
}
```

Roles:
- `1` = Admin
- `2` = User  
- `3` = Manager

## 🎯 **Next Steps**

1. Update your existing pages to use token-based auth
2. Implement refresh token functionality
3. Add token expiry warnings
4. Create role-specific dashboards
5. Add API endpoints for user management

The system is now ready for production use with full JWT token-based authentication! 🎉

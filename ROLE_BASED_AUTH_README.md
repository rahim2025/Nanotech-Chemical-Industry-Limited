# Role-Based Authentication Implementation

## Overview
This implementation adds role-based authentication to the existing MERN app with the following features:

## Backend Features

### 1. User Model Updates
- Added `role` field to user schema with enum values: `["user", "admin"]`
- Default role is set to `"user"` for all new signups
- Role is stored in MongoDB user document

### 2. Authentication Middleware
- **`protectRoute.js`**: Existing middleware for authentication
- **`adminAuth.js`**: New middleware for admin authorization
  - `requireAdmin`: Ensures user has admin role
  - `requireUserOrAdmin`: Allows access to own profile or admin access

### 3. Admin Management Controller
- **`admin.controller.js`**: New controller with admin functions
  - `getAllUsers`: Get all users (admin only)
  - `promoteToAdmin`: Promote user to admin role
  - `demoteToUser`: Demote admin to user role  
  - `getUserById`: Get specific user (own profile or admin)
  - `deleteUser`: Delete user (admin only, cannot delete self)

### 4. Routes
- **`/api/admin/users`**: GET - List all users (admin only)
- **`/api/admin/users/:userId/promote`**: PUT - Promote user to admin
- **`/api/admin/users/:userId/demote`**: PUT - Demote admin to user
- **`/api/admin/users/:userId`**: GET - Get user details (user or admin)
- **`/api/admin/users/:userId`**: DELETE - Delete user (admin only)

### 5. Updated Auth Responses
- Login and checkAuth now return user role information
- All user responses include role field

## Frontend Features

### 1. Admin Store
- **`useAdminStore.js`**: Zustand store for admin functions
  - State management for users list
  - Actions for promote, demote, delete operations
  - Error handling with toast notifications

### 2. Admin Dashboard
- **`AdminDashboard.jsx`**: Complete admin interface
  - User filtering (All, Users, Admins)
  - User management actions (promote, demote, delete)
  - Protection against self-modification
  - Responsive table layout with user avatars

### 3. Role-Based UI Components
- **`RoleBadge.jsx`**: Reusable component to display user roles
- **`AdminRoute.jsx`**: Route protection component for admin pages
- Updated Navbar with admin link (visible only to admins)
- Updated Profile page to show user role

### 4. Navigation & Routing
- Admin link in navigation bar (admin only)
- Protected admin route in App.jsx
- Role-based access control

## Usage Instructions

### For Regular Users
1. Sign up creates account with "user" role by default
2. Can view own profile and role status
3. Cannot access admin functions

### For Admins
1. Database owner can manually promote users to admin
2. Admins see "Admin" button in navigation
3. Admin dashboard provides user management interface
4. Can promote/demote users and delete accounts
5. Cannot demote themselves or delete own account

### Promoting First Admin
Since all users start as "user" role, the first admin must be promoted manually:

**Option 1: Direct Database Update**
```javascript
// In MongoDB shell or database tool
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

**Option 2: Using Admin API (after promoting first admin)**
```bash
# Promote user to admin
curl -X PUT http://localhost:5000/api/admin/users/USER_ID/promote
```

## Security Features
- JWT-based authentication required for all admin routes
- Role verification in middleware prevents unauthorized access
- Users cannot modify their own roles through the API
- Admins cannot demote or delete themselves
- All admin actions are protected by authentication + authorization

## File Structure
```
backend/src/
├── controllers/admin.controller.js     # Admin management functions
├── middlewares/adminAuth.js            # Admin authorization middleware
├── routers/admin.router.js             # Admin routes
└── models/user.model.js                # Updated with role field

frontend/src/
├── components/
│   ├── AdminRoute.jsx                  # Admin route protection
│   └── RoleBadge.jsx                   # Role display component
├── pages/AdminDashboard.jsx            # Admin management interface
├── store/useAdminStore.js              # Admin state management
└── App.jsx                             # Updated with admin routing
```

## API Endpoints

### Admin Routes (Require Admin Role)
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:userId/promote` - Promote to admin
- `PUT /api/admin/users/:userId/demote` - Demote to user
- `DELETE /api/admin/users/:userId` - Delete user

### User Routes (User or Admin)
- `GET /api/admin/users/:userId` - Get user by ID (own profile or admin access)

### Auth Routes (Updated)
- `POST /api/auth/login` - Now returns role information
- `GET /api/auth/check` - Now returns role information

## Testing the Implementation

1. Start both servers:
   ```bash
   # Backend
   cd backend && npm run dev
   
   # Frontend  
   cd frontend && npm run dev
   ```

2. Create a regular user account
3. Manually promote user to admin in database
4. Login and access admin dashboard at `/admin`
5. Test user management functions

The implementation provides a complete role-based authentication system with secure admin management capabilities while maintaining a clean separation between user and admin functionalities.

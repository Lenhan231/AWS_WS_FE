# Seed Mock Users Guide

## Problem

Bạn có **mock data trong PostgreSQL** (users, gyms, offers) nhưng:
- Users trong PostgreSQL **không có password** (password ở Cognito)
- Mock Cognito có pre-seeded users nhưng **không match với PostgreSQL users**
- Gyms và Offers có **foreign keys** tới users

## Solution

Seed Mock Cognito với users từ PostgreSQL để có thể login và test với real data.

## Method 1: Using UI Tool (Recommended) ⭐

### Step 1: Open App

```bash
npm run dev
```

### Step 2: Click Database Icon

Ở góc dưới bên phải màn hình, click vào icon **Database** (màu cam).

### Step 3: Seed Users

Click **"Seed Example Users"** để thêm 4 example users:

```
john.client@example.com / password123 (CLIENT_USER)
jane.trainer@example.com / password123 (PT_USER)
gym.owner@example.com / password123 (GYM_STAFF)
admin.user@example.com / password123 (ADMIN)
```

### Step 4: Login

Bây giờ bạn có thể login với bất kỳ user nào đã seed!

## Method 2: Using Browser Console

### Step 1: Open Console

Press `F12` → Console tab

### Step 2: Seed Users

```javascript
// Seed example users
seedExampleUsers();

// Or seed custom users
const myUsers = [
  {
    id: 1,
    email: 'user1@example.com',
    firstName: 'User',
    lastName: 'One',
    phoneNumber: '+1234567890',
    role: 'CLIENT_USER',
  },
  {
    id: 2,
    email: 'user2@example.com',
    firstName: 'User',
    lastName: 'Two',
    role: 'PT_USER',
  },
];

seedMockUsers(myUsers, 'password123');
```

### Step 3: List Users

```javascript
// List all mock users
listMockUsers();
```

### Step 4: Clear Users (if needed)

```javascript
// Clear all mock users
clearMockUsers();
```

## Method 3: Seed from PostgreSQL Data

### Step 1: Get Users from PostgreSQL

```sql
-- In your PostgreSQL database
SELECT id, email, first_name, last_name, phone_number, role
FROM users;
```

### Step 2: Convert to JavaScript Array

```javascript
const postgresUsers = [
  {
    id: 1,
    email: 'real.user@example.com',
    firstName: 'Real',
    lastName: 'User',
    phoneNumber: '+1234567890',
    role: 'CLIENT_USER',
  },
  // ... more users from your database
];
```

### Step 3: Seed to Mock Cognito

```javascript
// In browser console
seedMockUsers(postgresUsers, 'password123');
```

## How It Works

### Mock Cognito Storage

Mock Cognito stores users in **localStorage**:

```javascript
// Storage key
localStorage.getItem('mock_users');

// Format
[
  {
    id: 'mock-user-1',
    email: 'user@example.com',
    password: 'cGFzc3dvcmQxMjM=', // Base64 encoded
    firstName: 'User',
    lastName: 'Name',
    phoneNumber: '+1234567890',
    role: 'CLIENT_USER',
    confirmed: true,
    createdAt: '2025-01-21T...',
    updatedAt: '2025-01-21T...',
  },
  // ... more users
]
```

### Login Flow

```
1. User enters email/password
   ↓
2. Mock Cognito checks localStorage
   ↓
3. Validates password (Base64 decode & compare)
   ↓
4. Generates JWT token
   ↓
5. Frontend calls backend API with token
   ↓
6. Backend returns user profile from PostgreSQL
```

### Data Relationship

```
Mock Cognito (localStorage)     PostgreSQL
─────────────────────────       ──────────
user@example.com                users table
password: password123           - id: 1
                                - email: user@example.com
                                - firstName: User
                                - lastName: Name
                                - role: CLIENT_USER
                                
                                gyms table
                                - id: 1
                                - name: My Gym
                                - createdBy: 1 (user id)
                                
                                offers table
                                - id: 1
                                - title: Special Offer
                                - createdBy: 1 (user id)
```

## Use Cases

### Use Case 1: Test with Real Gym Data

```javascript
// 1. Get gym owner from PostgreSQL
const gymOwner = {
  id: 5,
  email: 'gym.owner@realgym.com',
  firstName: 'John',
  lastName: 'Owner',
  role: 'GYM_STAFF',
};

// 2. Seed to Mock Cognito
seedMockUsers([gymOwner]);

// 3. Login as gym owner
// Email: gym.owner@realgym.com
// Password: password123

// 4. Now you can see real gyms created by this user!
```

### Use Case 2: Test with Real Trainer Data

```javascript
// 1. Get trainer from PostgreSQL
const trainer = {
  id: 10,
  email: 'trainer@fitness.com',
  firstName: 'Jane',
  lastName: 'Trainer',
  role: 'PT_USER',
};

// 2. Seed to Mock Cognito
seedMockUsers([trainer]);

// 3. Login as trainer
// Email: trainer@fitness.com
// Password: password123

// 4. Now you can see real offers created by this trainer!
```

### Use Case 3: Test with Multiple Users

```javascript
// Seed all users from PostgreSQL at once
const allPostgresUsers = [
  { id: 1, email: 'user1@example.com', firstName: 'User', lastName: 'One', role: 'CLIENT_USER' },
  { id: 2, email: 'user2@example.com', firstName: 'User', lastName: 'Two', role: 'PT_USER' },
  { id: 3, email: 'user3@example.com', firstName: 'User', lastName: 'Three', role: 'GYM_STAFF' },
  // ... all users
];

seedMockUsers(allPostgresUsers);

// Now you can login as any user!
```

## UI Tool Features

### Seed Example Users
- Adds 4 pre-configured example users
- All with password: `password123`
- Different roles: CLIENT, PT, GYM_STAFF, ADMIN

### List All Users
- Shows all users in Mock Cognito
- Displays email, name, role
- Shows password (always `password123`)

### Clear All Users
- Removes all users from Mock Cognito
- Requires confirmation
- Use with caution!

## Default Password

All seeded users have the same default password:

```
password123
```

You can change this when seeding:

```javascript
seedMockUsers(users, 'myCustomPassword');
```

## Troubleshooting

### Issue: Can't login with seeded user

**Check:**
1. User was seeded successfully (check console message)
2. Using correct password (`password123` by default)
3. Mock Cognito mode is active (check banner at top)

**Solution:**
```javascript
// List users to verify
listMockUsers();

// Check if user exists
const users = JSON.parse(localStorage.getItem('mock_users') || '[]');
console.log(users.find(u => u.email === 'your.email@example.com'));
```

### Issue: Seeded user not showing in list

**Check:**
1. User email is unique (no duplicates)
2. localStorage has space available
3. Browser allows localStorage

**Solution:**
```javascript
// Clear and re-seed
clearMockUsers();
seedMockUsers(yourUsers);
```

### Issue: User exists but can't see their gyms/offers

**Cause:** User ID mismatch between Mock Cognito and PostgreSQL

**Solution:**
Make sure the Mock Cognito user ID matches the PostgreSQL user ID:

```javascript
const user = {
  id: 5, // Must match PostgreSQL user.id
  email: 'user@example.com',
  // ...
};

seedMockUsers([user]);
```

The seeded user will have ID: `mock-user-5` which should match foreign keys in gyms/offers tables.

## Best Practices

### 1. Seed All PostgreSQL Users at Once

```javascript
// Get all users from PostgreSQL
// Then seed them all
seedMockUsers(allPostgresUsers);
```

### 2. Use Consistent Password

Always use `password123` for development to avoid confusion.

### 3. Document Seeded Users

Keep a list of seeded users for your team:

```javascript
// team-users.js
export const teamUsers = [
  { id: 1, email: 'dev1@team.com', firstName: 'Dev', lastName: 'One', role: 'ADMIN' },
  { id: 2, email: 'dev2@team.com', firstName: 'Dev', lastName: 'Two', role: 'GYM_STAFF' },
  // ...
];
```

### 4. Clear Before Re-seeding

```javascript
// Clear old users before seeding new ones
clearMockUsers();
seedMockUsers(newUsers);
```

## Integration with PostgreSQL

### Automatic Sync (Future Enhancement)

In the future, we can add automatic sync:

```javascript
// Fetch users from backend API
const response = await fetch('/api/v1/users');
const postgresUsers = await response.json();

// Seed to Mock Cognito
seedMockUsers(postgresUsers);
```

### Manual Sync (Current)

For now, manually copy users from PostgreSQL:

1. Query PostgreSQL for users
2. Copy user data
3. Seed to Mock Cognito via UI or console

## Related Documentation

- [Auth Modes Guide](./AUTH_MODES.md)
- [Mock Auth Setup](./MOCK_AUTH_SETUP.md)
- [Email Confirmation](./EMAIL_CONFIRMATION.md)

## Summary

✅ **Seed users from PostgreSQL to Mock Cognito**
✅ **Login with any seeded user**
✅ **Test with real gyms and offers data**
✅ **Easy UI tool for seeding**
✅ **Default password: password123**

---

**Tool Location:** Bottom-right corner (Database icon)
**Default Password:** `password123`
**Storage:** Browser localStorage

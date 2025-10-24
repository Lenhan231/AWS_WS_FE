# Seed Mock Users - Quick Start 🚀

## Problem Solved

✅ **PostgreSQL có users nhưng không có password**
✅ **Mock Cognito cần users để login**
✅ **Gyms và Offers cần users để test**

## Solution: Seed Tool

Một UI tool đơn giản để seed users vào Mock Cognito!

## Quick Start (3 Steps)

### 1. Start App

```bash
npm run dev
```

### 2. Click Database Icon

Ở góc **dưới bên phải** màn hình, click vào icon **Database** (màu cam 🟠).

### 3. Seed Users

Click **"Seed Example Users"** → Done! ✅

## Test Login

Bây giờ login với bất kỳ user nào:

```
Email: john.client@example.com
Password: password123

Email: jane.trainer@example.com
Password: password123

Email: gym.owner@example.com
Password: password123

Email: admin.user@example.com
Password: password123
```

## Seed Your PostgreSQL Users

### Option 1: Using UI Tool

1. Click Database icon
2. Click "Seed Example Users"
3. Done!

### Option 2: Using Browser Console

```javascript
// Press F12 → Console

// Your PostgreSQL users
const myUsers = [
  {
    id: 1,
    email: 'real.user@example.com',
    firstName: 'Real',
    lastName: 'User',
    phoneNumber: '+1234567890',
    role: 'CLIENT_USER',
  },
  // ... more users
];

// Seed them
seedMockUsers(myUsers, 'password123');
```

## Features

### 🌱 Seed Example Users
- 4 pre-configured users
- All roles: CLIENT, PT, GYM_STAFF, ADMIN
- Password: `password123`

### 📋 List All Users
- See all seeded users
- Check emails and roles
- Verify passwords

### 🗑️ Clear All Users
- Remove all users
- Start fresh
- Requires confirmation

## How It Works

```
PostgreSQL Users          Mock Cognito (localStorage)
────────────────          ───────────────────────────
id: 1                     id: 'mock-user-1'
email: user@example.com   email: user@example.com
firstName: User           password: 'password123' (Base64)
lastName: Name            firstName: User
role: CLIENT_USER         lastName: Name
                          role: CLIENT_USER
                          confirmed: true
```

## Use Cases

### Test with Real Gym Data

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

// 3. Login and see real gyms!
```

### Test with Real Trainer Data

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

// 3. Login and see real offers!
```

## Default Password

All seeded users use the same password:

```
password123
```

Easy to remember! 🔑

## Troubleshooting

### Can't see Database icon?

**Check:**
- Mock Cognito mode is active (see orange banner at top)
- `.env.local` has `NEXT_PUBLIC_USE_MOCK_AUTH=true`

### Can't login with seeded user?

**Check:**
1. User was seeded (check console message)
2. Using password: `password123`
3. Email is correct

**Solution:**
```javascript
// List users to verify
listMockUsers();
```

### User exists but can't see their data?

**Cause:** User ID mismatch

**Solution:**
Make sure Mock Cognito user ID matches PostgreSQL user ID:

```javascript
const user = {
  id: 5, // Must match PostgreSQL user.id
  email: 'user@example.com',
  // ...
};
```

## Console Commands

```javascript
// Seed users
seedMockUsers(users, 'password123');

// Seed examples
seedExampleUsers();

// List all users
listMockUsers();

// Clear all users
clearMockUsers();
```

## Best Practices

1. **Seed all PostgreSQL users at once**
2. **Use password: `password123`**
3. **Clear before re-seeding**
4. **Document your seeded users**

## Summary

✅ **UI tool ở góc dưới phải**
✅ **Seed example users với 1 click**
✅ **Default password: password123**
✅ **Test với real data từ PostgreSQL**

---

**Tool Location:** Bottom-right corner 🟠
**Default Password:** `password123` 🔑
**Documentation:** `docs/SEED_MOCK_USERS.md`

**Start now:** `npm run dev` 🚀

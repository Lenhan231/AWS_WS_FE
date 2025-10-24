# PostgreSQL to Mock Cognito Seed - Complete ✅

## Summary

Successfully analyzed Flyway migrations and created seed script to sync PostgreSQL users with Mock Cognito!

## What Was Analyzed

### Flyway Migration Files

1. **V0__create_core_tables.sql** - Database schema
   - Users table structure
   - Gyms, PT users, Client users tables
   - Offers, Ratings, Reports tables
   - Relationships and foreign keys

2. **V3__seed_minimal_data.sql** - Minimal seed data
   - 3 core users: admin, gym owner, PT trainer
   - 1 gym: EasyBody Downtown Club
   - 2 offers: Gym membership + PT coaching

3. **R__seed_mock_data.sql** - Mock data for testing
   - 15 gyms with staff
   - 15 PT trainers
   - 15 clients
   - Offers, ratings, reports

## PostgreSQL Users Discovered

### Minimal Users (3)

```sql
-- From V3__seed_minimal_data.sql
1. admin@easybody.com (ADMIN)
   - System Admin
   - Phone: +8488880001

2. owner@easybody.com (GYM_STAFF)
   - Linh Tran
   - Phone: +8488880002
   - Manages: EasyBody Downtown Club

3. trainer@easybody.com (PT_USER)
   - Minh Nguyen
   - Phone: +8488880003
   - Specializations: Strength, Fat Loss, Mobility
```

### Mock Users (45)

```sql
-- From R__seed_mock_data.sql
-- 15 iterations × 3 roles = 45 users

Gym Staff (15):
- mock.staff1@easybody.com to mock.staff15@easybody.com
- Each manages a mock gym

PT Users (15):
- mock.pt1@easybody.com to mock.pt15@easybody.com
- Each has PT profile with offers

Client Users (15):
- mock.client1@easybody.com to mock.client15@easybody.com
- Each has fitness goals and ratings
```

## Total: 48 Users

- **1 Admin**
- **16 Gym Staff** (1 real + 15 mock)
- **16 PT Users** (1 real + 15 mock)
- **15 Client Users** (all mock)

## Implementation

### Files Created

1. **scripts/seed-from-postgres.ts**
   - Extracts users from Flyway migrations
   - Converts to Mock Cognito format
   - Provides seed functions

2. **Updated components/dev/SeedMockUsers.tsx**
   - Added "Seed Minimal Users (3)" button
   - Added "Seed All PostgreSQL (48)" button
   - Shows PostgreSQL user counts

### Seed Functions

```typescript
// Seed minimal users (3)
seedMinimalUsers('password123');

// Seed all PostgreSQL users (48)
seedAllPostgresUsers('password123');

// Get users by role
getUsersByRole('PT_USER'); // Returns 16 PT users

// List all users
listPostgresUsers(); // Shows all 48 users
```

## How to Use

### Method 1: UI Tool (Easiest) ⭐

1. Start app: `npm run dev`
2. Click Database icon (bottom-right)
3. Choose:
   - **"Seed Minimal Users (3)"** - Quick start
   - **"Seed All PostgreSQL (48)"** - Full dataset

### Method 2: Browser Console

```javascript
// Press F12 → Console

// Seed minimal users
seedMinimalUsers();

// Seed all PostgreSQL users
seedAllPostgresUsers();

// List all users
listPostgresUsers();
```

## Login Credentials

All seeded users have the same password:

```
Password: password123
```

### Minimal Users

```
Email: admin@easybody.com
Password: password123
Role: ADMIN

Email: owner@easybody.com
Password: password123
Role: GYM_STAFF

Email: trainer@easybody.com
Password: password123
Role: PT_USER
```

### Mock Users

```
Email: mock.staff1@easybody.com to mock.staff15@easybody.com
Password: password123
Role: GYM_STAFF

Email: mock.pt1@easybody.com to mock.pt15@easybody.com
Password: password123
Role: PT_USER

Email: mock.client1@easybody.com to mock.client15@easybody.com
Password: password123
Role: CLIENT_USER
```

## Data Relationships

### Gyms → Gym Staff

```
EasyBody Downtown Club (gym_id: 1)
└── owner@easybody.com (user_id: 2)

Mock Gym #1 (gym_id: 2)
└── mock.staff1@easybody.com (user_id: 4)

Mock Gym #2 (gym_id: 3)
└── mock.staff2@easybody.com (user_id: 7)

... (15 mock gyms total)
```

### Offers → Creators

```
Gym Offers:
- Created by gym_id (gym staff)
- mock.staff1@easybody.com → Mock Gym Offer #2
- mock.staff2@easybody.com → Mock Gym Offer #4
- ...

PT Offers:
- Created by pt_user_id (PT trainers)
- trainer@easybody.com → 12-Session Personal Coaching
- mock.pt1@easybody.com → Mock PT Offer #1
- mock.pt2@easybody.com → Mock PT Offer #3
- ...
```

### Ratings → Clients

```
Clients rate offers:
- mock.client1@easybody.com → rated Mock Gym Offer #2
- mock.client2@easybody.com → rated Mock PT Offer #3
- ...
```

## User ID Mapping

Mock Cognito IDs match PostgreSQL IDs:

```
PostgreSQL: user.id = 1
Mock Cognito: id = 'mock-user-1'

PostgreSQL: user.id = 5
Mock Cognito: id = 'mock-user-5'
```

This ensures foreign keys work correctly!

## Testing Scenarios

### Test as Admin

```
Login: admin@easybody.com / password123
Can:
- View all users, gyms, offers
- Moderate offers
- Review reports
- Manage system
```

### Test as Gym Owner

```
Login: owner@easybody.com / password123
Can:
- Manage EasyBody Downtown Club
- Create gym offers
- Approve PT associations
- View gym analytics
```

### Test as PT Trainer

```
Login: trainer@easybody.com / password123
Can:
- Manage PT profile
- Create PT offers
- View client ratings
- Apply to gyms
```

### Test as Mock Gym Staff

```
Login: mock.staff1@easybody.com / password123
Can:
- Manage Mock Gym #1
- Create gym offers
- View gym members
```

### Test as Mock PT

```
Login: mock.pt1@easybody.com / password123
Can:
- Manage PT profile
- Create PT offers
- View ratings
```

### Test as Mock Client

```
Login: mock.client1@easybody.com / password123
Can:
- Browse gyms and offers
- Rate offers
- Submit reports
- View fitness goals
```

## Database Schema Insights

### Users Table

```sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    cognito_sub VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(30),
    role VARCHAR(32) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    profile_image_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

**Key Points:**
- `cognito_sub` is unique identifier from Cognito
- `email` is unique and used for login
- `role` determines permissions
- No password stored (handled by Cognito)

### Relationships

```
users (1) → (1) pt_users
users (1) → (1) client_users
users (1) → (N) gym_staff
gyms (1) → (N) gym_staff
gyms (1) → (N) offers
pt_users (1) → (N) offers
offers (1) → (N) ratings
users (1) → (N) ratings
```

## Benefits

### ✅ Exact Match with PostgreSQL

- User IDs match exactly
- Emails match exactly
- Roles match exactly
- Phone numbers match exactly

### ✅ Test with Real Data

- Login as any PostgreSQL user
- See real gyms created by users
- See real offers created by users
- See real ratings from clients

### ✅ Complete Dataset

- 48 users covering all roles
- 16 gyms with staff
- 16 PT trainers with profiles
- 30+ offers (gym + PT)
- Ratings and reports

### ✅ Easy Seeding

- 1-click UI tool
- Or browser console commands
- Choose minimal or full dataset

## Troubleshooting

### Issue: Can't see gyms for gym owner

**Check:**
1. Seeded correct user
2. User ID matches gym foreign key
3. Gym is active and verified

**Solution:**
```javascript
// Verify user ID
const users = JSON.parse(localStorage.getItem('mock_users') || '[]');
const owner = users.find(u => u.email === 'owner@easybody.com');
console.log('Owner ID:', owner.id); // Should be 'mock-user-2'
```

### Issue: Can't see offers for PT trainer

**Check:**
1. PT user has pt_users profile
2. Offers reference correct pt_user_id
3. Offers are approved and active

**Solution:**
```javascript
// Check PT user
const trainer = users.find(u => u.email === 'trainer@easybody.com');
console.log('Trainer ID:', trainer.id); // Should be 'mock-user-3'
```

### Issue: Mock users not showing data

**Cause:** User IDs don't match PostgreSQL

**Solution:**
Make sure to seed users with correct IDs from Flyway migrations.

## Next Steps

### For Development

1. ✅ Seed minimal users for quick testing
2. ✅ Or seed all users for full dataset
3. ✅ Login and test features
4. ✅ Data relationships work correctly

### For Production

1. Use Real Cognito (not Mock)
2. Users register through UI
3. Cognito manages passwords
4. Backend syncs with PostgreSQL

## Related Documentation

- [Seed Mock Users Guide](./SEED_MOCK_USERS.md)
- [Auth Modes Guide](./AUTH_MODES.md)
- [Mock Auth Setup](./MOCK_AUTH_SETUP.md)

## Summary

✅ **Analyzed Flyway migrations**
✅ **Extracted 48 PostgreSQL users**
✅ **Created seed script**
✅ **Updated UI tool**
✅ **User IDs match exactly**
✅ **Data relationships work**
✅ **Ready to test!**

---

**Total Users:** 48 (3 minimal + 45 mock)
**Default Password:** `password123`
**Tool Location:** Bottom-right corner (Database icon)
**Start:** `npm run dev` 🚀

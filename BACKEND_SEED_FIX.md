# Backend Seed Fix - Admin User Missing

## Problem
`/api/v1/auth/me` returns 404 because the admin user with `cognito_sub = 'seed-admin-sub'` doesn't exist in the database.

## Root Cause
The backend was updated to look for the seeded admin user by `cognito_sub = 'seed-admin-sub'` in Basic Auth mode, but the database migration hasn't run or the seed data wasn't created.

## Quick Fix Options

### Option 1: Run the SQL Script (Fastest)

Connect to your PostgreSQL database and run:

```bash
psql -U your_username -d your_database -f fix-admin-user.sql
```

Or if using Docker:

```bash
docker exec -i your_postgres_container psql -U postgres -d easybody < fix-admin-user.sql
```

### Option 2: Run Flyway Migration

If you're using Gradle:

```bash
./gradlew flywayMigrate -Pprofile=local
```

Or if you need to clean and re-migrate:

```bash
./gradlew flywayClean flywayMigrate -Pprofile=local
```

### Option 3: Manual SQL Insert

Connect to your database and run:

```sql
INSERT INTO users (cognito_sub, email, first_name, last_name, phone_number, role, active, created_at, updated_at)
VALUES ('seed-admin-sub', 'admin@easybody.com', 'System', 'Admin', '+8488880001', 'ADMIN', TRUE, NOW(), NOW())
ON CONFLICT (email) DO UPDATE SET
    cognito_sub = 'seed-admin-sub',
    role = 'ADMIN',
    updated_at = NOW();
```

## Verify the Fix

After running any of the above options, test:

```bash
curl -u local-admin:local-password http://localhost:8080/api/v1/auth/me
```

Expected response:
```json
{
  "id": 1,
  "cognitoSub": "seed-admin-sub",
  "email": "admin@easybody.com",
  "firstName": "System",
  "lastName": "Admin",
  "phoneNumber": "+8488880001",
  "role": "ADMIN",
  "active": true,
  "createdAt": "2025-10-21T...",
  "updatedAt": "2025-10-21T..."
}
```

## What the Backend Does Now

In Basic Auth mode, the backend:
1. Receives request with `Authorization: Basic bG9jYWwtYWRtaW46bG9jYWwtcGFzc3dvcmQ=`
2. Validates credentials (local-admin / local-password)
3. Looks up user by `cognito_sub = 'seed-admin-sub'`
4. Returns the admin user profile

## Frontend Configuration

Your frontend is already configured correctly:

```env
NEXT_PUBLIC_USE_COGNITO=false
NEXT_PUBLIC_USE_MOCK_AUTH=false
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api/v1
NEXT_PUBLIC_BASIC_USER=local-admin
NEXT_PUBLIC_BASIC_PASS=local-password
```

## After Fixing

1. **Verify backend**: `curl -u local-admin:local-password http://localhost:8080/api/v1/auth/me`
2. **Start frontend**: `npm run dev`
3. **Navigate to**: `http://localhost:3000/dashboard/admin`
4. **Check console**: Should see "Basic Auth user loaded: admin@easybody.com ADMIN"

## Troubleshooting

### Still getting 404?
- Check if the user exists: `SELECT * FROM users WHERE cognito_sub = 'seed-admin-sub';`
- Check backend logs for errors
- Verify database connection in backend

### Getting 401?
- Check Basic Auth credentials match between frontend and backend
- Verify backend has Basic Auth enabled: `app.auth.basic.enabled=true`

### Database connection issues?
- Check if PostgreSQL is running
- Verify connection string in backend `application.properties`
- Check if database exists

## Database Connection Examples

### Docker PostgreSQL
```bash
docker exec -it your_postgres_container psql -U postgres -d easybody
```

### Local PostgreSQL
```bash
psql -U postgres -d easybody
```

### Check if user exists
```sql
SELECT id, cognito_sub, email, role FROM users WHERE email = 'admin@easybody.com';
```

## Complete Reset (Nuclear Option)

If nothing works, reset everything:

```bash
# 1. Stop backend
# 2. Drop and recreate database
docker exec -it your_postgres_container psql -U postgres -c "DROP DATABASE IF EXISTS easybody;"
docker exec -it your_postgres_container psql -U postgres -c "CREATE DATABASE easybody;"

# 3. Run migrations
./gradlew flywayMigrate -Pprofile=local

# 4. Restart backend
# 5. Verify: curl -u local-admin:local-password http://localhost:8080/api/v1/auth/me
```

## Files Reference

- Migration: `db/migration/V3__seed_minimal_data.sql`
- Quick fix: `fix-admin-user.sql`
- Frontend config: `.env.local`
- Backend config: `application.properties` or `application-local.properties`

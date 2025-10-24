# Quick Fix Checklist - Get Everything Working

## Current Status
- ✅ Frontend configured for Basic Auth mode
- ✅ Backend updated to handle Basic Auth
- ❌ Admin user missing from database (404 error)

## Fix Steps

### Step 1: Add Admin User to Database

Choose ONE method:

#### Method A: SQL Script (Recommended)
```bash
# If using Docker PostgreSQL:
docker exec -i your_postgres_container psql -U postgres -d easybody < fix-admin-user.sql

# If using local PostgreSQL:
psql -U postgres -d easybody -f fix-admin-user.sql
```

#### Method B: Manual SQL
Connect to your database and run:
```sql
INSERT INTO users (cognito_sub, email, first_name, last_name, phone_number, role, active, created_at, updated_at)
VALUES ('seed-admin-sub', 'admin@easybody.com', 'System', 'Admin', '+8488880001', 'ADMIN', TRUE, NOW(), NOW())
ON CONFLICT (email) DO UPDATE SET cognito_sub = 'seed-admin-sub', role = 'ADMIN', updated_at = NOW();
```

#### Method C: Run Flyway Migration
```bash
./gradlew flywayMigrate -Pprofile=local
```

### Step 2: Verify Backend
```bash
curl -u local-admin:local-password http://localhost:8080/api/v1/auth/me
```

Expected: `200 OK` with admin user JSON

### Step 3: Start Frontend
```bash
npm run dev
```

### Step 4: Test
Navigate to: `http://localhost:3000/dashboard/admin`

## Success Criteria

✅ Backend returns 200 for `/api/v1/auth/me`
✅ Frontend loads with CSS styling
✅ Console shows: "Basic Auth user loaded: admin@easybody.com ADMIN"
✅ Dashboard displays without errors
✅ No "Request aborted" errors

## If Still Not Working

### Backend Issues
- Check if PostgreSQL is running
- Check backend logs for errors
- Verify `application.properties` has Basic Auth enabled

### Frontend Issues
- Did you restart dev server after changing `.env.local`?
- Check Network tab - requests should go to `localhost:8080`
- Check console for error messages

### Database Issues
- Verify database exists: `psql -U postgres -l`
- Check if user exists: `SELECT * FROM users WHERE email = 'admin@easybody.com';`
- Check migrations ran: `SELECT * FROM flyway_schema_history;`

## Documentation

- `BACKEND_SEED_FIX.md` - Detailed database fix guide
- `FIX_SUMMARY.md` - Complete fix overview
- `BASIC_AUTH_QUICKSTART.md` - Basic Auth mode guide
- `CHECKLIST.md` - Full testing checklist

## Quick Commands Reference

```bash
# Kill ports
lsof -ti:3000 | xargs kill -9
lsof -ti:3001 | xargs kill -9

# Test backend
curl -u local-admin:local-password http://localhost:8080/api/v1/auth/me

# Start frontend
npm run dev

# Check database
docker exec -it postgres_container psql -U postgres -d easybody
```

## Next Steps After Fix

1. ✅ Verify `/api/v1/auth/me` returns 200
2. ✅ Start frontend dev server
3. ✅ Navigate to admin dashboard
4. ✅ Confirm everything loads properly
5. 🎉 Start developing!

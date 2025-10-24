# ⚠️ RESTART REQUIRED ⚠️

## Your frontend dev server MUST be restarted!

Environment variable changes in `.env.local` only take effect when the dev server starts.

## How to Restart

### 1. Stop the Current Server
Press `Ctrl+C` in the terminal running the dev server

### 2. Start It Again
```bash
npm run dev
```
or
```bash
yarn dev
```

### 3. Wait for "Ready"
You should see:
```
✓ Ready in 2.5s
○ Local:   http://localhost:3000
```

## What Changed?

### Before (Mock Auth Mode)
```
Browser → http://localhost:3000/auth/login → 404 Error
Browser → http://localhost:3000/gyms → Request Aborted
Browser → http://localhost:3000/pt-users → Request Aborted
```

### After (Basic Auth Mode)
```
Browser → http://localhost:8080/api/v1/auth/me → 200 OK
Browser → http://localhost:8080/api/v1/gyms → 200 OK
Browser → http://localhost:8080/api/v1/pt-users → 200 OK
```

## Test After Restart

1. Navigate to: `http://localhost:3000/dashboard/admin`
2. Check browser console - should see:
   ```
   [AUTH] Using Basic Auth mode - getting user from backend
   [AUTH] Basic Auth user loaded: local-admin@easybody.com ADMIN
   ```
3. Check Network tab - requests should go to `localhost:8080` with 200 status

## Still Having Issues?

See `FIX_SUMMARY.md` for complete troubleshooting guide.

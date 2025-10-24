# Mock Authentication - Quick Start 🚀

## TL;DR

Enable mock authentication for local development without AWS Cognito:

```bash
# 1. Create .env.local
echo "NEXT_PUBLIC_USE_MOCK_AUTH=true" > .env.local
echo "NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api/v1" >> .env.local

# 2. Start dev server
npm run dev

# 3. Login with test user
# Email: client@test.com
# Password: password123
```

## Test Users

| Email | Password | Role |
|-------|----------|------|
| `client@test.com` | `password123` | CLIENT_USER |
| `gym@test.com` | `password123` | GYM_STAFF |
| `trainer@test.com` | `password123` | PT_USER |
| `admin@test.com` | `password123` | ADMIN |

## Backend Setup

In your backend `application-local.yml`:

```yaml
aws:
  enabled: false  # Disable Cognito

app:
  auth:
    basic:
      enabled: true  # Enable Basic Auth
```

## What You Get

✅ No AWS credentials needed  
✅ Pre-seeded test users  
✅ Instant authentication  
✅ Full feature parity with real Cognito  
✅ Console logging for debugging  
✅ Session persistence  

## Switch to Real Cognito

```bash
# .env.local
NEXT_PUBLIC_USE_MOCK_AUTH=false
NEXT_PUBLIC_COGNITO_USER_POOL_ID=your-pool-id
NEXT_PUBLIC_COGNITO_CLIENT_ID=your-client-id
```

## Documentation

- **Full Setup Guide:** `docs/MOCK_AUTH_SETUP.md`
- **Implementation Details:** `docs/MOCK_AUTH_IMPLEMENTATION_COMPLETE.md`
- **Auth Flow:** `docs/AUTH_FLOW_FIX.md`

## Troubleshooting

**"Auth UserPool not configured"**  
→ Set `AWS_ENABLED=false` in backend

**"401 Unauthorized"**  
→ Enable Basic Auth in backend

**Mock users not showing**  
→ Clear localStorage and refresh

---

**That's it!** You're ready to develop with mock authentication. 🎉

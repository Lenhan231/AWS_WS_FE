# Email Confirmation - Quick Start Guide 🚀

## TL;DR

Email confirmation flow **chỉ hoạt động với Real Cognito mode**. Mock Cognito và Basic Auth mode tự động skip confirmation.

## ⚠️ Important: When Email Confirmation is Used

| Mode | Email Confirmation | Use Case |
|------|-------------------|----------|
| **Basic Auth** | ❌ No (no registration) | API testing |
| **Mock Cognito** | ❌ No (auto-confirmed) | Development |
| **Real Cognito** | ✅ Yes (required) | Production |

## Quick Test (Mock Mode - Recommended for Dev)

### 1. Đăng ký user mới

```bash
# Đảm bảo Mock mode đang bật
# File: .env.local
NEXT_PUBLIC_USE_COGNITO=true
NEXT_PUBLIC_USE_MOCK_AUTH=true
```

1. Truy cập: http://localhost:3000/auth/register
2. Điền form đăng ký
3. Submit → **Tự động confirm** → Dashboard ✅

**Không cần nhập mã xác thực!**

### 2. Test confirmation page (Optional)

Nếu muốn test confirmation page trong Mock mode:

1. Truy cập trực tiếp: http://localhost:3000/auth/confirm?email=test@example.com
2. Nhập bất kỳ mã 6 số nào (ví dụ: `123456`)
3. Submit → Auto sign-in → Dashboard ✅

## Test với Real Cognito

### 1. Cấu hình

```env
# File: .env.local
NEXT_PUBLIC_USE_COGNITO=true
NEXT_PUBLIC_USE_MOCK_AUTH=false
NEXT_PUBLIC_COGNITO_USER_POOL_ID=your-pool-id
NEXT_PUBLIC_COGNITO_CLIENT_ID=your-client-id
NEXT_PUBLIC_COGNITO_REGION=us-east-1
```

### 2. Đăng ký user mới

1. Truy cập: http://localhost:3000/auth/register
2. Điền form với **email thật**
3. Submit → Redirect to `/auth/confirm`
4. Check email → Nhập mã 6 số
5. Submit → Auto sign-in → Dashboard ✅

### 3. Login với unconfirmed user

1. Đăng ký user nhưng không confirm
2. Truy cập: http://localhost:3000/auth/login
3. Nhập email/password
4. Submit → Redirect to `/auth/confirm`
5. Nhập mã → Confirm → Dashboard ✅

## Features

### ✅ Confirmation Page

- 6-digit code input với auto-submit
- Auto-focus trên input field
- Resend code button (60s cooldown)
- Error messages rõ ràng
- Success message trước khi redirect
- Auto sign-in sau khi confirm

### ✅ Mock Mode (Development)

- Tự động confirm users
- Không cần email infrastructure
- Logs mã xác thực ra console
- Pre-seeded test users

### ✅ Real Cognito Mode (Production)

- Gửi email xác thực qua AWS SES
- Validate mã xác thực thật
- Handle tất cả Cognito errors
- Resend code functionality

## User Flows

### Flow 1: Registration (Mock Mode)

```
Register → Auto-confirm → Dashboard
```

### Flow 2: Registration (Real Cognito)

```
Register → Confirmation Page → Enter Code → Dashboard
```

### Flow 3: Unconfirmed Login

```
Login → Redirect to Confirmation → Enter Code → Dashboard
```

## Error Messages

| Lỗi | Message |
|-----|---------|
| Mã sai | "Invalid confirmation code. Please check and try again." |
| Mã hết hạn | "Confirmation code expired. Please request a new one." |
| Quá nhiều lần thử | "Too many attempts. Please request a new code." |
| User không tồn tại | "User not found. Please register first." |
| Lỗi mạng | "Network error. Please check your connection and try again." |

## Resend Code

1. Click "Resend Code" button
2. Đợi 60 giây trước khi resend lại
3. Check email (hoặc console trong Mock mode)
4. Nhập mã mới

## Troubleshooting

### Issue: User bị stuck ở confirmation page

**Giải pháp:**
1. Check browser console
2. Verify email trong sessionStorage
3. Try resend code
4. Clear sessionStorage và thử lại

### Issue: Không nhận được email

**Giải pháp:**
1. Check spam folder
2. Verify email address đúng
3. Click "Resend Code"
4. Check AWS SES sending limits
5. Verify email verified trong SES (sandbox mode)

### Issue: Mock mode vẫn hiện confirmation page

**Giải pháp:**
1. Verify `NEXT_PUBLIC_USE_COGNITO=true` và `NEXT_PUBLIC_USE_MOCK_AUTH=true` trong `.env.local`
2. Restart dev server
3. Clear browser localStorage
4. Check console có warning "⚠️ MOCK AUTHENTICATION ACTIVE"

### Issue: "AuthUserPool not configured" error

**Nguyên nhân:** RealCognitoService đang được gọi nhưng chưa có config AWS Cognito

**Giải pháp:**
```bash
# Option 1: Dùng Mock Cognito (recommended for dev)
NEXT_PUBLIC_USE_COGNITO=true
NEXT_PUBLIC_USE_MOCK_AUTH=true

# Option 2: Dùng Basic Auth (API testing only)
NEXT_PUBLIC_USE_COGNITO=false
NEXT_PUBLIC_USE_MOCK_AUTH=false

# Option 3: Configure Real Cognito (production)
NEXT_PUBLIC_USE_COGNITO=true
NEXT_PUBLIC_USE_MOCK_AUTH=false
NEXT_PUBLIC_COGNITO_USER_POOL_ID=your-pool-id
NEXT_PUBLIC_COGNITO_CLIENT_ID=your-client-id
```

## API Usage

### Register

```typescript
const { register } = useAuthStore();

const result = await register({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  password: 'Password123',
  phoneNumber: '+1234567890',
  role: 'CLIENT_USER',
});

if (result?.needsConfirmation) {
  router.push(`/auth/confirm?email=${email}`);
}
```

### Login

```typescript
const { login } = useAuthStore();

const result = await login(email, password);

if (result?.needsConfirmation) {
  router.push(`/auth/confirm?email=${email}`);
}
```

### Confirm

```typescript
const confirmResult = await cognito.confirmSignUp(email, code);

if (confirmResult.success) {
  // Auto sign-in
  const signInResult = await cognito.signIn(email, password);
}
```

### Resend

```typescript
const resendResult = await cognito.resendConfirmationCode(email);

if (resendResult.success) {
  console.log('Code sent to:', resendResult.data?.destination);
}
```

## Files

### Created
- `app/auth/confirm/page.tsx` - Confirmation page
- `docs/EMAIL_CONFIRMATION.md` - Full documentation
- `docs/EMAIL_CONFIRMATION_IMPLEMENTATION_COMPLETE.md` - Implementation summary

### Modified
- `store/authStore.ts` - Updated register/login methods
- `app/auth/register/page.tsx` - Added confirmation redirect
- `app/auth/login/page.tsx` - Added confirmation redirect
- `lib/mockCognito.ts` - Auto-confirm in Mock mode
- `types/index.ts` - Added AuthActionResult type

## Pre-seeded Test Users (Mock Mode)

```
Email: client@test.com
Password: password123
Role: CLIENT_USER

Email: gym@test.com
Password: password123
Role: GYM_STAFF

Email: trainer@test.com
Password: password123
Role: PT_USER

Email: admin@test.com
Password: password123
Role: ADMIN
```

## Console Logs

### Mock Mode

```
[MOCK AUTH] User created and auto-confirmed: john@example.com
[AUTH] Step 1 complete: User created in Cognito
[AUTH] Step 2: Auto signing in (no confirmation needed)...
✅ Registration successful! User role: CLIENT_USER
```

### Real Cognito Mode

```
[AUTH] Step 1 complete: User created in Cognito
[AUTH] Email confirmation required
[CONFIRM] Confirming email for: john@example.com
[CONFIRM] Email confirmed successfully
[CONFIRM] Auto signing in with stored password
✅ Login successful! User role: CLIENT_USER
```

## Next Steps

1. ✅ Test trong Mock mode (đã hoàn thành)
2. ⏳ Test với real AWS Cognito trong staging
3. ⏳ Configure AWS SES cho production emails
4. ⏳ Customize email templates
5. ⏳ Add analytics tracking

## Documentation

- **Full Documentation**: `docs/EMAIL_CONFIRMATION.md`
- **Implementation Summary**: `docs/EMAIL_CONFIRMATION_IMPLEMENTATION_COMPLETE.md`
- **Spec Files**: `.kiro/specs/email-confirmation-flow/`

## Support

Nếu gặp vấn đề:
1. Check documentation: `docs/EMAIL_CONFIRMATION.md`
2. Check troubleshooting section
3. Check browser console logs
4. Check sessionStorage values
5. Try clearing cache và restart

---

**Status:** ✅ READY TO USE
**Mode:** Mock (Development) / Real Cognito (Production)
**Last Updated:** January 2025

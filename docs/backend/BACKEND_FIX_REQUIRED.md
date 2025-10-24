- [ ] Tất cả relationships đều có `as: 'aliasName'`

### 2. **Controllers**
- [ ] `controllers/auth.controller.js` - Fix `/auth/me` endpoint
- [ ] `controllers/user.controller.js` - Fix user queries
- [ ] `controllers/pt.controller.js` - Fix PT queries
- [ ] Mọi `include` đều có `as` matching với model

### 3. **Services**
- [ ] `services/user.service.js` - Fix findByPk, findOne queries
- [ ] `services/pt.service.js` - Fix PT lookups
- [ ] Replace `include: [Model]` → `include: [{ model: Model, as: 'alias' }]`

---

## 🚀 Sau Khi Backend Fix Xong

Frontend sẽ hoạt động hoàn hảo với:
- ✅ Login/Register không lỗi
- ✅ F5 refresh maintain session
- ✅ Token validation qua /auth/me
- ✅ Không còn Sequelize alias error
- ✅ Dashboard routing theo role

---

## 💡 Tips Cho Backend Dev

### Quick fix pattern:
```javascript
// BAD ❌
include: [PTUser, Gym, Offer]

// GOOD ✅
include: [
  { model: PTUser, as: 'ptUser' },
  { model: Gym, as: 'gym' },
  { model: Offer, as: 'offers' }
]
```

### Nested includes:
```javascript
include: [
  {
    model: PTUser,
    as: 'ptUser',
    include: [
      {
        model: Gym,
        as: 'gyms'  // PTUser can work at multiple gyms
      }
    ]
  }
]
```

---

## 📞 Support

Nếu backend vẫn gặp lỗi sau khi fix:
1. Check console.error logs từ frontend
2. Check backend logs để xem exact query
3. Verify alias names match giữa model definitions và queries
4. Test với Postman trước khi test trên frontend

Frontend đã sẵn sàng! Chỉ cần backend fix Sequelize associations là mọi thứ sẽ hoạt động! 🎉
# 🔧 Fix Backend Sequelize Error

## ⚠️ Lỗi Hiện Tại

**Lỗi:** "Người dùng được liên kết với PTUser bằng bí danh. Bạn phải sử dụng từ khóa 'as' để chỉ định bí danh trong câu lệnh include."

**Nguyên nhân:** Backend đang gọi Sequelize query mà không có alias khi join bảng `PTUser` với `User`.

**Vị trí lỗi:** Endpoint `/api/v1/auth/me` ở backend

---

## 🛠️ Cách Fix Backend

### Backend cần sửa trong model associations:

#### **Trước (SAI):**
```javascript
// user.model.js hoặc ptuser.model.js
User.hasOne(PTUser, { 
  foreignKey: 'userId' 
});

PTUser.belongsTo(User, { 
  foreignKey: 'userId' 
});
```

#### **Sau (ĐÚNG):**
```javascript
// user.model.js
User.hasOne(PTUser, { 
  foreignKey: 'userId',
  as: 'ptUser'  // ← THÊM ALIAS
});

// ptuser.model.js
PTUser.belongsTo(User, { 
  foreignKey: 'userId',
  as: 'user'  // ← THÊM ALIAS
});
```

### Backend cần sửa trong controller:

#### **File: auth.controller.js hoặc user.controller.js**

**Trước (SAI):**
```javascript
// GET /api/v1/auth/me
const user = await User.findByPk(userId, {
  include: [PTUser]  // ← SAI: Không có alias
});
```

**Sau (ĐÚNG):**
```javascript
// GET /api/v1/auth/me
const user = await User.findByPk(userId, {
  include: [
    {
      model: PTUser,
      as: 'ptUser'  // ← ĐÚNG: Có alias
    }
  ]
});
```

---

## ✅ Frontend Đã Fix

Frontend đã được cải thiện để:

### 1. **Graceful Error Handling**
- Bắt lỗi từ backend mà không crash app
- Xóa token không hợp lệ tự động
- Log chi tiết lỗi để debug

### 2. **Better API Interceptor**
```typescript
// lib/api.ts
- ✅ Log chi tiết mọi API error
- ✅ Handle 500 errors (Sequelize errors)
- ✅ Auto cleanup token khi auth endpoint fail
- ✅ Tránh infinite redirect loop
```

### 3. **Enhanced initializeAuth**
```typescript
// store/authStore.ts
- ✅ Validate user data trước khi set
- ✅ Clear token khi data invalid
- ✅ Catch mọi exception từ backend
- ✅ Prevent app crash
```

---

## 🧪 Test Sau Khi Fix Backend

### Test 1: Login thành công
```bash
# Request
POST http://localhost:8080/api/v1/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}

# Expected: Token được trả về
# Frontend sẽ lưu token và gọi /auth/me
```

### Test 2: Get current user
```bash
# Request
GET http://localhost:8080/api/v1/auth/me
Headers: Authorization: Bearer <token>

# Expected Response:
{
  "id": 1,
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "PT_USER",
  "ptUser": {  // ← Phải có alias này nếu là PT
    "id": 1,
    "bio": "...",
    "specializations": "...",
    ...
  }
}
```

### Test 3: F5 Refresh
```
1. Login vào app
2. Press F5
3. Expected: Vẫn đăng nhập (không bị đá về login page)
```

---

## 📝 Checklist Backend

Backend dev cần check các file sau:

### 1. **Models (associations)**
- [ ] `models/User.js` - Thêm alias cho PTUser association
- [ ] `models/PTUser.js` - Thêm alias cho User association
- [ ] `models/Gym.js` - Check các associations khác


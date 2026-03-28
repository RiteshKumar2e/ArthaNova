# Backend - auth.js (Middleware) - Complete Line-by-Line Explanation (Hinglish Mein)

## File Path
`backend/src/middlewares/auth.js`

---

## 📌 IMPORTS (Lines 1-2)

```javascript
import { verifyToken } from '../utils/auth.js';
import * as userService from '../services/userService.js';
```

✅ **Kya karta hai:**
- `verifyToken()` = JWT tokens ko decode aur validate karna
- `userService` = users ke liye database operations

---

## 🔐 AUTHENTICATE MIDDLEWARE (Lines 4-21)

```javascript
export const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ detail: 'Authentication required' });
  }
```

✅ **Kya karta hai:** Verify karna ki user ke paas valid token hai
- Request se `Authorization` header get karna
- Check karna ki `Bearer ` prefix se start hota hai
- Agar missing/invalid format hai toh 401 (Unauthorized) return karna

**Header format:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
                        ↑ Must start with "Bearer "
```

---

### EXTRACT & VERIFY TOKEN (Lines 8-12)

```javascript
  const token = authHeader.split(' ')[1];
  const payload = verifyToken(token);
  
  if (!payload || payload.type !== 'access') {
    return res.status(401).json({ detail: 'Invalid or expired token' });
  }
```

✅ **Kya karta hai:**
- Split karna `"Bearer token123"` → `token123` get karna
- `verifyToken()` = JWT ko decode aur signature check karna
- Check karna ki payload exist karti hai aur `type === 'access'` hai (refresh nahi)
- Agar invalid/expired hai toh 401 return karna

**Token verification:**
```
JWT = header.payload.signature

Verify:
1. Signature valid hai (tamper nahi hua)
2. Expire nahi hua
3. Format correct hai
```

---

### GET USER FROM DATABASE (Lines 14-16)

```javascript
  const user = await userService.getUserById(parseInt(payload.sub));
  if (!user || !user.is_active) {
    return res.status(401).json({ detail: 'User not found or inactive' });
  }
```

✅ **Kya karta hai:**
- Token se user ID extract karna (`payload.sub`)
- String se number convert karna (`parseInt`)
- Database mein user search karna
- Check karna ki user exist karta hai aur is_active = true hai
- Agar user deleted/deactivated hai toh 401 return karna

**Kyun database se query pakhadte ho?**
- Token ko akele trust nahi kar sakte (tamper ho sakta hai)
- Token issue hone ke baad user delete ho sakta hai
- User deactivated (banned) ho sakta hai
- Account status verify karna zaroori hai

---

### ATTACH USER & CONTINUE (Lines 18-19)

```javascript
  req.user = user;
  next();
};
```

✅ **Kya karta hai:**
- User object ko request mein add karna (`req.user`)
- Sab downstream middleware/routes ko available hota hai
- `next()` call karna agle middleware ko continue karne ke liye

**Ab route handlers yeh use kar sakte ho:**
```javascript
router.get('/me', authenticate, (req, res) => {
  // req.user yahan available hai
  console.log(req.user.email);
});
```

---

## 👑 ADMIN ONLY MIDDLEWARE (Lines 23-27)

```javascript
export const adminOnly = (req, res, next) => {
  if (!req.user || !req.user.is_admin) {
    return res.status(403).json({ detail: 'Admin privileges required' });
  }
  next();
};
```

✅ **Kya karta hai:** Verify karna ki user admin hai
- Check karna ki `req.user` exist karti hai (authenticate se set)
- Check karna ki `is_admin = true` hai (boolean field)
- Agar admin nahi hai toh 403 (Forbidden) return karna
- Agar admin hai toh continue karna

**Must be used AFTER `authenticate`:**
```javascript
// Galat order (fail hoga):
router.delete('/users/:id', adminOnly, authenticate, deleteUser);

// Sahi order:
router.delete('/users/:id', authenticate, adminOnly, deleteUser);
```

---

## 🔄 MIDDLEWARE CHAIN PATTERN

```javascript
// In routes/admin.js:
import { authenticate, adminOnly } from '../middlewares/auth.js';

adminRouter.delete('/users/:id', authenticate, adminOnly, async (req, res) => {
  // Sirf authenticated admins yahan tak pohanchte hain
  await deleteUser(req.params.id);
});
```

**Execution flow:**
```
Request: DELETE /api/v1/admin/users/5
   ↓
authenticate() middleware
├─ Authorization header se token extract karna
├─ JWT signature & expiry verify karna
├─ Database se user search karna
├─ is_active = true check karna
├─ Attach karna req.user = { id: 5, email: '...', is_admin: true, ... }
└─ Call next()
   ↓
adminOnly() middleware
├─ Check karna req.user exist karti hai aur is_admin = true hai
└─ Call next()
   ↓
Route handler (deleteUser)
├─ req.user access kar sakta hai
└─ Request process karna
   ↓
Send response
```

---

## 🔐 SECURITY FEATURES

### 1. **Token Verification:**
- ✅ Signature checked (tamper nahi hua)
- ✅ Expiry checked
- ✅ Type verified (access, nahi refresh)

### 2. **Database Validation:**
- ✅ User still exist karti hai
- ✅ User account deactivated nahi hai
- ✅ User ke paas abi admin status hai

### 3. **Status Codes:**
- 401 = Authentication fail (no token, invalid, expired)
- 403 = Authorization fail (authenticated lekin unprivileged)

### 4. **Token in Header:**
- ✅ URL mein nahi (logs mein aata)
- ✅ Body mein nahi (expose hone ka risk)
- ✅ Standard HTTP Bearer token format

---

## 📊 TOKEN TYPES & PURPOSE

### Access Token:
```javascript
{
  sub: '123',              // user ID
  email: 'user@example.com',
  type: 'access',          // Yeh access token hai
  iat: 1640000000,         // Issued at
  exp: 1640003600          // Expires at (1 hour baad)
}
```
- **Use:** API requests (`Authorization: Bearer {token}`)
- **Lifetime:** 1 hour (short-lived)
- **Kya prove karta hai:** User wo hi hai jo claim karta hai

### Refresh Token:
```javascript
{
  sub: '123',
  email: 'user@example.com',
  type: 'refresh',         // Yeh refresh token hai
  iat: 1640000000,
  exp: 1647603600          // Expires at (7 days baad)
}
```
- **Use:** Naya access token get karna
- **Lifetime:** 7 days (long-lived)
- **Kya prove karta hai:** Recently login hua

---

## 🔄 TOKEN REFRESH FLOW

```
User login karta hai → access_token (1h) + refresh_token (7d) milta hai

55 minutes baad:
├─ Access token abi 5 aur minutes valid hai
└─ API requests normally kaam karti hain

59 minutes baad:
├─ Access token 1 minute mein expire hoga
└─ Frontend expiry detect karta hai

60 minutes baad:
├─ Access token expire hota hai
├─ Agle API request par 401 aata hai
├─ Frontend refresh_token bhejta hai
├─ Backend naya access_token issue karta hai
├─ User re-login kiye bina continue kar sakte ho

7 days baad:
├─ Refresh token expire hota hai
├─ User ko fir se login karna padega
└─ Naye tokens milenge
```

---

## 💡 USAGE EXAMPLES

### Protect Public Route:
```javascript
router.get('/public-data', (req, res) => {
  // Authentication nahi chahiye
  res.json({ data: 'public' });
});
```

### Protect User Route:
```javascript
router.get('/me', authenticate, (req, res) => {
  // Sirf authenticated users
  // req.user available hai
  res.json(req.user);
});
```

### Protect Admin Route:
```javascript
router.delete('/users/:id', authenticate, adminOnly, (req, res) => {
  // Sirf authenticated AND admin users
  // req.user available hai
  deleteUser(req.params.id);
});
```

### Get User ID from Token:
```javascript
router.get('/profile', authenticate, (req, res) => {
  const userId = req.user.id;
  // req.user validate ho chuka hai
  // Safe to use
  getProfile(userId);
});
```

---

## 🔑 KEY CONCEPTS

**Authentication vs Authorization:**
- **Authentication:** "Are you who you claim?" (authenticate middleware)
- **Authorization:** "Are you allowed to do this?" (adminOnly middleware)

**Middleware Dependencies:**
- `adminOnly` depends on `authenticate`
- Must chain in correct order
- Authenticate first, then check permissions

**Token Validation:**
- Signature (wasn't tampered)
- Expiry (not expired)
- Type (access vs refresh)
- Database check (user still exists)

**Error Codes:**
- 401 = Invalid/expired/missing token
- 403 = Valid token but insufficient permissions

---

## 📝 RESPONSE EXAMPLES

### Missing Token:
```javascript
// Request: GET /api/v1/me
// Headers: (no Authorization)

// Response:
{
  "detail": "Authentication required"
}
// Status: 401
```

### Expired Token:
```javascript
// Request: GET /api/v1/me
// Headers: Authorization: Bearer eyJ... (expired)

// Response:
{
  "detail": "Invalid or expired token"
}
// Status: 401
```

### Valid Token, Not Admin:
```javascript
// Request: DELETE /api/v1/admin/users/5
// Headers: Authorization: Bearer eyJ... (valid, user not admin)

// Response:
{
  "detail": "Admin privileges required"
}
// Status: 403
```

### Valid Token, Admin:
```javascript
// Request: DELETE /api/v1/admin/users/5
// Headers: Authorization: Bearer eyJ... (valid, user is admin)

// Handler executes successfully
// req.user = { id: 123, email: '...', is_admin: true, ... }
```

---

## 🚀 BEST PRACTICES

✅ **DO:**
- Always authenticate before admin check
- Validate in database (not just token)
- Use 401/403 correctly
- Keep tokens short-lived
- Refresh tokens automatically
- Revoke tokens on logout

❌ **DON'T:**
- Trust token alone without DB check
- Chain adminOnly before authenticate
- Put token in URL
- Hard-code user IDs
- Use same secret for dev/prod
- Expose token in error messages


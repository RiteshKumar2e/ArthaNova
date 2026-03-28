# Backend - authController.js - Complete Line-by-Line Explanation (Hinglish Mein)

## File Path
`backend/src/controllers/authController.js`

---

## 📌 IMPORTS (Lines 1-5)

```javascript
import { hashPassword, verifyPassword, createAccessToken, createRefreshToken, verifyToken } from '../utils/auth.js';
```
✅ **What it does:** Import authentication utilities
- `hashPassword()` = convert password to bcrypt hash (one-way)
- `verifyPassword()` = check if plain password matches hash
- `createAccessToken()` = create JWT for API requests
- `createRefreshToken()` = create JWT for getting new access token
- `verifyToken()` = validate/decode JWT

```javascript
import * as userService from '../services/userService.js';
```
✅ **What it does:** Database operations for users
- `getUserByEmail()`, `createUser()`, `updateUserLastLogin()`, etc.

```javascript
import { OAuth2Client } from 'google-auth-library';
```
✅ **What it does:** Google's OAuth client library
- Verifies Google-generated ID tokens

```javascript
import settings from '../config/settings.js';
```
✅ **What it does:** Configuration (GOOGLE_CLIENT_ID, etc.)

```javascript
import db from '../models/db.js';
```
✅ **What it does:** Direct database access (Turso/libSQL)
- For raw SQL queries

---

## 🔐 GOOGLE OAUTH SETUP (Lines 7-8)

```javascript
// Use the central settings configuration
const client = new OAuth2Client(settings.GOOGLE_CLIENT_ID);
```

✅ **What it does:** Initialize Google OAuth client
- `settings.GOOGLE_CLIENT_ID` = from environment config
- `OAuth2Client` = handles token verification

---

## 🔑 GOOGLE LOGIN HANDLER (Lines 10-79)

```javascript
export const googleLogin = async (req, res) => {
  const { credential } = req.body;
  if (!credential) {
    return res.status(400).json({ detail: 'Google credential is required' });
  }
```

✅ **What it does:** Get & validate Google credential from frontend
- `credential` = JWT token from Google Sign-In
- Return 400 error if missing

---

### VERIFY GOOGLE TOKEN (Lines 15-20)

```javascript
  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: settings.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { email, name } = payload;
    const cleanEmail = email.trim().toLowerCase();
```

✅ **What it does:** Verify and decode Google's token
- `client.verifyIdToken()` = cryptographically verify Google signed this
- `payload` = decoded token contents (user info)
- Extract email & name from payload
- Normalize email (trim spaces, lowercase)

---

### CHECK IF USER EXISTS (Lines 22-23)

```javascript
    let user = await userService.getUserByEmail(cleanEmail);

    if (!user) {
```

✅ **What it does:** Look up user by email
- If new user (no account yet), auto-register them

---

### AUTO-REGISTER NEW USERS (Lines 25-33)

```javascript
      // Auto-register new users logging in via Google
      const randomPassword = Math.random().toString(36).slice(-10) + 'A@1';
      const hashedPassword = await hashPassword(randomPassword);
      const generatedUsername = cleanEmail.split('@')[0] + Math.floor(Math.random() * 10000);
      
      user = await userService.createUser({
        email: cleanEmail,
        username: generatedUsername,
        full_name: name || 'Google User',
        hashed_password: hashedPassword,
      });
```

✅ **What it does:** Create account for first-time Google users
- Generate random password (never used, OAuth only)
- Hash it anyway (for consistency)
- Create username from email prefix + random number
  - Example: `john@gmail.com` → `john3421`
- Create user in database

**Why auto-register?**
- Reduces friction (no separate registration needed)
- User just clicks "Sign in with Google" and gets account
- Password never used (OAuth only)

---

### AUTO-PROMOTE TO ADMIN (Lines 36-43)

```javascript
    // Check for admin status from settings list
    const isAdmin = settings.AUTHORIZED_ADMIN_EMAILS.includes(cleanEmail);
    if (isAdmin && (user.is_admin !== 1 || user.role !== 'admin')) {
      console.log(`🔐 Auto-promoting Google user to Admin: ${cleanEmail}`);
      await db.execute(
        "UPDATE users SET is_admin = 1, role = 'admin', updated_at = ? WHERE id = ?",
        [new Date().toISOString(), user.id]
      );
    }
```

✅ **What it does:** Auto-promote emails in whitelist to admin
- Check if email is in `AUTHORIZED_ADMIN_EMAILS` from settings
- If yes and not already admin, promote them
- Example: `settings.AUTHORIZED_ADMIN_EMAILS = ['admin@arthanova.com']`

---

### CHECK IF ACCOUNT ACTIVE (Lines 45-47)

```javascript
    if (!user.is_active) {
      return res.status(403).json({ detail: 'Account is deactivated' });
    }
```

✅ **What it does:** Prevent login if account is disabled
- Return 403 (Forbidden) if inactive
- Example: Admin deactivated account for violation

---

### UPDATE LOGIN TIMESTAMP & LOG (Lines 49-61)

```javascript
    await userService.updateUserLastLogin(user.id);
    
    // Log successful Google login
    await userService.logAction({
      user_id: user.id,
      email: cleanEmail,
      action: 'LOGIN_GOOGLE',
      module: 'AUTH_GOOGLE',
      details: 'Logged in via Google SSO',
      ip: req.ip || req.headers['x-forwarded-for'] || '0.2.0.0'
    });
```

✅ **What it does:**
- Update `last_login` timestamp
- Log action to audit_logs table for security
- Useful for: detecting suspicious activity, compliance

---

### PREPARE RESPONSE (Lines 63-68)

```javascript
    const updatedUser = await userService.getUserById(user.id);
    const tokenData = { sub: user.id.toString(), email: user.email };
    const { hashed_password: _, ...safeUser } = updatedUser;
```

✅ **What it does:**
- Fetch fresh user data from DB
- Create token payload (sub = subject/user ID)
- Remove password from response object using destructuring
  - `{ hashed_password: _, ...safeUser }` = take all fields except hashed_password

---

### SEND SUCCESSFUL RESPONSE (Lines 70-76)

```javascript
    res.json({
      access_token: createAccessToken(tokenData),
      refresh_token: createRefreshToken(tokenData),
      token_type: 'bearer',
      expires_in: 3600,
      user: safeUser,
    });
```

✅ **What it does:** Return tokens & user data
- `access_token` = JWT for API requests (short-lived, ~1 hour)
- `refresh_token` = JWT for getting new access token (longer-lived)
- `token_type: 'bearer'` = HTTP auth type (Bearer token)
- `expires_in: 3600` = access token expires in 3600 seconds (1 hour)
- `user` = user profile (without password)

---

### ERROR HANDLER (Lines 77-80)

```javascript
  } catch (error) {
    console.error('Google Auth Verification failed:', error);
    res.status(401).json({ detail: 'Invalid authentication with Google. Please try again.' });
  }
};
```

✅ **What it does:** Catch any errors (invalid token, DB error, etc.)
- Return 401 (Unauthorized)
- Don't expose error details to frontend (security)

---

## 📝 REGISTER HANDLER (Lines 82-100+)

```javascript
export const register = async (req, res) => {
  const { email, username, full_name, password } = req.body;
  const cleanEmail = email.trim().toLowerCase();

  if (await userService.getUserByEmail(cleanEmail)) {
    return res.status(400).json({ detail: 'Email already registered' });
  }
  if (await userService.getUserByUsername(username)) {
    return res.status(400).json({ detail: 'Username already taken' });
  }

  const hashedPassword = await hashPassword(password);
  const user = await userService.createUser({
    email: cleanEmail,
    username,
    full_name,
    hashed_password: hashedPassword,
  });
```

✅ **What it does:** Register new user with email/password
- Extract & normalize email
- Check if email already exists → 400 error
- Check if username already taken → 400 error
- Hash password using bcrypt
- Create user in database

---

## 🔄 AUTHENTICATION FLOW COMPARISON

### Google Login Flow
```
1. Frontend: User clicks "Sign in with Google"
   ↓
2. Google popup: User selects account
   ↓
3. Google returns idToken (JWT)
   ↓
4. Frontend sends idToken to POST /auth/google/login
   ↓
5. Backend verifies signature with Google's public key
   ↓
6. Extract email & name from decoded token
   ↓
7. Check if user exists
   ├─ YES? Update last_login
   └─ NO? Auto-register new user
   ↓
8. Check admin whitelist (auto-promote if match)
   ↓
9. Check if account is active
   ↓
10. Create JWT access + refresh tokens
   ↓
11. Return tokens + user data to frontend
   ↓
12. Frontend saves tokens in auth store
   ↓
13. Future requests include: Authorization: Bearer {access_token}
```

### Email/Password Login Flow (in register handler)
```
1. User fills email, password, username
   ↓
2. Frontend POST /auth/register with data
   ↓
3. Backend checks email/username availability
   ├─ If exists → 400 error
   └─ If available → continue
   ↓
4. Hash password with bcrypt (one-way)
   ↓
5. Create user in database
   ↓
6. Return tokens & user data
```

---

## 🔐 SECURITY FEATURES

✅ **Password Hashing:** bcrypt (one-way function)
✅ **Token Verification:** Google verifies token signature
✅ **Email Normalization:** Prevents case-sensitive duplicates
✅ **Audit Logging:** Track all logins for security
✅ **Auto-deactivation:** Block inactive users
✅ **No password exposure:** Remove from response
✅ **IP Logging:** Track where logins come from
✅ **Admin Whitelist:** Control who can be admin

---

## 💡 KEY CONCEPTS

**Google OAuth vs Email/Password:**
- **OAuth:** Secure (Google handles password), no new password needed
- **Email/Password:** Traditional, requires secure password storage

**Auto-registration:**
- Reduces friction for new users
- Common pattern in B2C apps
- Can be disabled if needed

**Audit Logging:**
- Required for financial apps (compliance)
- Helps detect fraud (multiple failed logins, unusual locations)

**Token Structure:**
- JWT = JSON Web Token
- Access token = for API requests (short-lived)
- Refresh token = for getting new access token (long-lived)
- Prevents token reuse if compromised


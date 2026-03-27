import express from 'express';
import { OAuth2Client } from 'google-auth-library';
import { generateOTP, sendOTPByEmail, storeOTP, verifyOTP, resendOTP } from '../services/brevoService.js';
import * as userService from '../services/userService.js';
import { createAccessToken, createRefreshToken, hashPassword } from '../utils/auth.js';
import settings from '../config/settings.js';

const router = express.Router();

// Initialize Google OAuth Client
const googleClient = new OAuth2Client(settings.GOOGLE_CLIENT_ID);

console.log('🔍 Google OAuth Configuration:');
console.log(`   Client ID: ${settings.GOOGLE_CLIENT_ID ? '✓ Configured' : '✗ Missing'}`);
console.log(`   Brevo API: ${process.env.BREVO_API_KEY ? '✓ Configured' : '✗ Missing'}`);
console.log(`   Admin Emails: ${settings.AUTHORIZED_ADMIN_EMAILS.join(', ')}`);

/**
 * POST /api/v1/auth/google/otp-request
 * Step 1: User signs in with Google → Generate OTP → Send via email
 */
router.post('/otp-request', async (req, res) => {
  try {
    const { idToken, code } = req.body;
    
    // Verify Google ID Token or Auth Code
    let payload;
    try {
      if (code) {
        // Handle Auth Code flow (for custom buttons)
        const { tokens } = await googleClient.getToken(req.body.code);
        const ticket = await googleClient.verifyIdToken({
          idToken: tokens.id_token,
          audience: settings.GOOGLE_CLIENT_ID,
        });
        payload = ticket.getPayload();
      } else if (idToken) {
        // Handle standard ID Token flow
        const ticket = await googleClient.verifyIdToken({
          idToken,
          audience: settings.GOOGLE_CLIENT_ID,
        });
        payload = ticket.getPayload();
      } else {
        throw new Error('No ID token or auth code provided');
      }
    } catch (error) {
      console.error('Google Auth Error:', error.message);
      return res.status(401).json({
        error: 'Invalid token',
        message: 'Google authentication failed: ' + error.message,
      });
    }

    const { email, name: fullName, picture } = payload;

    if (!email) {
      return res.status(400).json({
        error: 'Invalid token',
        message: 'Email not found in Google token',
      });
    }

    console.log(`📧 OTP Request from: ${email}`);

    // Generate OTP
    const otp = generateOTP(6);
    console.log(`🔐 Generated OTP for ${email}: ${otp}`);

    // Send OTP via Brevo asynchronously (fire-and-forget) to speed up UI
    sendOTPByEmail(email, otp, fullName || 'User')
      .then(() => console.log(`✅ OTP email sent to ${email}`))
      .catch(err => console.error('❌ Email sending failed:', err.message));

    // Store OTP in memory/Redis
    const otpToken = storeOTP(email, otp, 10);

    res.json({
      success: true,
      message: 'OTP sent to your email',
      otp_token: otpToken,
      email,
      fullName: fullName || 'User',
      picture,
      expires_in: 600, // 10 minutes in seconds
    });
  } catch (error) {
    console.error('❌ OTP Request Error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to process OTP request',
      debug: process.env.DEBUG === 'true' ? error.message : undefined,
    });
  }
});

/**
 * POST /api/v1/auth/google/otp-verify
 * Step 2: Verify OTP → Create JWT tokens → Complete login
 */
router.post('/otp-verify', async (req, res) => {
  try {
    const { email, otp, fullName } = req.body;

    // Input validation
    if (!email || !otp) {
      return res.status(400).json({
        error: 'Invalid request',
        message: 'Email and OTP are required',
      });
    }

    console.log(`🔍 OTP Verification for: ${email}`);

    // Verify OTP
    const verification = verifyOTP(email, otp);

    if (!verification.valid) {
      console.warn(`⚠️  Invalid OTP attempt for ${email}: ${verification.message}`);
      return res.status(400).json({
        error: 'Invalid OTP',
        message: verification.message,
      });
    }

    console.log(`✅ OTP verified for ${email}`);

    // Determine if user should have admin access
    const isAdminEmail = settings.AUTHORIZED_ADMIN_EMAILS.includes(email.toLowerCase());
    const userRole = isAdminEmail ? 'admin' : 'user';

    // 1. Get or Create user from database
    let user = await userService.getUserByEmail(email);

    if (!user) {
      console.log(`🆕 Creating new user for Google login: ${email}`);
      const randomPassword = Math.random().toString(36).slice(-10) + 'A@1';
      const hashedPassword = await hashPassword(randomPassword);
      const generatedUsername = email.split('@')[0] + Math.floor(Math.random() * 1000);

      user = await userService.createUser({
        email,
        username: generatedUsername,
        full_name: fullName || 'Google User',
        hashed_password: hashedPassword,
      });
    }

    // 2. Sync Admin Status with Authorized List
    if (user.is_admin !== (isAdminEmail ? 1 : 0)) {
      console.log(`⚖️ Syncing admin status for ${email} to ${isAdminEmail}`);
      await userService.updateUserAdminStatus(user.id, isAdminEmail);
      // Refresh user object to get the new status
      user = await userService.getUserById(user.id);
    }

    // 3. Update last login
    await userService.updateUserLastLogin(user.id);

    // 3. Generate Tokens
    const tokenData = { sub: user.id.toString(), email: user.email };
    const accessToken = createAccessToken(tokenData);
    const refreshToken = createRefreshToken(tokenData);

    // 4. Return same format as standard login
    const { hashed_password, ...safeUser } = user;

    res.json({
      success: true,
      message: 'Login successful',
      access_token: accessToken,
      refresh_token: refreshToken,
      token_type: 'bearer',
      expires_in: 3600,
      user: {
        ...safeUser,
        role: userRole,
        is_admin: isAdminEmail,
      },
    });
  } catch (error) {
    console.error('❌ OTP Verify Error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to verify OTP: ' + error.message,
    });
  }
});

/**
 * POST /api/v1/auth/google/otp-resend
 * Resend OTP to email
 */
router.post('/otp-resend', async (req, res) => {
  try {
    const { email, idToken } = req.body;

    if (!email || !idToken) {
      return res.status(400).json({
        error: 'Invalid request',
        message: 'Email and ID token are required',
      });
    }

    console.log(`📧 Resend OTP Request from: ${email}`);

    // Verify Google token first
    let payload;
    try {
      const ticket = await googleClient.verifyIdToken({
        idToken,
        audience: settings.GOOGLE_CLIENT_ID,
      });
      payload = ticket.getPayload();
    } catch (error) {
      return res.status(401).json({
        error: 'Invalid token',
        message: 'Google ID token verification failed',
      });
    }

    // Get existing OTP
    const resendData = resendOTP(email);

    if (!resendData.success) {
      return res.status(400).json({
        error: 'No active OTP session',
        message: resendData.message,
      });
    }

    // Resend existing OTP using fire-and-forget
    sendOTPByEmail(email, resendData.otp, payload.name || 'User')
      .then(() => console.log(`✅ OTP resent to ${email}`))
      .catch(err => console.error('❌ Email resend failed:', err.message));

    res.json({
      success: true,
      message: 'OTP resent to your email',
      email,
    });
  } catch (error) {
    console.error('❌ OTP Resend Error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to resend OTP',
    });
  }
});

export default router;

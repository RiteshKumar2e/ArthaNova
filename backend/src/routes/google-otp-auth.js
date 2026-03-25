import express from 'express';
import { OAuth2Client } from 'google-auth-library';
import { generateOTP, sendOTPByEmail, storeOTP, verifyOTP, resendOTP } from '../services/brevoService.js';
import settings from '../config/settings.js';

const router = express.Router();

// Initialize Google OAuth Client
const googleClient = new OAuth2Client(settings.GOOGLE_CLIENT_ID);

console.log('🔍 Google OAuth Configuration:');
console.log(`   Client ID: ${settings.GOOGLE_CLIENT_ID ? '✓ Configured' : '✗ Missing'}`);
console.log(`   Brevo API: ${process.env.BREVO_API_KEY ? '✓ Configured' : '✗ Missing'}`);

/**
 * POST /api/v1/auth/google/otp-request
 * Step 1: User signs in with Google → Generate OTP → Send via email
 */
router.post('/otp-request', async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({
        error: 'Invalid request',
        message: 'ID token is required',
      });
    }

    // Verify Google ID Token
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
        message: 'Google ID token verification failed: ' + error.message,
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

    // Send OTP via Brevo
    try {
      await sendOTPByEmail(email, otp, fullName || 'User');
      console.log(`✅ OTP email sent to ${email}`);
    } catch (emailError) {
      console.error('❌ Email sending failed:', emailError.message);
      return res.status(500).json({
        error: 'Email service failed',
        message: 'Failed to send OTP email. Please try again later.',
        debug: process.env.DEBUG === 'true' ? emailError.message : undefined,
      });
    }

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

    if (otp.length !== 6) {
      return res.status(400).json({
        error: 'Invalid OTP',
        message: 'OTP must be 6 digits',
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

    // TODO: In production, implement:
    // 1. Create or get user from database
    // 2. Generate Access Token
    // 3. Generate Refresh Token
    // 4. Save refresh token in database/Redis
    // 5. Log authentication event

    // For now, return mock response
    res.json({
      success: true,
      message: 'OTP verified successfully',
      otp_token: null,
      // access_token: generateAccessToken(user),
      // refresh_token: generateRefreshToken(user),
      user: {
        id: 'user-' + Date.now(),
        email,
        full_name: fullName || 'User',
        role: 'user',
        verified: true,
        created_at: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('❌ OTP Verify Error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to verify OTP',
      debug: process.env.DEBUG === 'true' ? error.message : undefined,
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

    // Resend existing OTP
    try {
      await sendOTPByEmail(email, resendData.otp, payload.name || 'User');
      console.log(`✅ OTP resent to ${email}`);

      res.json({
        success: true,
        message: 'OTP resent to your email',
        email,
      });
    } catch (emailError) {
      console.error('❌ Email resend failed:', emailError.message);
      return res.status(500).json({
        error: 'Email service failed',
        message: 'Failed to resend OTP',
      });
    }
  } catch (error) {
    console.error('❌ OTP Resend Error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to resend OTP',
    });
  }
});

export default router;

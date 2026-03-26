import axios from 'axios';
import crypto from 'crypto';
import settings from '../config/settings.js';

// Brevo API Configuration
const BREVO_API_KEY = settings.BREVO_API_KEY;
const BREVO_API_BASE = 'https://api.brevo.com/v3';

if (!BREVO_API_KEY) {
  console.warn('⚠️  BREVO_API_KEY not configured in settings. Email sending will fail.');
}

const brevoClient = axios.create({
  baseURL: BREVO_API_BASE,
  headers: {
    'api-key': BREVO_API_KEY,
    'Content-Type': 'application/json',
  },
});

// Generate random OTP
export const generateOTP = (length = 6) => {
  return Math.floor(Math.random() * Math.pow(10, length))
    .toString()
    .padStart(length, '0');
};

// Send OTP via Brevo Email
export const sendOTPByEmail = async (email, otp, userName = 'User') => {
  try {
    if (!BREVO_API_KEY) {
      throw new Error('Brevo API key not configured');
    }

    const payload = {
      sender: {
        name: settings.BREVO_SENDER_NAME,
        email: settings.BREVO_SENDER_EMAIL,
      },
      to: [
        {
          email: email,
          name: userName,
        },
      ],
      subject: 'Your ArthaNova OTP for Login',
      htmlContent: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify Your Account - ArthaNova</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f6f9fc; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f6f9fc; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table width="100%" max-width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.05);">
                  
                  <!-- Header Section -->
                  <tr>
                    <td align="center" style="background: linear-gradient(135deg, #6366F1 0%, #A855F7 100%); padding: 60px 40px;">
                      <div style="background-color: rgba(255,255,255,0.15); width: 80px; height: 80px; border-radius: 20px; display: flex; align-items: center; justify-content: center; margin-bottom: 24px;">
                        <span style="font-size: 40px;">🔐</span>
                      </div>
                      <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 800; letter-spacing: -0.5px;">Verify Your Account</h1>
                      <div style="display: inline-block; background-color: #FFD700; color: #000000; font-size: 13px; font-weight: 700; padding: 4px 12px; border-radius: 6px; margin-top: 16px; text-transform: uppercase; letter-spacing: 0.5px;">
                        ArthaNova AI
                      </div>
                    </td>
                  </tr>

                  <!-- Body Section -->
                  <tr>
                    <td style="padding: 48px 40px;">
                      <p style="color: #4B5563; font-size: 16px; line-height: 24px; text-align: center; margin: 0 0 40px 0;">
                        Welcome, <strong>${userName}</strong>! Use the verification code below to complete your Google sign-in. This code will expire in <strong style="color: #111827;">5 minutes</strong>.
                      </p>

                      <!-- OTP Box -->
                      <div style="background-color: #ffffff; border: 2px solid #E5E7EB; border-radius: 20px; padding: 40px; text-align: center; margin-bottom: 40px; border: 2.5px solid #6366F1;">
                        <div style="color: #6B7280; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 24px;">
                          Your Verification Code
                        </div>
                        <div style="font-size: 56px; font-weight: 800; color: #111827; letter-spacing: 12px; font-family: 'Monaco', 'Courier New', monospace; line-height: 1;">
                          ${otp}
                        </div>
                      </div>

                      <!-- Security Notice -->
                      <div style="background-color: #FFFBEB; border-radius: 12px; padding: 24px; border: 1px solid #FEF3C7; display: flex; align-items: flex-start; gap: 16px;">
                        <span style="font-size: 20px;">🛡️</span>
                        <div>
                          <strong style="color: #92400E; font-size: 14px; display: block; margin-bottom: 4px;">Security Notice</strong>
                          <p style="color: #B45309; font-size: 14px; margin: 0; line-height: 20px;">
                            Never share this code with anyone. <strong style="color: #92400E;">ArthaNova AI</strong> will never ask for your verification code via phone or email.
                          </p>
                        </div>
                      </div>

                      <!-- Footer Support -->
                      <p style="text-align: center; color: #9CA3AF; font-size: 13px; margin-top: 40px;">
                        If you didn't request this code, you can safely ignore this email.
                      </p>
                    </td>
                  </tr>

                  <!-- Footer Section -->
                  <tr>
                    <td style="padding: 0 40px 40px 40px; text-align: center; border-top: 1px solid #F3F4F6; padding-top: 32px;">
                      <p style="color: #9CA3AF; font-size: 12px; margin: 0;">
                        &copy; 2026 ArthaNova Intelligence Platform. All rights reserved.
                      </p>
                      <div style="margin-top: 16px;">
                        <a href="https://arthanova.vercel.app" style="color: #6366F1; text-decoration: none; font-size: 12px; font-weight: 500;">Visit Dashboard</a>
                        <span style="color: #E5E7EB; margin: 0 8px;">&bull;</span>
                        <a href="mailto:support@arthanova.in" style="color: #6366F1; text-decoration: none; font-size: 12px; font-weight: 500;">Contact Support</a>
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
      tags: ['OTP', 'Authentication', 'ArthaNova'],
    };

    console.log(`📤 Sending email via Brevo...`);
    console.log(`   From: ${settings.BREVO_SENDER_NAME} <${settings.BREVO_SENDER_EMAIL}>`);
    console.log(`   To: ${userName} <${email}>`);
    const response = await brevoClient.post('/smtp/email', payload);

    console.log(`📤 Brevo API Response Status: ${response.status}`);
    console.log(`✅ Message ID: ${response.data.messageId || 'N/A'}`);
    console.log(`✅ OTP email sent to ${email} via Brevo`);

    return { success: true, message: 'OTP sent to email', messageId: response.data.messageId };
  } catch (error) {
    console.error('❌ Brevo Email Error:');
    console.error('   Status:', error.response?.status);
    console.error('   Data:', error.response?.data);
    console.error('   Message:', error.message);
    throw new Error(`Failed to send OTP: ${error.response?.data?.message || error.message}`);
  }
};

// Store OTP in memory (use Redis/DB for production)
const otpStore = new Map();

export const storeOTP = (email, otp, expiryMinutes = 5) => {
  const expiryTime = Date.now() + expiryMinutes * 60 * 1000;
  const token = crypto.randomBytes(32).toString('hex');

  otpStore.set(email, {
    otp,
    token,
    expiryTime,
    attempts: 0,
  });

  console.log(`🔐 OTP stored for ${email}, expires in ${expiryMinutes} minutes`);
  return token;
};

export const verifyOTP = (email, otp) => {
  const stored = otpStore.get(email);

  if (!stored) {
    return { valid: false, message: 'OTP not found or expired' };
  }

  if (Date.now() > stored.expiryTime) {
    otpStore.delete(email);
    return { valid: false, message: 'OTP expired. Please request a new one.' };
  }

  // Rate limiting: max 3 attempts
  if (stored.attempts >= 3) {
    otpStore.delete(email);
    return { valid: false, message: 'Too many attempts. Please request a new OTP.' };
  }

  if (stored.otp !== otp) {
    stored.attempts += 1;
    return {
      valid: false,
      message: `Invalid OTP. ${3 - stored.attempts} attempts remaining.`
    };
  }

  // Success - delete OTP
  const user = { email, verified: true };
  otpStore.delete(email);
  return { valid: true, message: 'OTP verified', user };
};

// Resend OTP
export const resendOTP = (email) => {
  const stored = otpStore.get(email);

  if (!stored) {
    return { success: false, message: 'No active OTP session for this email' };
  }

  if (Date.now() > stored.expiryTime) {
    otpStore.delete(email);
    return { success: false, message: 'OTP expired. Please login again.' };
  }

  return { success: true, otp: stored.otp };
};

export default {
  generateOTP,
  sendOTPByEmail,
  storeOTP,
  verifyOTP,
  resendOTP,
};

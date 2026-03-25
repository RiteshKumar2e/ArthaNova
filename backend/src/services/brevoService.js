import axios from 'axios';
import crypto from 'crypto';
import process from 'process';

// Brevo API Configuration
const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_API_BASE = 'https://api.brevo.com/v3';

if (!BREVO_API_KEY) {
  console.warn('⚠️  BREVO_API_KEY not configured. Email sending will fail.');
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

    const response = await brevoClient.post('/smtp/email', {
      sender: {
        name: 'ArthaNova',
        email: 'noreply@arthanova.in',
      },
      to: [
        {
          email: email,
          name: userName,
        },
      ],
      subject: 'Your ArthaNova OTP for Login',
      htmlContent: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 0;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #7C3AED 0%, #C026D3 100%); padding: 40px 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">ArthaNova</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 14px;">Secure Authentication</p>
          </div>

          <!-- Content -->
          <div style="padding: 40px 20px; background: #f8f9fa;">
            <div style="background: white; padding: 30px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
              <h2 style="color: #1f2937; margin: 0 0 10px 0; font-size: 24px; font-weight: 600;">Welcome Back!</h2>
              <p style="color: #6b7280; margin: 0 0 30px 0; font-size: 15px; line-height: 1.6;">
                We received your login request. Use the OTP below to complete your authentication:
              </p>

              <!-- OTP Box -->
              <div style="background: linear-gradient(135deg, #f0f3ff 0%, #fef2f8 100%); padding: 25px; border-radius: 10px; text-align: center; margin: 30px 0; border: 2px solid #e9d5ff;">
                <p style="color: #7c3aed; margin: 0 0 15px 0; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Your One-Time Password</p>
                <div style="font-size: 42px; font-weight: 700; letter-spacing: 8px; color: #7c3aed; font-family: 'Courier New', monospace; word-spacing: 10px;">
                  ${otp}
                </div>
                <p style="color: #a78bfa; margin: 15px 0 0 0; font-size: 12px;">Valid for 10 minutes</p>
              </div>

              <!-- Security Notice -->
              <div style="background: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b; margin: 20px 0;">
                <p style="color: #92400e; margin: 0; font-size: 13px; font-weight: 500;">
                  🔒 <strong>Security Alert:</strong> Never share this OTP with anyone. ArthaNova support will never ask for your OTP.
                </p>
              </div>

              <!-- Additional Info -->
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                <p style="color: #6b7280; margin: 0 0 10px 0; font-size: 13px;">
                  <strong>Didn't request this login?</strong> You can safely ignore this email. If you suspect unauthorized access, contact our support team immediately.
                </p>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div style="background: #1f2937; padding: 20px; text-align: center; border-top: 1px solid #374151;">
            <p style="color: #9ca3af; margin: 0; font-size: 12px;">
              © 2026 ArthaNova. All rights reserved. | 
              <a href="https://arthanova.vercel.app" style="color: #7c3aed; text-decoration: none;">Visit Dashboard</a>
            </p>
            <p style="color: #6b7280; margin: 10px 0 0 0; font-size: 11px;">
              This is an automated message from ArthaNova Security System
            </p>
          </div>
        </div>
      `,
      tags: ['OTP', 'Authentication', 'ArthaNova'],
    });

    console.log(`✅ OTP sent to ${email} via Brevo`);
    return { success: true, message: 'OTP sent to email' };
  } catch (error) {
    console.error('Brevo Email Error:', error.response?.data || error.message);
    throw new Error(`Failed to send OTP: ${error.response?.data?.message || error.message}`);
  }
};

// Store OTP in memory (use Redis/DB for production)
const otpStore = new Map();

export const storeOTP = (email, otp, expiryMinutes = 10) => {
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

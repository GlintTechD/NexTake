import crypto from 'node:crypto';

export const buildResendFromAddress = (fromEmail?: string, fromName = 'NexTake Admin') => {
  const email = fromEmail?.trim();
  if (!email) {
    throw new Error('RESEND_FROM_EMAIL is not configured. Set it to a verified Resend sender like onboarding@resend.dev or no-reply@yourdomain.com.');
  }

  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!isValid) {
    throw new Error(`RESEND_FROM_EMAIL is invalid: ${email}. Use a valid sender address from your verified Resend domain.`);
  }

  return `${fromName.trim() || 'NexTake Admin'} <${email}>`;
};

export const buildOtpHash = (otp: string, secret: string) =>
  crypto.createHmac('sha256', secret).update(otp.trim(), 'utf8').digest('hex');

export const createOtp = () => {
  const value = crypto.randomInt(100000, 1000000).toString();
  return value.padStart(6, '0');
};

export const signSessionId = (sessionId: string, secret: string) =>
  crypto.createHmac('sha256', secret).update(sessionId).digest('hex');

export const isExpired = (expiresAt: number) => Date.now() > expiresAt;

export const constantTimeEqual = (a: string, b: string) => {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) {
    return false;
  }
  return crypto.timingSafeEqual(left, right);
};

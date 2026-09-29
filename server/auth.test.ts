import test from 'node:test';
import assert from 'node:assert/strict';
import { buildOtpHash, buildResendFromAddress, createOtp, constantTimeEqual, isExpired } from './auth';

test('creates a six-digit OTP', () => {
  const otp = createOtp();
  assert.equal(otp.length, 6);
  assert.match(otp, /^\d{6}$/);
});

test('hashes OTP values deterministically', () => {
  const otp = '123456';
  const hashA = buildOtpHash(otp, 'test-secret');
  const hashB = buildOtpHash(` ${otp} `, 'test-secret');
  assert.equal(hashA, hashB);
  assert.notEqual(hashA, otp);
  assert.notEqual(hashA, buildOtpHash(otp, 'different-secret'));
});

test('constant-time comparison rejects mismatched values', () => {
  assert.equal(constantTimeEqual('123456', '654321'), false);
  assert.equal(constantTimeEqual('123456', '123456'), true);
});

test('expired tokens are detected correctly', () => {
  const expired = Date.now() - 1000;
  const active = Date.now() + 60000;
  assert.equal(isExpired(expired), true);
  assert.equal(isExpired(active), false);
});

test('builds a valid Resend sender address from a verified email', () => {
  assert.equal(
    buildResendFromAddress('no-reply@nextake.com', 'NexTake Admin'),
    'NexTake Admin <no-reply@nextake.com>',
  );
  assert.throws(
    () => buildResendFromAddress('not-an-email', 'NexTake Admin'),
    /RESEND_FROM_EMAIL/i,
  );
});

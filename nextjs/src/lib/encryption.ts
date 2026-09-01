/**
 * AES-256-GCM Encryption Service
 * Used to encrypt/decrypt sensitive API keys before storing in DB.
 *
 * Requires: ENCRYPTION_SECRET env variable (32-byte hex string = 64 hex chars)
 * Generate one: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
 */
import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16; // bytes
const TAG_LENGTH = 16; // bytes

function getKey(): Buffer {
  const secret = process.env.ENCRYPTION_SECRET;
  if (!secret) {
    throw new Error('ENCRYPTION_SECRET environment variable is not set');
  }
  // Accept either a 64-char hex string or a raw 32-char string
  if (secret.length === 64 && /^[0-9a-f]+$/i.test(secret)) {
    return Buffer.from(secret, 'hex');
  }
  // Derive a 32-byte key from the raw string
  return crypto.createHash('sha256').update(secret).digest();
}

export interface EncryptedPayload {
  value: string;  // base64-encoded ciphertext
  iv: string;     // base64-encoded IV
  authTag: string; // base64-encoded GCM auth tag
}

export function encrypt(plaintext: string): EncryptedPayload {
  const key = getKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  const encrypted = Buffer.concat([
    cipher.update(plaintext, 'utf8'),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();

  return {
    value: encrypted.toString('base64'),
    iv: iv.toString('base64'),
    authTag: authTag.toString('base64'),
  };
}

export function decrypt(payload: EncryptedPayload): string {
  const key = getKey();
  const iv = Buffer.from(payload.iv, 'base64');
  const authTag = Buffer.from(payload.authTag, 'base64');
  const encrypted = Buffer.from(payload.value, 'base64');

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  return Buffer.concat([
    decipher.update(encrypted),
    decipher.final(),
  ]).toString('utf8');
}

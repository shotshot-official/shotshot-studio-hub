// lib/auth.ts
import { cookies } from 'next/headers';
import { TeamMember } from '@/types/notion';

const COOKIE_NAME = 'studio_session';
const SECRET_KEY = process.env.AUTH_SECRET || 'studio-hub-4person-team-auth-secret-key-2026';

export interface AuthSession {
  memberId: string;
  email: string;
  name: string;
  role: string;
  avatarUrl?: string;
}

// Simple Base64URL + HMAC-SHA256 signature using native Web Crypto
async function sign(payload: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(SECRET_KEY),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(payload));
  const sigBase64 = Buffer.from(signature).toString('base64url');
  const payloadBase64 = Buffer.from(payload).toString('base64url');
  return `${payloadBase64}.${sigBase64}`;
}

async function verify(token: string): Promise<string | null> {
  const [payloadBase64, sigBase64] = token.split('.');
  if (!payloadBase64 || !sigBase64) return null;

  try {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(SECRET_KEY),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );
    const signature = Buffer.from(sigBase64, 'base64url');
    const isValid = await crypto.subtle.verify(
      'HMAC',
      key,
      signature,
      encoder.encode(Buffer.from(payloadBase64, 'base64url').toString('utf8'))
    );
    if (!isValid) return null;
    return Buffer.from(payloadBase64, 'base64url').toString('utf8');
  } catch {
    return null;
  }
}

// Sets the session cookie
export async function setSession(session: AuthSession): Promise<void> {
  const cookieStore = await cookies();
  const token = await sign(JSON.stringify(session));
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

// Retrieves current session
export async function getSession(): Promise<AuthSession | null> {
  try {
    const cookieStore = await cookies();
    const cookie = cookieStore.get(COOKIE_NAME);
    if (!cookie?.value) return null;

    const raw = await verify(cookie.value);
    if (!raw) return null;
    return JSON.parse(raw) as AuthSession;
  } catch {
    return null;
  }
}

// Clears session cookie
export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

/**
 * Hashes a password using SHA-256 via Web Crypto API.
 */
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password.trim());
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Smart password verification supporting:
 * 1. Plain text comparison (for rapid admin onboarding / manual reset in Notion)
 * 2. SHA-256 cryptographic hash comparison
 * 3. Fallback to default '1234' if Notion password column is empty
 */
export async function verifyPassword(inputPassword: string, storedValue?: string): Promise<boolean> {
  const trimmedInput = inputPassword.trim();
  const trimmedStored = storedValue?.trim();

  // If no password set in Notion yet, allow default '1234'
  if (!trimmedStored) {
    return trimmedInput === '1234';
  }

  // 1. Direct plain text match (e.g. initial setup in Notion DB)
  if (trimmedInput === trimmedStored) {
    return true;
  }

  // 2. SHA-256 hash match (64 hex characters)
  const hashedInput = await hashPassword(trimmedInput);
  if (hashedInput.toLowerCase() === trimmedStored.toLowerCase()) {
    return true;
  }

  return false;
}

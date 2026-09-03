import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const SESSION_COOKIE = "cb_admin_session";
const SESSION_DURATION_MS = 24 * 60 * 60 * 1000;

function getSecret(): string {
  return process.env.ADMIN_SECRET || "corral-business-dev-secret";
}

export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD || "corral2026";
}

function signToken(payload: string): string {
  return createHmac("sha256", getSecret()).update(payload).digest("hex");
}

function createSessionToken(): string {
  const expires = Date.now() + SESSION_DURATION_MS;
  const payload = `${expires}`;
  const signature = signToken(payload);
  return `${payload}.${signature}`;
}

function verifySessionToken(token: string): boolean {
  const [expiresStr, signature] = token.split(".");
  if (!expiresStr || !signature) return false;

  const expected = signToken(expiresStr);
  const sigBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);

  if (sigBuffer.length !== expectedBuffer.length) return false;
  if (!timingSafeEqual(sigBuffer, expectedBuffer)) return false;

  const expires = Number(expiresStr);
  if (Number.isNaN(expires) || expires < Date.now()) return false;

  return true;
}

export async function createSession(): Promise<void> {
  const token = createSessionToken();
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION_MS / 1000,
  });
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return false;
  return verifySessionToken(token);
}

export function verifyPassword(password: string): boolean {
  const expected = getAdminPassword();
  const a = Buffer.from(password);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

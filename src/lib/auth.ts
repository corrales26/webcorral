import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { verifyAdminPassword } from "@/lib/access";

const SESSION_COOKIE = "cb_admin_session";
const COLLABORATOR_COOKIE = "cb_collaborator_session";
const SESSION_DURATION_MS = 24 * 60 * 60 * 1000;

function getSecret(): string {
  return process.env.ADMIN_SECRET || "corral-business-dev-secret";
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

export async function verifyPassword(email: string, password: string): Promise<boolean> {
  return verifyAdminPassword(email, password);
}

function collaboratorCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_DURATION_MS / 1000,
  };
}

export async function createCollaboratorSession(grantId: string): Promise<void> {
  const expires = Date.now() + SESSION_DURATION_MS;
  const payload = `c.${grantId}.${expires}`;
  const token = `${payload}.${signToken(payload)}`;
  const cookieStore = await cookies();
  cookieStore.set(COLLABORATOR_COOKIE, token, collaboratorCookieOptions());
}

export async function destroyCollaboratorSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COLLABORATOR_COOKIE);
}

export async function getCollaboratorId(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COLLABORATOR_COOKIE)?.value;
  if (!token) return null;

  const parts = token.split(".");
  if (parts.length !== 4 || parts[0] !== "c") return null;

  const grantId = parts[1];
  const expiresStr = parts[2];
  const signature = parts[3];
  if (!grantId || !expiresStr || !signature) return null;

  const payload = `c.${grantId}.${expiresStr}`;
  const expected = signToken(payload);
  const sigBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);

  if (sigBuffer.length !== expectedBuffer.length) return null;
  if (!timingSafeEqual(sigBuffer, expectedBuffer)) return null;

  const expires = Number(expiresStr);
  if (Number.isNaN(expires) || expires < Date.now()) return null;

  return grantId;
}

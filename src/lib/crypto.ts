import { createCipheriv, createDecipheriv, randomBytes } from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;
const PREFIX = "v1:";

function getKey(): Buffer {
  const raw = process.env.DATA_ENCRYPTION_KEY;
  if (!raw) {
    throw new Error("Falta DATA_ENCRYPTION_KEY");
  }

  const key = Buffer.from(raw, "base64");
  if (key.length !== 32) {
    throw new Error("DATA_ENCRYPTION_KEY debe ser 32 bytes en base64");
  }

  return key;
}

export function isEncrypted(value: string): boolean {
  return value.startsWith(PREFIX);
}

export function encryptString(plain: string): string {
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, getKey(), iv);
  const encrypted = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();

  return `${PREFIX}${iv.toString("base64url")}.${tag.toString("base64url")}.${encrypted.toString("base64url")}`;
}

export function decryptString(payload: string): string {
  if (!isEncrypted(payload)) return payload;

  const body = payload.slice(PREFIX.length);
  const [ivPart, tagPart, dataPart] = body.split(".");
  if (!ivPart || !tagPart || !dataPart) {
    throw new Error("Dato cifrado inválido");
  }

  const decipher = createDecipheriv(
    ALGORITHM,
    getKey(),
    Buffer.from(ivPart, "base64url")
  );
  decipher.setAuthTag(Buffer.from(tagPart, "base64url"));

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(dataPart, "base64url")),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
}

export function encryptBuffer(plain: Buffer): Buffer {
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, getKey(), iv);
  const encrypted = Buffer.concat([cipher.update(plain), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, encrypted]);
}

export function decryptBuffer(payload: Buffer): Buffer {
  const iv = payload.subarray(0, IV_LENGTH);
  const tag = payload.subarray(IV_LENGTH, IV_LENGTH + 16);
  const data = payload.subarray(IV_LENGTH + 16);
  const decipher = createDecipheriv(ALGORITHM, getKey(), iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(data), decipher.final()]);
}

export function encryptJson(value: unknown): string {
  return encryptString(JSON.stringify(value));
}

export function decryptJson<T>(payload: string, fallback: T): T {
  if (!payload) return fallback;
  const raw = isEncrypted(payload) ? decryptString(payload) : payload;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

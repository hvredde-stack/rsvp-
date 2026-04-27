import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

const KEY_LEN = 64;
const SALT_LEN = 16;

/**
 * Hash a password with scrypt. Output format: "scrypt$<saltHex>$<keyHex>".
 * Stored opaquely; verifyPassword parses it back out.
 */
export function hashPassword(password: string): string {
  const salt = randomBytes(SALT_LEN);
  const key = scryptSync(password, salt, KEY_LEN);
  return `scrypt$${salt.toString("hex")}$${key.toString("hex")}`;
}

/**
 * Verify a password against a stored hash. Returns false on any parse or
 * comparison failure. Comparison is constant-time.
 */
export function verifyPassword(password: string, stored: string): boolean {
  if (!stored) return false;
  const parts = stored.split("$");
  if (parts.length !== 3 || parts[0] !== "scrypt") return false;
  let saltHex: string;
  let keyHex: string;
  try {
    saltHex = parts[1];
    keyHex = parts[2];
  } catch {
    return false;
  }
  const salt = Buffer.from(saltHex, "hex");
  const expected = Buffer.from(keyHex, "hex");
  if (expected.length === 0) return false;
  const candidate = scryptSync(password, salt, expected.length);
  if (candidate.length !== expected.length) return false;
  return timingSafeEqual(candidate, expected);
}

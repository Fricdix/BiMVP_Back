import { SignJWT, jwtVerify } from "jose";

const COOKIE_NAME = "bi_token";

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("JWT_SECRET missing or too short (use >= 32 chars)");
  }
  return new TextEncoder().encode(secret);
}

export type SessionToken = {
  sub: string;
  email: string;
  name: string;
  role: "USER" | "ANALYST" | "ADMIN";
};

export async function signSessionToken(payload: SessionToken) {
  const jwt = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());

  return jwt;
}

export async function verifySessionToken(token: string) {
  const { payload } = await jwtVerify(token, getSecret());
  return payload as unknown as SessionToken;
}

// Express-compatible cookie functions
export function setAuthCookieExpress(res: any, token: string) {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7 * 1000,
  });
}

export function clearAuthCookieExpress(res: any) {
  res.cookie(COOKIE_NAME, "", { path: "/", maxAge: 0 });
}

export function getAuthCookieExpress(req: any) {
  return req.cookies ? req.cookies[COOKIE_NAME] : undefined;
}

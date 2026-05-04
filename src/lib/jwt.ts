import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback_secret_for_development_only'
);

export interface ECOJWTPayload {
  userId: string;
  email: string;
  role: string;
}

export async function signToken(payload: ECOJWTPayload, expiresIn: string = '7d') {
  return new SignJWT(payload as any)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as ECOJWTPayload;
  } catch (error) {
    return null;
  }
}

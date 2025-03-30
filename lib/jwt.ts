import jwt from "jsonwebtoken";

export type Payload = {
  name: string;
  email: string;
};

const JWT_SECRET = process.env.JWT_SECRET!;
export const ACCESS_TOKEN_EXPIRES = Number(process.env.ACCESS_TOKEN_EXPIRES!);
export const REFRESH_TOKEN_EXPIRES = Number(process.env.REFRESH_TOKEN_EXPIRES!);

export function generateToken(payload: Payload): {
  accessToken: string;
  refreshToken: string;
} {
  const accessToken = jwt.sign(payload, JWT_SECRET, {
    issuer: "algorithm-architect-api",
    subject: "access-token",
    expiresIn: ACCESS_TOKEN_EXPIRES,
  });
  const refreshToken = jwt.sign(payload, JWT_SECRET, {
    issuer: "algorithm-architect-api",
    subject: "refresh-token",
    expiresIn: REFRESH_TOKEN_EXPIRES,
  });
  return { accessToken, refreshToken };
}

export function parseToken(
  token: string,
):
  | { payload: Payload; error: undefined }
  | { payload: undefined; error: Error } {
  try {
    const x = jwt.decode(token, { json: true });
    return { payload: x as Payload, error: undefined };
  } catch (error) {
    return { payload: undefined, error: error as Error };
  }
}

// !DO NOT USE THIS IN FRONTEND CODE
export function verifyToken(token: string): boolean {
  try {
    jwt.verify(token, JWT_SECRET);
    return true;
  } catch (_) {
    return false;
  }
}

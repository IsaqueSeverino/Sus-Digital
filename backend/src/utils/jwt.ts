import jwt, { SignOptions, VerifyOptions, JwtPayload } from 'jsonwebtoken';

interface JWTPayload {
  userId: string;
  [key: string]: any;
}

class JWTUtils {
  static generateToken(payload: JWTPayload): string {
    return jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    } as SignOptions);
  }

  static verifyToken(token: string): JWTPayload {
    return jwt.verify(token, process.env.JWT_SECRET as string) as JWTPayload;
  }

  static decodeToken(token: string): null | JWTPayload | string {
    return jwt.decode(token) as JWTPayload | string | null;
  }
}

export default JWTUtils;

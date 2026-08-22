import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { config } from '../config';

export interface TokenPayload {
  id: string;
  email: string;
  role: 'ADMIN' | 'EMPLOYEE';
  employee_id?: string;
  name?: string;
}

export const generateToken = (payload: TokenPayload): string => {
  const options: SignOptions = {
    expiresIn: (config.jwtExpiresIn || '24h') as any,
  };
  return jwt.sign(payload, config.jwtSecret as Secret, options);
};

export const verifyJwtToken = (token: string): TokenPayload => {
  return jwt.verify(token, config.jwtSecret as Secret) as TokenPayload;
};


import jwt from 'jsonwebtoken';
import { config } from '../config';

export interface TokenPayload {
  id: string;
  email: string;
  role: 'ADMIN' | 'EMPLOYEE';
}

export const generateToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn as jwt.SignOptions['expiresIn'],
  });
};

export const verifyJwtToken = (token: string): TokenPayload => {
  return jwt.verify(token, config.jwtSecret) as TokenPayload;
};

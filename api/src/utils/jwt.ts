import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET as string || 'supersecret';

export const signToken = (payload: { id: string; email: string; firstName: string; lastName: string; role: string }) =>
  jwt.sign(payload, JWT_SECRET, { expiresIn: '2h' });

export const verifyToken = (token: string) =>
  jwt.verify(token, JWT_SECRET);

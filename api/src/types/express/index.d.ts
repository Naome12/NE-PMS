import { Request } from 'express';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    firstname: string;
    lastname: string;
    role: 'ATTENDANT' | 'ADMIN' ;
  };
}

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'ATTENDANT' | 'ADMIN';
  createdAt?: string;
};


export interface Car {
  id: string;
  plateNumber: string;
  parkingCode: string;
  attendantId: string;
  entryTime: string;
  exitTime?: string;
  duration?: string;
  chargedAmount?: number;
}


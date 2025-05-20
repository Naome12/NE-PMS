export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'ATTENDANT' | 'ADMIN';
  createdAt?: string;
};

export type Vehicle = {
  id: string;
  plateNumber: string;
  type: string;
};

export type ParkingSpot = {
  id: string;
  label: string;
  section: string;
  number: number;
  status: 'FREE' | 'RESERVED' | 'OCCUPIED';
  type: 'CAR' | 'MOTORCYCLE' | 'TRUCK' | 'BUS' | 'VAN' | 'BICYCLE';
};

export type ParkingSession = {
  id: string;
  vehicle: Vehicle;
  spot: ParkingSpot | null;
  spotId: string;
  checkInAt: string;
  checkedOutAt?: string;
  duration?: string;
  totalCost?: number;
};

export type Ticket = {
  id: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  vehicleId: string;
  spotId: string;
  requestedById: string;
  approvedById?: string | null;
  createdAt: string;
  vehicle?: {
    id: string;
    plateNumber: string;
    type: 'CAR' | 'MOTORCYCLE' | 'TRUCK' | 'BUS' | 'VAN' | 'BICYCLE';
  };
  spot?: {
    id: string;
    section: string;
    number: number;
    status: 'FREE' | 'RESERVED' | 'OCCUPIED';
    type: 'CAR' | 'MOTORCYCLE' | 'TRUCK' | 'BUS' | 'VAN' | 'BICYCLE';
  };
  requestedBy?: {
    id: string;
    name: string;
    email: string;
    role: 'ATTENDANT' | 'ADMIN';
  };
  approvedBy?: {
    id: string;
    name: string;
    email: string;
    role: 'ATTENDANT' | 'ADMIN';
  } | null;
};
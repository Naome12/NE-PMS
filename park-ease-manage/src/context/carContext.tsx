// src/context/CarContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import api from '@/lib/lib'; // your axios instance

export interface Car {
  id: string;
  plateNumber: string;
  parkingCode: string;
  attendantId: string;
  entryTime: string;
  exitTime?: string;
  chargedAmount?: number;
}

interface CarContextType {
  cars: Car[];
  loading: boolean;
  registerEntry: (plateNumber: string, parkingCode: string) => Promise<void>;
  registerExit: (plateNumber: string) => Promise<{ chargedAmount: number; parkedDuration: string } | null>;
  fetchCars: () => Promise<void>;
}

const CarContext = createContext<CarContextType | undefined>(undefined);

export const CarProvider = ({ children }: { children: ReactNode }) => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCars = async () => {
    setLoading(true);
    try {
      const res = await api.get<Car[]>('/cars'); // You need an endpoint to get all cars (or by attendant)
      setCars(res.data);
    } catch (error) {
      console.error('Error fetching cars:', error);
    } finally {
      setLoading(false);
    }
  };

  const registerEntry = async (plateNumber: string, parkingCode: string) => {
    setLoading(true);
    try {
      await api.post('/car/register', { plateNumber, parkingCode });
      await fetchCars(); // refresh list
    } catch (error) {
      console.error('Error registering car entry:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const registerExit = async (plateNumber: string) => {
    setLoading(true);
    try {
      const res = await api.post('/car/exit', { plateNumber });
      await fetchCars(); // refresh list
      return res.data.data; // { chargedAmount, parkedDuration }
    } catch (error) {
      console.error('Error registering car exit:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return (
    <CarContext.Provider value={{ cars, loading, registerEntry, registerExit, fetchCars }}>
      {children}
    </CarContext.Provider>
  );
};

export const useCarContext = () => {
  const context = useContext(CarContext);
  if (!context) {
    throw new Error('useCarContext must be used within a CarProvider');
  }
  return context;
};

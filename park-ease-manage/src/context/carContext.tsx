// context/CarContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import api from '../lib/lib';
import { Car } from '../types';

interface CarContextType {
  cars: Car[];
  enteredCars: Car[];
  exitedCars: Car[];
  loading: boolean;
  fetchCars: () => Promise<void>;
  fetchParkedCars: () => Promise<void>;
  fetchExitedCars: () => Promise<void>;
  registerEntry: (plateNumber: string, parkingCode: string) => Promise<void>;
  registerExit: (plateNumber: string) => Promise<{ chargedAmount: number; parkedDuration: string } | null>;
}

const CarContext = createContext<CarContextType | undefined>(undefined);

export const CarProvider = ({ children }: { children: ReactNode }) => {
  const [cars, setCars] = useState<Car[]>([]);
  const [enteredCars, setEnteredCars] = useState<Car[]>([]);
  const [exitedCars, setExitedCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCars = async () => {
    setLoading(true);
    try {
      const res = await api.get<Car[]>('/car');
      setCars(res.data);
    } catch (error) {
      console.error('Error fetching cars:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchParkedCars = async () => {
    setLoading(true);
    try {
      const res = await api.get<Car[]>('/car/entered');
      setEnteredCars(res.data);
    } catch (error) {
      console.error('Error fetching parked cars:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchExitedCars = async () => {
    setLoading(true);
    try {
      const res = await api.get<Car[]>('/car/outgoing');
      setExitedCars(res.data);
    } catch (error) {
      console.error('Error fetching exited cars:', error);
    } finally {
      setLoading(false);
    }
  };

  const registerEntry = async (plateNumber: string, parkingCode: string) => {
    setLoading(true);
    try {
      await api.post('/car/register', { plateNumber, parkingCode });
      await fetchCars();
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
      await fetchCars();
      return res.data.data;
    } catch (error) {
      console.error('Error registering car exit:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return (
    <CarContext.Provider
      value={{
        cars,
        enteredCars,
        exitedCars,
        loading,
        fetchCars,
        fetchParkedCars,
        fetchExitedCars,
        registerEntry,
        registerExit,
      }}
    >
      {children}
    </CarContext.Provider>
  );
};

export const useCarContext = (): CarContextType => {
  const context = useContext(CarContext);
  if (!context) {
    throw new Error('useCarContext must be used within a CarProvider');
  }
  return context;
};

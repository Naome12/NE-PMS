import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '@/lib/lib';
import type { ReactNode } from 'react';

export interface Park {
  code: string;
  name: string;
  location: string;
  availableSpaces: number;
  feePerHour: number;
  status: 'FREE' | 'OCCUPIED' | 'RESERVED';
}

export interface User {
  id: string;
  email: string;
  role: 'ADMIN' | 'ATTENDANT' | string;
  firstName?: string;
  lastName?: string;
}

interface ParkingContextType {
  currentUser: User | null;
  parks: Park[];
  availableParks: Park[];
  loading: boolean;
  isLoading: boolean;
  refreshParks: () => Promise<void>;
  refreshAvailableParks: () => Promise<void>;
  setCurrentUser: (user: User | null) => void;
}

const ParkingContext = createContext<ParkingContextType | undefined>(undefined);

export const ParkingProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [parks, setParks] = useState<Park[]>([]);
  const [availableParks, setAvailableParks] = useState<Park[]>([]);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // this is the one used in MainLayout

  const refreshParks = async () => {
    setLoading(true);
    try {
      const res = await api.get('/park');
      setParks(res.data);
    } catch (error) {
      console.error('Failed to fetch parks:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshAvailableParks = async () => {
    setLoading(true);
    try {
      const res = await api.get('/park/available');
      setAvailableParks(res.data);
      console.log('Available parks:', res.data);
    } catch (error) {
      console.error('Failed to fetch available parks:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const res = await api.get('/auth/me');
      setCurrentUser(res.data);
    } catch (err) {
      console.error('Failed to fetch current user:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  return (
    <ParkingContext.Provider
      value={{
        currentUser,
        parks,
        availableParks,
        loading,
        isLoading,
        refreshParks,
        refreshAvailableParks,
        setCurrentUser,
      }}
    >
      {children}
    </ParkingContext.Provider>
  );
};

export const useParkingContext = (): ParkingContextType => {
  const context = useContext(ParkingContext);
  if (!context) {
    throw new Error('useParkingContext must be used within a ParkingProvider');
  }
  return context;
};

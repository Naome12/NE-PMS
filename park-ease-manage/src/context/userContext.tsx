import { createContext, useContext, useEffect, useState } from 'react';
import api from '@/lib/lib';
import { User } from '@/types';

const UserContext = createContext<{
  users: User[];
  isLoading: boolean;
  error: string | null;
  fetchUsers: () => Promise<void>;
} | null>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/auth');
      console.log('Fetched users response:', res.data);
      if (!Array.isArray(res.data.users)) {
        throw new Error('Invalid user data format');
      }
      setUsers(res.data.users);
    } catch (err: any) {
      console.error('Failed to fetch users:', err.response?.status, err.response?.data || err.message);
      setError(err.response?.data?.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <UserContext.Provider value={{ users, isLoading, error, fetchUsers }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};
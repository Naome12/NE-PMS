import { createContext, useContext, useEffect, useState } from 'react';
import api from '@/lib/lib';
import { Ticket } from '@/types';

type TicketContextType = {
  tickets: Ticket[];
  isLoading: boolean;
  error: string | null;
  fetchTickets: () => Promise<void>;
  approveTicket: (ticketId: string) => Promise<void>;
  rejectTicket: (ticketId: string) => Promise<void>;
  bookTicket: (data: {
    plateNumber: string;
    type: string;
    spotId: string;
  }) => Promise<{ success: boolean; message: string }>;
};

const TicketContext = createContext<TicketContextType | null>(null);

export const TicketProvider = ({ children }: { children: React.ReactNode }) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/ticket');
      if (!Array.isArray(res.data)) {
        throw new Error('Invalid ticket data format');
      }
      setTickets(res.data);
    } catch (err: any) {
      console.error('Failed to fetch tickets:', err);
      setError(err.response?.data?.message || 'Failed to fetch tickets');
    } finally {
      setLoading(false);
    }
  };

  const bookTicket = async (data: {
    plateNumber: string;
    type: string;
    spotId: string;
  }) => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.post('/ticket/book', data);
      await fetchTickets(); // Refresh the tickets list
      return { success: true, message: res.data.message };
    } catch (err: any) {
      console.error('Booking failed:', err);
      setError(err.response?.data?.message || 'Booking failed');
      return { 
        success: false, 
        message: err.response?.data?.message || 'Booking failed' 
      };
    } finally {
      setLoading(false);
    }
  };

  const approveTicket = async (ticketId: string) => {
    try {
      setError(null);
      await api.patch(`/ticket/approve/${ticketId}`);
      await fetchTickets();
    } catch (err: any) {
      console.error('Failed to approve ticket:', err);
      setError(err.response?.data?.message || 'Failed to approve ticket');
    }
  };

  const rejectTicket = async (ticketId: string) => {
    try {
      setError(null);
      await api.patch(`/ticket/reject/${ticketId}`);
      await fetchTickets();
    } catch (err: any) {
      console.error('Failed to reject ticket:', err);
      setError(err.response?.data?.message || 'Failed to reject ticket');
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  return (
    <TicketContext.Provider
      value={{ 
        tickets, 
        isLoading, 
        error, 
        fetchTickets, 
        bookTicket,
        approveTicket, 
        rejectTicket 
      }}
    >
      {children}
    </TicketContext.Provider>
  );
};

export const useTicketContext = () => {
  const context = useContext(TicketContext);
  if (!context) {
    throw new Error('useTicketContext must be used within a TicketProvider');
  }
  return context;
};

import { useState } from 'react';
import { MainLayout } from '@/components/Layout/MainLayout';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useParkingContext } from '@/context/ParkingContext';
import { useToast } from '@/hooks/use-toast';
import { BookTicketForm } from '@/components/Tickets/BookTicketForm';

export const UserTicketBooking = () => {

  return (
    <MainLayout>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ticket Booking</h1>
          <p className="text-muted-foreground">ParkMaster Ticket Booking.</p>
        </div>
      </div>
      
      <div className="justify-center items-center flex flex-col">
        <BookTicketForm />
        
      </div>
    </MainLayout>
  );
};

export default UserTicketBooking;

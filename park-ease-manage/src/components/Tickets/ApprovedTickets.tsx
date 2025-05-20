import React from 'react';
import { useTicketContext } from '@/context/ticketContext';
import { Button } from '@/components/ui/button'; // Use ShadCN Button instead of dummy

interface Ticket {
  id: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  vehicle?: {
    plateNumber: string;
  };
  spot?: {
    section: string;
    number: number;
  };
  createdAt: string;
}

export const TicketApprovalList: React.FC = () => {
  const { tickets, isLoading, error, approveTicket, rejectTicket } = useTicketContext();

  const pendingTickets = tickets.filter(ticket => ticket.status === 'PENDING');

  if (isLoading) {
    return (
      <div className="rounded-md border mt-8 p-4">
        <h2 className="text-xl font-semibold mb-4">Pending Ticket Approvals</h2>
        <p className="text-center text-gray-500">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md border mt-8 p-4">
        <h2 className="text-xl font-semibold mb-4">Pending Ticket Approvals</h2>
        <p className="text-center text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border mt-8 p-4">
      <h2 className="text-xl font-semibold mb-4">Pending Ticket Approvals</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border p-2">Vehicle</th>
            <th className="border p-2">Spot</th>
            <th className="border p-2">Requested At</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {pendingTickets.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center p-4 text-gray-500">
                No pending ticket requests.
              </td>
            </tr>
          ) : (
            pendingTickets.map(ticket => (
              <tr key={ticket.id}>
                <td className="border p-2">{ticket.vehicle?.plateNumber || 'Unknown'}</td>
                <td className="border p-2">
                  {ticket.spot ? `${ticket.spot.section}-${ticket.spot.number}` : 'Unknown'}
                </td>
                <td className="border p-2">
                  {new Date(ticket.createdAt).toLocaleString()}
                </td>
                <td className="border p-2">{ticket.status}</td>
                <td className="border p-2 space-x-2">
                  <Button variant="default" onClick={() => approveTicket(ticket.id)}>
                    Approve
                  </Button>
                  <Button variant="destructive" onClick={() => rejectTicket(ticket.id)}>
                    Reject
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
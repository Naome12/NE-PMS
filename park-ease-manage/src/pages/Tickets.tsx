import { MainLayout } from "@/components/Layout/MainLayout";
import { TicketApprovalList } from "@/components/Tickets/ApprovedTickets";
import React, { useState } from "react";

// Example initial tickets (replace with your real data or fetch from API)
const initialTickets = [
  {
    id: "1",
    status: "PENDING",
    vehicle: { plateNumber: "ABC123" },
    spot: { section: "A", number: 1 },
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    status: "PENDING",
    vehicle: { plateNumber: "XYZ789" },
    spot: { section: "B", number: 2 },
    createdAt: new Date().toISOString(),
  },
];

export const Tickets = () => {
  const [tickets, setTickets] = useState(initialTickets);

  const approveTicket = (id: string) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: "APPROVED" } : t))
    );
  };

  const rejectTicket = (id: string) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: "REJECTED" } : t))
    );
  };

  return (
    <MainLayout>
      <TicketApprovalList
        tickets={tickets}
        approveTicket={approveTicket}
        rejectTicket={rejectTicket}
      />
    </MainLayout>
  );
};

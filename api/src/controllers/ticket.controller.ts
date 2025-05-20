// controllers/ticket.controller.ts
import { Request, Response } from 'express';
import { prisma } from '../../prisma/client';
import { AuthRequest } from '../types/express'; // Assuming you have extended Request with user info

// Book ticket - any authenticated USER can book
export const bookTicket = async (req: AuthRequest, res: Response) => {
  const { plateNumber, type, spotId } = req.body;

  if (req.user?.role !== 'USER') {
     res.status(403).json({ message: 'Only USER role can book tickets' });
     return;
  }

  try {
    // Start a transaction
    const result = await prisma.$transaction(async (prisma) => {
      // 1. Check spot availability
      const spot = await prisma.parkingSpot.findUnique({ 
        where: { id: spotId } 
      });
      
      if (!spot || spot.status !== 'FREE') {
        throw new Error('Spot not available');
      }

      // 2. Find or create vehicle
      let vehicle = await prisma.vehicle.findUnique({ 
        where: { plateNumber } 
      });
      
      if (!vehicle) {
        vehicle = await prisma.vehicle.create({
          data: { plateNumber, type },
        });
      }

      // 3. Check for existing active tickets
      const existingActiveTicket = await prisma.ticket.findFirst({
        where: {
          vehicleId: vehicle.id,
          status: {
            in: ['PENDING', 'APPROVED'],
          },
        },
      });

      if (existingActiveTicket) {
        throw new Error('Vehicle already has an active ticket');
      }

      // 4. Create ticket and update spot
      const ticket = await prisma.ticket.create({
        data: {
          vehicleId: vehicle.id,
          spotId,
          status: 'PENDING',
          requestedById: req.user!.id,
        },
        
      });

      await prisma.parkingSpot.update({
        where: { id: spotId },
        data: { status: 'RESERVED' },
      });

      return ticket;
    });

     res.status(201).json({ 
      message: 'Ticket booked and spot reserved, pending approval',
      ticket: result  
    });
    return;

  } catch (error: any) {
    console.error('Booking error:', error);
    res.status(400).json({ 
      message: error.message || 'Booking failed' 
    });
     return;
  }
};

// Approve ticket - only ADMIN or OPERATOR
export const approveTicket = async (req: AuthRequest, res: Response) => {
  const ticketId = req.params.id;

  try {
    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
      include: { spot: true },
    });

    if (!ticket) {
      res.status(404).json({ message: 'Ticket not found' });
      return;
    }

    if (ticket.status !== 'PENDING') {
      res.status(400).json({ message: 'Only pending tickets can be approved' });
      return;
    }

    // Update ticket status to APPROVED and assign approver
    await prisma.ticket.update({
      where: { id: ticketId },
      data: {
        status: 'APPROVED',
        approvedById: req.user!.id,
      },
    });

    res.status(200).json({ message: 'Ticket approved' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Approval failed' });
  }
};

// Reject ticket - only ADMIN or OPERATOR
export const rejectTicket = async (req: AuthRequest, res: Response) => {
  const ticketId = req.params.id;

  try {
    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
      include: { spot: true },
    });

    if (!ticket) {
      res.status(404).json({ message: 'Ticket not found' });
      return;
    }

    if (ticket.status !== 'PENDING') {
      res.status(400).json({ message: 'Only pending tickets can be rejected' });
      return;
    }

    // Update ticket status to REJECTED, assign approver, and free the spot
    await prisma.$transaction([
      prisma.ticket.update({
        where: { id: ticketId },
        data: {
          status: 'REJECTED',
          approvedById: req.user!.id,
        },
      }),
      prisma.parkingSpot.update({
        where: { id: ticket.spotId },
        data: { status: 'FREE' },
      }),
    ]);

    res.status(200).json({ message: 'Ticket rejected and spot freed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Rejection failed' });
  }
};

// Get all tickets
export const getAllTickets = async (_req: Request, res: Response) => {
  try {
    const tickets = await prisma.ticket.findMany({
      include: {
        vehicle: true,
        spot: true,
        requestedBy: true,
        approvedBy: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.status(200).json(tickets);
  } catch (error) {
    console.error('Error fetching tickets:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get a ticket by ID
export const getTicketById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const ticket = await prisma.ticket.findUnique({
      where: { id },
      include: {
        vehicle: true,
        spot: true,
        requestedBy: true,
        approvedBy: true,
      },
    });

    if (!ticket) {
       res.status(404).json({ message: 'Ticket not found' });
       return;
    }

    res.status(200).json(ticket);
  } catch (error) {
    console.error('Error fetching ticket:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


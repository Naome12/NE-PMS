// src/controllers/park.controller.ts
import { Request, Response } from 'express';
import { prisma } from '../../prisma/client';
import { CreateParkSchema } from '../dtos/park.dto';
import { AuthRequest } from '../types/express';

export const registerPark = async (req: AuthRequest, res: Response): Promise<void> => {
  // Validate incoming request body (without ownerId)
  const parsed = CreateParkSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({ errors: parsed.error.format() });
    return;
  }

  const ownerId = req.user?.id;
  if (!ownerId) {
    res.status(401).json({ message: 'Unauthorized: Missing user info' });
    return;
  }

  const {
    code,
    name,
    availableSpaces,
    location,
    feePerHour,
    status,
  } = parsed.data;

  try {
    // Check if the park code already exists
    const existingPark = await prisma.park.findUnique({ where: { code } });
    if (existingPark) {
      res.status(409).json({ message: `Park with code '${code}' already exists.` });
      return;
    }

    // Create the new park
    const newPark = await prisma.park.create({
      data: {
        code,
        name,
        availableSpaces,
        location,
        feePerHour,
        status: status ?? 'FREE',
        ownerId,  // set from token
      },
    });

    res.status(201).json({ message: 'Park registered successfully', park: newPark });
  } catch (error) {
    console.error('Error registering park:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
export const getParks = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const parks = await prisma.park.findMany({
      select: {
        code: true,
        name: true,
        location: true,
        availableSpaces: true,
        feePerHour: true,
        status: true,
      },
    });

    res.status(200).json(parks);
  } catch (error) {
    console.error('Error fetching parks:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getAvailableParks = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const availableParks = await prisma.park.findMany({
      where: {
        availableSpaces: {
          gt: 0,
        }
        // Remove `status` filter
      },
      select: {
        code: true,
        name: true,
        location: true,
        availableSpaces: true,
        feePerHour: true,
        status: true,
      },
    });

    res.status(200).json(availableParks);
  } catch (error) {
    console.error('Error fetching parks:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


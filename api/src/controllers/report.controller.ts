import { Request, Response } from 'express';
import { prisma } from '../../prisma/client';
import { CreateParkSchema } from '../dtos/park.dto';
import { AuthRequest } from '../types/express';

export const getOutgoingCarsReport = async (req: Request, res: Response): Promise<void> => {
  const { start, end, page = '1', limit = '10' } = req.query;

  if (!start || !end) {
    res.status(400).json({ message: 'Start and end datetime are required.' });
    return;
  }

  const pageNumber = parseInt(page as string, 10);
  const pageSize = parseInt(limit as string, 10);
  const skip = (pageNumber - 1) * pageSize;

  try {
    const [cars, totalCount] = await Promise.all([
      prisma.car.findMany({
        where: {
          exitTime: {
            gte: new Date(start as string),
            lte: new Date(end as string),
          },
        },
        select: {
          plateNumber: true,
          entryTime: true,
          exitTime: true,
          chargedAmount: true,
          park: {
            select: {
              name: true,
              location: true,
            },
          },
        },
        skip,
        take: pageSize,
        orderBy: { exitTime: 'desc' },
      }),

      prisma.car.count({
        where: {
          exitTime: {
            gte: new Date(start as string),
            lte: new Date(end as string),
          },
        },
      }),
    ]);

    const totalCharged = cars.reduce((total, car) => total + Number(car.chargedAmount), 0);

    res.status(200).json({
      page: pageNumber,
      limit: pageSize,
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize),
      totalCharged,
      outgoingCars: cars,
    });
  } catch (error) {
    console.error('Error fetching paginated outgoing report:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



export const getEnteredCarsReport = async (req: Request, res: Response): Promise<void> => {
  const { start, end, page = '1', limit = '10' } = req.query;

  if (!start || !end) {
    res.status(400).json({ message: 'Start and end datetime are required.' });
    return;
  }

  const pageNumber = parseInt(page as string, 10);
  const pageSize = parseInt(limit as string, 10);
  const skip = (pageNumber - 1) * pageSize;

  try {
    const [cars, totalCount] = await Promise.all([
      prisma.car.findMany({
        where: {
          entryTime: {
            gte: new Date(start as string),
            lte: new Date(end as string),
          },
        },
        select: {
          plateNumber: true,
          entryTime: true,
          park: {
            select: {
              name: true,
              location: true,
            },
          },
        },
        skip,
        take: pageSize,
        orderBy: { entryTime: 'desc' },
      }),

      prisma.car.count({
        where: {
          entryTime: {
            gte: new Date(start as string),
            lte: new Date(end as string),
          },
        },
      }),
    ]);

    res.status(200).json({
      page: pageNumber,
      limit: pageSize,
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize),
      enteredCars: cars,
    });
  } catch (error) {
    console.error('Error fetching paginated entry report:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


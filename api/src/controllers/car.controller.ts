import { Request, Response } from 'express';
import { prisma } from '../../prisma/client';
import { RegisterCarEntrySchema } from '../dtos/car.dto';
import { AuthRequest } from '../types/express';

export const registerCarEntry = async (req: AuthRequest, res: Response) => {
  const parsed = RegisterCarEntrySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ errors: parsed.error.format() });
    return;
  }

  const { plateNumber, parkingCode } = parsed.data;

  if (!req.user || !req.user.id) {
    res.status(401).json({ message: 'Unauthorized: User not found in token' });
    return;
  }

  const attendantId = req.user.id;

  try {
    const park = await prisma.park.findUnique({ where: { code: parkingCode } });
    if (!park) {
      res.status(404).json({ message: 'Park not found' });
      return;
    }
    if (park.availableSpaces <= 0) {
      res.status(400).json({ message: 'No available space' });
      return;
    }

    const car = await prisma.car.create({
      data: {
        plateNumber,
        parkingCode,
        attendantId,
      },
    });

    await prisma.ticket.create({
      data: {
        carId: car.id,
        parkingCode,
        attendantId,
      },
    });

    const updatedAvailable = park.availableSpaces - 1;

    await prisma.park.update({
      where: { code: parkingCode },
      data: {
        availableSpaces: updatedAvailable,
        status: updatedAvailable === 0 ? 'OCCUPIED' : 'RESERVED',
      },
    });

    // 🧾 Create entry report
    await prisma.report.create({
      data: {
        generatedById: attendantId,
        startRange: car.entryTime,
        endRange: car.entryTime,
        type: 'ENTRIES',
        totalCars: 1,
        totalCharged: 0.00,
      },
    });

    res.status(201).json({ message: 'Car entry registered successfully', carId: car.id });
  } catch (err) {
    console.error('Car Entry Error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};


export const carExit = async (req: AuthRequest, res: Response) => {
  const { plateNumber } = req.body;

  if (!req.user || !req.user.id) {
    res.status(401).json({ message: 'Unauthorized: User not found in token' });
    return;
  }

  try {
    const car = await prisma.car.findUnique({
      where: { plateNumber },
      include: { park: true },
    });

    if (!car) {
      res.status(404).json({ message: 'Car not found' });
      return;
    }

    if (car.exitTime) {
      res.status(400).json({ message: 'Car already exited' });
      return;
    }

    const now = new Date();
    const entryTime = new Date(car.entryTime);
    const durationMs = now.getTime() - entryTime.getTime();
    const hours = Math.ceil(durationMs / (1000 * 60 * 60));

    const feePerHour = Number(car.park.feePerHour);
    const totalFee = feePerHour * hours;

    await prisma.car.update({
      where: { id: car.id },
      data: {
        exitTime: now,
        chargedAmount: totalFee,
      },
    });

    const newAvailableSpaces = car.park.availableSpaces + 1;
    let newStatus: 'FREE' | 'RESERVED' | 'OCCUPIED' = 'RESERVED';

    if (newAvailableSpaces >= 5) {
      newStatus = 'FREE';
    }

    await prisma.park.update({
      where: { code: car.parkingCode },
      data: {
        availableSpaces: newAvailableSpaces,
        status: newStatus,
      },
    });

    // 🧾 Create exit report
    await prisma.report.create({
      data: {
        generatedById: req.user.id,
        startRange: now,
        endRange: now,
        type: 'EXITS',
        totalCars: 1,
        totalCharged: totalFee,
      },
    });

    res.status(200).json({
      message: 'Car exit recorded',
      data: {
        plateNumber: car.plateNumber,
        parkedDuration: `${hours} hour(s)`,
        chargedAmount: totalFee,
      },
    });

  } catch (error) {
    console.error('Car Exit Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


export const getAllCars = async (req: Request, res: Response) => {
  try {
    const cars = await prisma.car.findMany({
      orderBy: { entryTime: 'desc' },
      include: {
        attendant: {
          select: {
            id: true,
            firstName: true,
          },
        },
        park: {
          select: {
            code: true,
            name: true,
            feePerHour: true,
          },
        },
      },
    });

    res.status(200).json({ total: cars.length, data: cars });
  } catch (error) {
    console.error('Error fetching cars:', error);
    res.status(500).json({ message: 'Failed to fetch cars' });
  }
};

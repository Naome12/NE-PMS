import { z } from 'zod';
import { ParkStatus } from '../generated/prisma';


export const CreateParkSchema = z.object({
  code: z.string().min(1, "Code is required"),
  name: z.string().min(1, "Name is required"),
  availableSpaces: z.number().int().nonnegative("Available spaces must be >= 0"),
  location: z.string().min(1, "Location is required"),
  feePerHour: z.number().nonnegative("Fee per hour must be >= 0"),
  status: z.nativeEnum(ParkStatus).optional(),
});

// TypeScript type for use elsewhere if needed
export type CreateParkDto = z.infer<typeof CreateParkSchema>;

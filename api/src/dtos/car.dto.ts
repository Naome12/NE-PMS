import { z } from 'zod';

export const RegisterCarEntrySchema = z.object({
  plateNumber: z.string().min(3),
  parkingCode: z.string().min(1),

});

export type RegisterCarEntryDto = z.infer<typeof RegisterCarEntrySchema>;

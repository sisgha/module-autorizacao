import * as z from 'zod';

export const UUIDZod = z.string().uuid();

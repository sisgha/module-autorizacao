import * as z from 'zod';

export const IdIntZod = z.number().int().positive();

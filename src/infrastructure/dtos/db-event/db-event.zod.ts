import * as z from 'zod';

const UUIDZod = z.string().uuid();
const IdIntZod = z.number().int().positive();

export const DbEventZod = z.object({
  id: z.string().uuid(),

  correlationId: UUIDZod.nullable(),
  action: z.string(),
  tableName: z.string(),
  rowId: z.union([UUIDZod, IdIntZod]),
  data: z.any().nullable(),
  dateEvent: z.string().datetime(),
  logId: UUIDZod,

  dateCreated: z.string().datetime(),
  resource: z.string(),
});

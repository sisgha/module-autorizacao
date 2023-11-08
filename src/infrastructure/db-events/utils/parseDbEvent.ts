import { tryJSONParse } from '../../utils';
import { DbEventZod } from '../../dtos';
import { DbEventModel } from '../../../domain';
import { HandleDbEventOutputReason } from '../domain/HandleDbEventOutputReason';

export const parseDBEvent = async (dbEventRaw: unknown) => {
  const dbEvent = typeof dbEventRaw === 'string' ? tryJSONParse(dbEventRaw) : dbEventRaw;

  const result = await DbEventZod.safeParseAsync(dbEvent);

  if (result.success) {
    const dbEvent = result.data as DbEventModel;

    return {
      success: true,
      reason: null,
      data: dbEvent,
    } as const;
  }

  return {
    success: false,
    data: null,
    reason: HandleDbEventOutputReason.INVALID_DB_EVENT,
  } as const;
};

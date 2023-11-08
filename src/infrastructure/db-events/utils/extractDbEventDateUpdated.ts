import { extractDbEventDataField } from './extractDbEventDataField';

export const extractDbEventDataDateUpdated = extractDbEventDataField<Date | string | number>('date_updated');

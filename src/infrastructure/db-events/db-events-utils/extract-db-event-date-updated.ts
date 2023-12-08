import { extractDbEventGenericDataField } from './extract-db-event-generic-data-field';

export const extractDbEventDataDateUpdated = extractDbEventGenericDataField<Date | string | number>('dateUpdated');

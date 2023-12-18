import { camelCase, mapKeys } from 'lodash';

export const mapDbEventDataKeys = (data: any) => {
  if (data) {
    return mapKeys(data, (value, key) => camelCase(key));
  }

  return data;
};

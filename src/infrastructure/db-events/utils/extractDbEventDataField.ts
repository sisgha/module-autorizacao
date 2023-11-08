import * as _ from 'lodash';
import { PlaceholderUndefined } from './PlaceholderUndefined';

export const extractDbEventDataField =
  <ReturnType>(path: string) =>
  (data: any) =>
    _.get(data, path, PlaceholderUndefined) as ReturnType | typeof PlaceholderUndefined;

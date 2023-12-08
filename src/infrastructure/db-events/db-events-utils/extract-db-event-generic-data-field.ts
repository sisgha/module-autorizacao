import * as _ from 'lodash';
import { PlaceholderUndefined } from './placeholder-undefined';

export const extractDbEventGenericDataField =
  <ReturnType>(path: string) =>
  (data: any) =>
    _.get(data, path, PlaceholderUndefined) as ReturnType | typeof PlaceholderUndefined;

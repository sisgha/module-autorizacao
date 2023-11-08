export interface DbEventModel<D = unknown> {
  id: string;

  // ...

  correlationId: string | null;
  action: string;
  tableName: string;
  rowId: unknown;
  data: D | null;
  dateEvent: Date | string | number;

  logId: string;

  // ...

  dateCreated: Date | string | number;

  //

  resource: string;
}

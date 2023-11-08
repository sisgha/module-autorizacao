export interface GenericProjection<D = unknown> {
  id: string;

  //

  data: D | null;

  //

  dateCreated: Date;
  dateUpdated: Date;
}

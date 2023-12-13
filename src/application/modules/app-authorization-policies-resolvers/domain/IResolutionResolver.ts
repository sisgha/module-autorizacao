export enum IResolutionResolverStrategy {
  CASL = 'casl',
  DATABASE = 'db',
}

export type IResolutionResolverCasl = {
  strategy: IResolutionResolverStrategy.CASL;
  check(): Promise<boolean>;
};

export type IResolutionResolverDatabase = {
  strategy: IResolutionResolverStrategy.DATABASE;
  check(): Promise<boolean>;
  streamIdsJson(): AsyncIterable<string>;
};

export type IResolutionResolver = IResolutionResolverCasl | IResolutionResolverDatabase;

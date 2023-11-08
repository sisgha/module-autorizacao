export interface IConfigDatabase {
  getDBConnection(): string | undefined;
  getDBHost(): string | undefined;
  getDBPort(): string | undefined;
  getDBUsername(): string | undefined;
  getDBPassword(): string | undefined;
  getDBDatabase(): string | undefined;
  getDBSchema(): string | undefined;
  getDBUrl(): string | undefined;
  getDBUseSSL(): string | undefined;
}

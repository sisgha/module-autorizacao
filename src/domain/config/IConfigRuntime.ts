export interface IConfigRuntime {
  getRuntimeNodeEnv(): string;
  getRuntimeIsProduction(): boolean;
  getRuntimeIsDevelopment(): boolean;
}

import { IAuthorizationStatementSpecialAction } from './IAuthorizationStatementSpecialAction';

export interface IAuthorizationPolicyConstraintBaseStatement {
  alias(alias?: string | null): this;

  action(action: IAuthorizationStatementSpecialAction.MANAGE | string[] | string): this;
  target(target: string[] | string): this;

  where(condition: boolean): this;
  where(condition: string, params?: Record<string, any>): this;

  reject(): never;
  approve(): never;
  void(): never;
}

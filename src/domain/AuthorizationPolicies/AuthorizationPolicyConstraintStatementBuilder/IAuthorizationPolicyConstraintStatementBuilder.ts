import { IAuthorizationPolicyCondition } from '../AuthorizationPolicyCondition/IAuthorizationPolicyCondition';
import { IAuthorizationPolicyConstraintStatementBuilderSpecialAction } from './IAuthorizationPolicyConstraintStatementBuilderSpecialAction';
import { IAuthorizationPolicyConstraintStatementBuilderSpecialTarget } from './IAuthorizationPolicyConstraintStatementBuilderSpecialTarget';

export interface IAuthorizationPolicyConstraintStatementBuilder {
  alias(alias?: string | null): this;

  //

  action(action: IAuthorizationPolicyConstraintStatementBuilderSpecialAction.MANAGE | string[] | string): this;

  target(target: IAuthorizationPolicyConstraintStatementBuilderSpecialTarget.ALL | string[] | string): this;

  //

  where(condition: boolean): this;
  where(condition: IAuthorizationPolicyCondition): this;

  //

  inner_join(b_resource: string, b_alias: string, on_condition: IAuthorizationPolicyCondition): this;

  //

  reject(): void;
  approve(): void;
  void(): void;
}

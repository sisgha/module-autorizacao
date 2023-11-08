import { IAuthorizationPolicyConstraintBaseStatement } from '../authorization-policy-constraint-statement/IAuthorizationPolicyConstraintBaseStatement';

export interface IAuthorizationStatementStrategyDatabase extends IAuthorizationPolicyConstraintBaseStatement {
  inner_join(otherResource: string, onCondition: string): this;
}

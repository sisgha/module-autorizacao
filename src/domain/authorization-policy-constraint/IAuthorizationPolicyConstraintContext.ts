import { IAuthorizationStatementStrategyDatabase } from '../authorization-policy-constraint-statement-strategy-database';
import { IAuthorizationStatementStrategySimple } from '../authorization-policy-constraint-statement-strategy-simple';
import { ITargetActor } from '../sisgea/ITargetActor';

export interface IAuthorizationPolicyConstraintContext {
  targetActor: ITargetActor;

  statement(): IAuthorizationStatementStrategySimple;
  statement_db(): IAuthorizationStatementStrategyDatabase;
}

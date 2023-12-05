import { ITargetActor } from '../../sisgea/ITargetActor';
import { IAuthorizationPolicyConstraintStatementBuilder } from '../AuthorizationPolicyConstraintStatementBuilder/IAuthorizationPolicyConstraintStatementBuilder';

export interface IAuthorizationPolicyConstraintConstructContext {
  targetActor: ITargetActor;

  statement(): IAuthorizationPolicyConstraintStatementBuilder;
}

import { castArray } from 'lodash';
import {
  IAuthorizationPolicyAttachedConstraint,
  IAuthorizationPolicyConstraintAttachedStatement,
  IAuthorizationPolicyConstraintAttachedStatementBehaviour,
  IAuthorizationPolicyConstraintStatementBuilder,
  IAuthorizationPolicyConstraintStatementBuilderSpecialAction,
  IAuthorizationPolicyConstraintStatementBuilderSpecialTarget,
  ITargetActor,
} from '../../../domain';
import { IAuthorizationPolicyConstraintConstructContext } from '../../../domain/AuthorizationPolicies/AuthorizationPolicyConstraint';
import * as Builder from '../AuthorizationPolicyCondition/AuthorizationPolicyConditionBuilder';
import { AuthorizationPolicyConstraintAttachedStatementZod } from '../AuthorizationPolicyZod/AuthorizationPolicyConstraintAttachedStatementZod';

export class AuthorizationPolicyAttachedConstraintHandler {
  static async *construct(attachedConstraint: IAuthorizationPolicyAttachedConstraint, targetActor: ITargetActor) {
    const attachedStatements = new Set<IAuthorizationPolicyConstraintAttachedStatement>();

    const ctx: IAuthorizationPolicyConstraintConstructContext = {
      targetActor,

      statement() {
        const state: Partial<IAuthorizationPolicyConstraintAttachedStatement> = {
          behaviour: undefined,
          alias: null,
          action: undefined,
          target: undefined,
          where: undefined,
          inner_joins: [],
        };

        const attach = () => {
          const result = AuthorizationPolicyConstraintAttachedStatementZod.safeParse(state);

          if (result.success) {
            attachedStatements.add(<IAuthorizationPolicyConstraintAttachedStatement>result.data);

            return true;
          }

          throw new Error('Incomplete statement.');
        };

        const builder = <IAuthorizationPolicyConstraintStatementBuilder>{
          //

          alias(alias: string | null = null) {
            state.alias = alias;
            return builder;
          },

          action(action: IAuthorizationPolicyConstraintStatementBuilderSpecialAction.MANAGE | string[] | string) {
            if (action === IAuthorizationPolicyConstraintStatementBuilderSpecialAction.MANAGE) {
              state.action = action;
            } else {
              state.action = castArray(action);
            }

            return builder;
          },

          target(target: IAuthorizationPolicyConstraintStatementBuilderSpecialTarget.ALL | string[] | string) {
            if (target === IAuthorizationPolicyConstraintStatementBuilderSpecialTarget.ALL) {
              state.target = target;
            } else {
              state.target = castArray(target);
            }

            return builder;
          },

          where(condition: any) {
            if (typeof condition === 'boolean') {
              state.where = condition ? Builder.True() : Builder.False();
            } else {
              state.where = condition;
            }

            return builder;
          },

          inner_join(b_resource, b_alias, on_condition) {
            state.inner_joins ??= [];

            state.inner_joins.push({
              b_resource: b_resource,
              b_alias: b_alias,
              on_condition: on_condition,
            });

            return builder;
          },

          reject() {
            state.behaviour = IAuthorizationPolicyConstraintAttachedStatementBehaviour.REJECT;
            attach();
          },

          approve() {
            state.behaviour = IAuthorizationPolicyConstraintAttachedStatementBehaviour.APPROVE;
            attach();
          },

          void() {
            state.behaviour = IAuthorizationPolicyConstraintAttachedStatementBehaviour.VOID;
            attach();
          },
        };

        return builder;
      },
    };

    await attachedConstraint.constraint.construct(ctx);

    yield* attachedStatements;
  }
}

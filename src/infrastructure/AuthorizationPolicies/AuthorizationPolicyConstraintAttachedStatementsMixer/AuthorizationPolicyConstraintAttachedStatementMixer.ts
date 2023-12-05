import { AnyIterable, IAuthorizationPolicyConstraintAttachedStatement, IAuthorizationPolicyMixedStatement } from '../../../domain';
import { changeConditionAliasesUsages, getNewAlias } from '../AuthorizationPolicyCondition/AuthorizationPolicyConditionUtils';
import { attachBehaviourOnCondition } from './AuthorizationPolicyConstraintAttachedStatementsMixerUtils';

export class AuthorizationPolicyConstraintAttachedStatementMixer {
  #alias_counter = 0;

  #alias: string = 'row';
  #where: IAuthorizationPolicyMixedStatement['where'] = null;
  #inner_joins: IAuthorizationPolicyMixedStatement['inner_joins'] = [];

  private adaptAttachedStatement(attachedStatement: IAuthorizationPolicyConstraintAttachedStatement) {
    const attachedStatementClone = structuredClone(attachedStatement);

    //

    const aliasesMapping = new Map<string, string>();
    aliasesMapping.set(attachedStatementClone.alias, this.#alias);

    //

    attachedStatementClone.alias = this.#alias;

    //
    for (const inner_join of attachedStatementClone.inner_joins) {
      const old_alias = inner_join.b_alias;

      const new_alias = `b_${++this.#alias_counter}_${old_alias}`;

      aliasesMapping.set(old_alias, new_alias);

      inner_join.b_alias = getNewAlias(aliasesMapping, inner_join.b_alias);
    }

    changeConditionAliasesUsages(attachedStatementClone.where, aliasesMapping);

    for (const inner_join of attachedStatementClone.inner_joins) {
      changeConditionAliasesUsages(inner_join.on_condition, aliasesMapping);
    }

    return attachedStatementClone;
  }

  addAttachedStatement(attachedStatement: IAuthorizationPolicyConstraintAttachedStatement) {
    const adaptedAttachedStatement = this.adaptAttachedStatement(attachedStatement);

    this.#where = attachBehaviourOnCondition(this.#where ?? null, adaptedAttachedStatement.where, adaptedAttachedStatement.behaviour);

    this.#inner_joins.push(...adaptedAttachedStatement.inner_joins);

    return this;
  }

  async addAttachedStatements(attachedStatements: AnyIterable<IAuthorizationPolicyConstraintAttachedStatement>) {
    for await (const attachedStatement of attachedStatements) {
      this.addAttachedStatement(attachedStatement);
    }

    return this;
  }

  get state(): IAuthorizationPolicyMixedStatement {
    return structuredClone({
      alias: this.#alias,
      where: this.#where,
      inner_joins: this.#inner_joins,
    });
  }
}

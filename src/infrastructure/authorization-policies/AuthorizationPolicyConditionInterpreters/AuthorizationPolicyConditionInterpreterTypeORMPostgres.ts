import { InternalServerErrorException } from '@nestjs/common';

import {
  IAuthorizationPolicyCondition,
  IAuthorizationPolicyConditionType,
  IAuthorizationPolicyConditionValueAnd,
  IAuthorizationPolicyConditionValueEq,
  IAuthorizationPolicyConditionValueFalse,
  IAuthorizationPolicyConditionValueGreaterThan,
  IAuthorizationPolicyConditionValueGreaterThanOrEqual,
  IAuthorizationPolicyConditionValueIsNotNull,
  IAuthorizationPolicyConditionValueIsNull,
  IAuthorizationPolicyConditionValueLessThan,
  IAuthorizationPolicyConditionValueLessThanOrEqual,
  IAuthorizationPolicyConditionValueLiteral,
  IAuthorizationPolicyConditionValueNEq,
  IAuthorizationPolicyConditionValueNot,
  IAuthorizationPolicyConditionValueOr,
  IAuthorizationPolicyConditionValueResourceAttribute,
  IAuthorizationPolicyConditionValueTrue,
} from '@sisgea/authorization-policies-core';
import { IDatabaseAppResource } from '../../database/interfaces/IDatabaseAppResource';
import { getTypeORMPostgresResourceAttributeProjection } from './getTypeORMPostgresResourceAttributeProjection';

export class AuthorizationPolicyConditionInterpreterTypeORMPostgres {
  #params_counter: number = 0;

  #params = new Map<string, any>();

  constructor(
    //
    private databaseAppResources: IDatabaseAppResource[] = [],
    private aliasesMappings: Map<string, string> = new Map<string, string>(),
    initialParamsCounter = 0,
  ) {
    this.#params_counter = initialParamsCounter;
  }

  get params() {
    return {
      ...Object.fromEntries(this.#params),
    };
  }

  value_true() {
    return `TRUE`;
  }

  value_false() {
    return `FALSE`;
  }

  value_boolean(node: IAuthorizationPolicyConditionValueTrue | IAuthorizationPolicyConditionValueFalse) {
    return node.value ? this.value_true() : this.value_false();
  }

  value_literal(node: IAuthorizationPolicyConditionValueLiteral) {
    const { key } = this.attachParam(node.value);

    return `:${key}`;
  }

  value_resource_attribute(node: IAuthorizationPolicyConditionValueResourceAttribute) {
    return this.getResourceAttributeProjection(node.resource_alias, node.attribute);
  }

  value_not(node: IAuthorizationPolicyConditionValueNot) {
    return `NOT ${this.generic(node.value)}`;
  }

  value_is_not_null(node: IAuthorizationPolicyConditionValueIsNotNull) {
    return `${this.generic(node.value)} IS NOT NULL`;
  }

  value_is_null(node: IAuthorizationPolicyConditionValueIsNull) {
    return `${this.generic(node.value)} IS NULL`;
  }

  value_eq(node: IAuthorizationPolicyConditionValueEq) {
    return `(${this.generic(node.left)}) = (${this.generic(node.right)})`;
  }

  value_n_eq(node: IAuthorizationPolicyConditionValueNEq) {
    return `(${this.generic(node.left)}) <> (${this.generic(node.right)})`;
  }

  value_and(node: IAuthorizationPolicyConditionValueAnd) {
    return `(${this.generic(node.left)}) AND (${this.generic(node.right)})`;
  }

  value_or(node: IAuthorizationPolicyConditionValueOr) {
    return `(${this.generic(node.left)}) OR (${this.generic(node.right)})`;
  }

  value_gt(node: IAuthorizationPolicyConditionValueGreaterThan) {
    return `(${this.generic(node.left)}) > (${this.generic(node.right)})`;
  }

  value_gte(node: IAuthorizationPolicyConditionValueGreaterThanOrEqual) {
    return `${this.generic(node.left)}) >= (${this.generic(node.right)})`;
  }

  value_lt(node: IAuthorizationPolicyConditionValueLessThan) {
    return `${this.generic(node.left)}) < (${this.generic(node.right)})`;
  }

  value_lte(node: IAuthorizationPolicyConditionValueLessThanOrEqual) {
    return `${this.generic(node.left)}) <= (${this.generic(node.right)})`;
  }

  generic(node: IAuthorizationPolicyCondition) {
    switch (node.type) {
      case IAuthorizationPolicyConditionType.VALUE_BOOLEAN: {
        return this.value_boolean(node);
      }

      case IAuthorizationPolicyConditionType.VALUE_LITERAL: {
        return this.value_literal(node);
      }

      case IAuthorizationPolicyConditionType.VALUE_RESOURCE_ATTRIBUTE: {
        return this.value_resource_attribute(node);
      }

      case IAuthorizationPolicyConditionType.OPERATOR_UNARY_NOT: {
        return this.value_not(node);
      }

      case IAuthorizationPolicyConditionType.OPERATOR_UNARY_IS_NOT_NULL: {
        return this.value_is_not_null(node);
      }

      case IAuthorizationPolicyConditionType.OPERATOR_UNARY_IS_NULL: {
        return this.value_is_null(node);
      }

      case IAuthorizationPolicyConditionType.OPERATOR_BINARY_EQ: {
        return this.value_eq(node);
      }

      case IAuthorizationPolicyConditionType.OPERATOR_BINARY_N_EQ: {
        return this.value_n_eq(node);
      }

      case IAuthorizationPolicyConditionType.OPERATOR_BINARY_AND: {
        return this.value_and(node);
      }

      case IAuthorizationPolicyConditionType.OPERATOR_BINARY_OR: {
        return this.value_or(node);
      }

      case IAuthorizationPolicyConditionType.OPERATOR_BINARY_GT: {
        return this.value_gt(node);
      }

      case IAuthorizationPolicyConditionType.OPERATOR_BINARY_GTE: {
        return this.value_gte(node);
      }

      case IAuthorizationPolicyConditionType.OPERATOR_BINARY_LT: {
        return this.value_lt(node);
      }

      case IAuthorizationPolicyConditionType.OPERATOR_BINARY_LTE: {
        return this.value_lte(node);
      }

      default: {
        throw new InternalServerErrorException('Not implemented');
      }
    }
  }

  interpret(node: IAuthorizationPolicyCondition) {
    const sql = this.generic(node);
    const params = this.params;

    return {
      sql,
      params,
    };
  }

  private getResourceAttributeProjection(alias: string, attribute: string) {
    return getTypeORMPostgresResourceAttributeProjection(alias, attribute, this.databaseAppResources, this.aliasesMappings);
  }

  private attachParam(value: any) {
    const key = `param_${++this.#params_counter}`;

    this.#params.set(key, value);

    return {
      key,
    };
  }
}

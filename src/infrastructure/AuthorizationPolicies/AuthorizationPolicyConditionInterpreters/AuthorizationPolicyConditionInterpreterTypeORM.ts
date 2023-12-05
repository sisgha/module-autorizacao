import {
  IAuthorizationPolicyCondition,
  IAuthorizationPolicyConditionValueAnd,
  IAuthorizationPolicyConditionValueEq,
  IAuthorizationPolicyConditionValueFalse,
  IAuthorizationPolicyConditionValueGreaterThan,
  IAuthorizationPolicyConditionValueGreaterThanOrEqual,
  IAuthorizationPolicyConditionValueLessThan,
  IAuthorizationPolicyConditionValueLessThanOrEqual,
  IAuthorizationPolicyConditionValueLiteral,
  IAuthorizationPolicyConditionValueNEq,
  IAuthorizationPolicyConditionValueNot,
  IAuthorizationPolicyConditionValueOr,
  IAuthorizationPolicyConditionValueResourceAttribute,
  IAuthorizationPolicyConditionValueTrue,
} from '../../../domain';

export class AuthorizationPolicyConditionInterpreterTypeORM {
  #params_counter: number = 0;

  #params = new Map<string, any>();

  constructor(initialParamsCounter = 0) {
    this.#params_counter = initialParamsCounter;
  }

  private attachParam(value: any) {
    const key = `param_${++this.#params_counter}`;

    this.#params.set(key, value);

    return {
      key,
    };
  }

  get params() {
    return {
      ...this.#params,
    };
  }

  value_true(node: IAuthorizationPolicyConditionValueTrue) {
    return `TRUE`;
  }

  value_false(node: IAuthorizationPolicyConditionValueFalse) {
    return `FALSE`;
  }

  value_literal(node: IAuthorizationPolicyConditionValueLiteral) {
    const { key } = this.attachParam(node.value);

    return `:${key}`;
  }

  value_resource_attribute(node: IAuthorizationPolicyConditionValueResourceAttribute) {
    return `${node.resource_alias}.${node.attribute}`;
  }

  value_not(node: IAuthorizationPolicyConditionValueNot) {
    return `NOT (${this.generic(node.value)})`;
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
    return `(${this.generic(node.left)}) >= (${this.generic(node.right)})`;
  }

  value_lt(node: IAuthorizationPolicyConditionValueLessThan) {
    return `(${this.generic(node.left)}) < (${this.generic(node.right)})`;
  }

  value_lte(node: IAuthorizationPolicyConditionValueLessThanOrEqual) {
    return `(${this.generic(node.left)}) <= (${this.generic(node.right)})`;
  }

  generic(node: IAuthorizationPolicyCondition) {
    switch (node.type) {
      case 'true': {
        return this.value_true(node);
      }

      case 'false': {
        return this.value_false(node);
      }

      case 'literal': {
        return this.value_literal(node);
      }

      case 'resource_attribute': {
        return this.value_resource_attribute(node);
      }

      case 'not': {
        return this.value_not(node);
      }

      case 'eq': {
        return this.value_eq(node);
      }

      case 'n_eq': {
        return this.value_n_eq(node);
      }

      case 'and': {
        return this.value_and(node);
      }

      case 'or': {
        return this.value_or(node);
      }

      case 'gt': {
        return this.value_gt(node);
      }

      case 'gte': {
        return this.value_gte(node);
      }

      case 'lt': {
        return this.value_lt(node);
      }

      case 'lte': {
        return this.value_lte(node);
      }

      default: {
        return 'FALSE';
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

  static interpret(node: IAuthorizationPolicyCondition) {
    const interpreter = new AuthorizationPolicyConditionInterpreterTypeORM();

    const sql = interpreter.generic(node);
    const params = interpreter.params;

    return {
      sql,
      params,
    };
  }
}

import {
  IAuthorizationPolicyCondition,
  IAuthorizationPolicyConditionValue,
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

export const Literal = (value: any): IAuthorizationPolicyConditionValueLiteral => ({
  kind: 'value',
  type: 'literal',
  value,
});

export const True = (): IAuthorizationPolicyConditionValueTrue => ({
  kind: 'boolean',
  type: 'true',
});

export const False = (): IAuthorizationPolicyConditionValueFalse => ({
  kind: 'boolean',
  type: 'false',
});

export const ResourceAttribute = (resource_alias: string, attribute: string): IAuthorizationPolicyConditionValueResourceAttribute => ({
  kind: 'value',
  type: 'resource_attribute',
  resource_alias,
  attribute,
});

export const Not = (
  condition: IAuthorizationPolicyCondition,
): IAuthorizationPolicyConditionValueNot | IAuthorizationPolicyConditionValueTrue | IAuthorizationPolicyConditionValueFalse => {
  if (condition.type === 'true') {
    return False();
  }

  if (condition.type === 'false') {
    return True();
  }

  return {
    kind: 'op',
    type: 'not',
    value: condition,
  };
};

export const Eq = (
  left: IAuthorizationPolicyConditionValue,
  right: IAuthorizationPolicyConditionValue,
): IAuthorizationPolicyConditionValueEq => ({
  kind: 'cmp',
  type: 'eq',

  left,
  right,
});

export const NEq = (
  left: IAuthorizationPolicyConditionValue,
  right: IAuthorizationPolicyConditionValue,
): IAuthorizationPolicyConditionValueNEq => ({
  kind: 'cmp',
  type: 'n_eq',

  left,
  right,
});

export const And = (
  left: IAuthorizationPolicyConditionValue,
  right: IAuthorizationPolicyConditionValue,
): IAuthorizationPolicyConditionValueAnd => ({
  kind: 'cmp',
  type: 'and',

  left,
  right,
});

export const Or = (
  left: IAuthorizationPolicyConditionValue,
  right: IAuthorizationPolicyConditionValue,
): IAuthorizationPolicyConditionValueOr => ({
  kind: 'cmp',
  type: 'or',

  left,
  right,
});

export const Gt = (
  left: IAuthorizationPolicyConditionValue,
  right: IAuthorizationPolicyConditionValue,
): IAuthorizationPolicyConditionValueGreaterThan => ({
  kind: 'cmp',
  type: 'gt',

  left,
  right,
});

export const Gte = (
  left: IAuthorizationPolicyConditionValue,
  right: IAuthorizationPolicyConditionValue,
): IAuthorizationPolicyConditionValueGreaterThanOrEqual => ({
  kind: 'cmp',
  type: 'gte',

  left,
  right,
});

export const Lt = (
  left: IAuthorizationPolicyConditionValue,
  right: IAuthorizationPolicyConditionValue,
): IAuthorizationPolicyConditionValueLessThan => ({
  kind: 'cmp',
  type: 'lt',

  left,
  right,
});

export const Lte = (
  left: IAuthorizationPolicyConditionValue,
  right: IAuthorizationPolicyConditionValue,
): IAuthorizationPolicyConditionValueLessThanOrEqual => ({
  kind: 'cmp',
  type: 'lte',

  left,
  right,
});

export const CombineOr = (left: IAuthorizationPolicyCondition | null, right: IAuthorizationPolicyCondition | null) => {
  if (left === null && right === null) {
    return False();
  }

  if (right === null) {
    return left;
  }

  if (left === null) {
    return right;
  }

  if (left.type === 'true' || right.type === 'true') {
    return True();
  }

  if (left.type === 'false' && right.type === 'false') {
    return False();
  }

  return Or(left, right);
};

export const CombineAnd = (left: IAuthorizationPolicyCondition | null, right: IAuthorizationPolicyCondition | null) => {
  if (left === null && right === null) {
    return False();
  }

  if (right === null) {
    return left;
  }

  if (left === null) {
    return right;
  }

  if (left.type === 'false' || right.type === 'false') {
    return False();
  }

  if (left.type === 'true' && right.type === 'true') {
    return True();
  }

  return And(left, right);
};

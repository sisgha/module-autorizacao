export type IAuthorizationPolicyConditionValueLiteral = {
  kind: 'value';

  type: 'literal';
  value: any;
};

export type IAuthorizationPolicyConditionValueTrue = {
  kind: 'boolean';

  type: 'true';
};

export type IAuthorizationPolicyConditionValueFalse = {
  kind: 'boolean';

  type: 'false';
};

export type IAuthorizationPolicyConditionValueResourceAttribute = {
  kind: 'value';

  type: 'resource_attribute';

  resource_alias: string;
  attribute: string;
};

export type IAuthorizationPolicyConditionValueNot = {
  kind: 'op';

  type: 'not';
  value: IAuthorizationPolicyConditionValue;
};

export type IAuthorizationPolicyConditionValueEq = {
  kind: 'cmp';

  type: 'eq';

  left: IAuthorizationPolicyConditionValue;
  right: IAuthorizationPolicyConditionValue;
};

export type IAuthorizationPolicyConditionValueNEq = {
  kind: 'cmp';

  type: 'n_eq';

  left: IAuthorizationPolicyConditionValue;
  right: IAuthorizationPolicyConditionValue;
};

export type IAuthorizationPolicyConditionValueAnd = {
  kind: 'cmp';

  type: 'and';

  left: IAuthorizationPolicyConditionValue;
  right: IAuthorizationPolicyConditionValue;
};

export type IAuthorizationPolicyConditionValueOr = {
  kind: 'cmp';

  type: 'or';

  left: IAuthorizationPolicyConditionValue;
  right: IAuthorizationPolicyConditionValue;
};

export type IAuthorizationPolicyConditionValueGreaterThan = {
  kind: 'cmp';

  type: 'gt';

  left: IAuthorizationPolicyConditionValue;
  right: IAuthorizationPolicyConditionValue;
};

export type IAuthorizationPolicyConditionValueGreaterThanOrEqual = {
  kind: 'cmp';

  type: 'gte';

  left: IAuthorizationPolicyConditionValue;
  right: IAuthorizationPolicyConditionValue;
};

export type IAuthorizationPolicyConditionValueLessThan = {
  kind: 'cmp';

  type: 'lt';

  left: IAuthorizationPolicyConditionValue;
  right: IAuthorizationPolicyConditionValue;
};

export type IAuthorizationPolicyConditionValueLessThanOrEqual = {
  kind: 'cmp';

  type: 'lte';

  left: IAuthorizationPolicyConditionValue;
  right: IAuthorizationPolicyConditionValue;
};

export type IAuthorizationPolicyConditionValue =
  | IAuthorizationPolicyConditionValueTrue
  | IAuthorizationPolicyConditionValueFalse
  | IAuthorizationPolicyConditionValueLiteral
  | IAuthorizationPolicyConditionValueResourceAttribute
  | IAuthorizationPolicyConditionValueEq
  | IAuthorizationPolicyConditionValueNEq
  | IAuthorizationPolicyConditionValueAnd
  | IAuthorizationPolicyConditionValueOr
  | IAuthorizationPolicyConditionValueNot
  | IAuthorizationPolicyConditionValueGreaterThan
  | IAuthorizationPolicyConditionValueGreaterThanOrEqual
  | IAuthorizationPolicyConditionValueLessThan
  | IAuthorizationPolicyConditionValueLessThanOrEqual;

export type IAuthorizationPolicyCondition = IAuthorizationPolicyConditionValue;

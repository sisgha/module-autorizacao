import { IAuthorizationPolicyCondition } from '../../../domain';

export const getNewAlias = (aliasesMapping: Map<string, string>, oldAlias: string) => aliasesMapping.get(oldAlias) ?? oldAlias;

export const getAllSubNodesFromCondition = function* (rootNode: IAuthorizationPolicyCondition) {
  const nodesAlreadyHandled = new Set<IAuthorizationPolicyCondition>();

  const nodesToBeHandled = new Set<IAuthorizationPolicyCondition>();

  nodesToBeHandled.add(rootNode);

  const getNodesToBeHandled = function* () {
    while (nodesToBeHandled.size > 0) {
      const it = nodesToBeHandled.values();
      const node = <IAuthorizationPolicyCondition>it.next().value;

      if (!nodesAlreadyHandled.has(node)) {
        yield node;

        nodesAlreadyHandled.add(node);
      } else {
        throw new Error('Circular condition node is not allowed.');
      }

      nodesToBeHandled.delete(node);
    }
  };

  for (const node of getNodesToBeHandled()) {
    switch (node.type) {
      case 'not': {
        nodesToBeHandled.add(node.value);
        break;
      }

      case 'eq':
      case 'n_eq':
      case 'and':
      case 'or': //
      case 'gt': //
      case 'gte': //
      case 'lt': //
      case 'lte': {
        //
        nodesToBeHandled.add(node.left);
        nodesToBeHandled.add(node.right);

        break;
      }
    }
  }

  yield* nodesAlreadyHandled;
};

export const changeConditionAliasesUsages = (rootNode: IAuthorizationPolicyCondition, aliasesMapping: Map<string, string>) => {
  for (const node of getAllSubNodesFromCondition(rootNode)) {
    switch (node.type) {
      case 'resource_attribute': {
        node.resource_alias = getNewAlias(aliasesMapping, node.resource_alias);
        break;
      }

      default: {
        break;
      }
    }
  }
};
export const checkIfConditionNeedsDatabaseResolution = (node: IAuthorizationPolicyCondition) => {
  for (const subNode of getAllSubNodesFromCondition(node)) {
    switch (subNode.type) {
      case 'resource_attribute': {
        return true;
      }

      default: {
        break;
      }
    }
  }

  return false;
};

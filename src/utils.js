function getDecoratorName(decorator) {
  return decorator?.expression?.callee?.name || decorator?.expression?.name;
}

module.exports = {
  getDecoratorName,
  /** @param {import('estree').PropertyDefinition} node */
  /** @param {string} name */
  isAngularSignal(node, name) {
    if (node.value?.type !== "CallExpression") {
      return false;
    }

    if (node.value.callee?.name !== name) {
      return false;
    }

    return true;
  },
  /** @param {import('estree').PropertyDefinition} node */
  /** @param {string} name */
  hasDecorator(node, name) {
    return node.decorators?.some((decorator) => {
      return getDecoratorName(decorator) === name;
    });
  }
}

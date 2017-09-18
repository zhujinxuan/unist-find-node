function compare(beforePos, afterPos) {
  if (afterPos.line > beforePos.line) {
    return true;
  } else if (afterPos.line === beforePos.line) {
    return afterPos.column >= beforePos.column;
  }
  return false;
}

function findNode(position, node, defaultNode, returnable) {
  let rootReturn = returnable(node, defaultNode);
  if (rootReturn === true) {
    return node;
  } else if (rootReturn === false) {
    return defaultNode;
  } else if (node.children) {
    for (const child of node.children) {
      if (
        compare(child.position.start, position) &&
        compare(position, child.position.end)
      ) {
        return findNode(position, child, node, returnable);
      }
    }
  }
  return node;
}

function compose(returnable) {
  for (const f of returnable) {
    if (typeof f !== "function") {
      throw new Error(
        "returnable must be an Array of Functions, while it is passed an " +
          typeof f
      );
    }
  }

  return (node, defaultNode) => {
    for (const f of returnable) {
      let result = f(node, defaultNode);
      if (result !== undefined) {
        return result;
      }
    }
    return undefined;
  };
}

// null: continue search, discontinue the following search rules;
// null: if where no child exists, or all children out of position, return node
// false: return defaultNode;
// true: return node;
// undefined: continues search
const defaultReturnable = [
  (node, defaultNode) =>
    node.type === "paragraph" ? defaultNode.type === "root" : undefined,
  (node, defaultNode) => (node.type === "text" ? false : undefined),
  node => (node.type === "tableCell" ? true : undefined),
  node => (node.type === "heading" ? true : undefined),
  node => (node.type === "list" ? null : undefined),
  node => (node.type === "table" ? null : undefined),
  (node, defaultNode) =>
    defaultNode && defaultNode.type === "listItem" ? false : undefined
];

module.exports = function(node, position, returnable = []) {
  if (
    compare(node.position.start, position) &&
    compare(position, node.position.end)
  ) {
    return findNode(
      position,
      node,
      null,
      compose([...returnable, ...defaultReturnable])
    );
  }
  return null;
};

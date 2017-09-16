function compare(beforePos, afterPos) {
  if (afterPos.line > beforePos.line) {
    return true;
  } else if (afterPos.line === beforePos.line) {
    return afterPos.column >= beforePos.column;
  }
  return false;
}

const continueNodeTypes = ["root", "list", "table", "tableRow"];

function findNode(node, position, defaultNode, shortCut) {
  if (shortCut(node)) {
    return node;
  }
  // Only search node with children
  if (node.children) {
    for (const child of node.children) {
      if (
        compare(child.position.start, position) &&
        compare(position, child.position.end)
      ) {
        if (node.type === "paragraph" && defaultNode.type === "root") {
          return node;
        } else if (node.type === "paragraph") {
          return defaultNode;
        } else if (continueNodeTypes.indexOf(node.type) > -1) {
          return findNode(child, position, node, shortCut);
        }
        return node;
      }
    }
  }

  if (
    compare(node.position.start, position) &&
    compare(position, node.position.end)
  ) {
    return node;
  }
  return defaultNode;
}

module.exports = function(node, position, shortCut = () => false) {
  if (
    compare(node.position.start, position) &&
    compare(position, node.position.end)
  ) {
    return findNode(node, position, null, shortCut);
  }
  return null;
};

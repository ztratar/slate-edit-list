// @flow
import { Document, Node } from 'slate';

/**
 * Find all `list_item` descendants of a node and retrieve the deepest depth.
 */
function getDeepestItemDepth(node: Node, document: Document) {
    return node
        .filterDescendants(descendant => descendant.type === 'list_item')
        .reduce(
            (maxLevel, descendant) =>
                Math.max(maxLevel, document.getDepth(descendant.key)),
            0
        );
}

export default getDeepestItemDepth;

// @flow

import { Document, Node } from 'slate';
import Options from '../options';
import { unwrapList, wrapInList } from '.';
import { isList, isItem, isSelectionInList } from '../utils';

type MappedNode = {
    depth: number,
    node: Node
};

function filterListDescendants(options: Options, node: Node) {
    return isList(options, node) || isItem(options, node);
}

function mapListDescendants(document: Document) {
    return (node: Node) => ({
        depth: document.getDepth(node.key),
        node
    });
}

function sortListDescendants(a: MappedNode, b: MappedNode): number {
    if (a.depth !== b.depth) {
        return b.depth - a.depth;
    }

    if (a.node.type === b.node.type) {
        return 0;
    }

    if (a.node.type === 'list_item') {
        return -1;
    }

    return 1;
}

function unwrapMappedNodes(change: Change, mappedNode: MappedNode) {
    return change.withoutNormalizing(() => {
        change.unwrapBlockByKey(mappedNode.node.key);
    });
}

function findAncestorList(
    options: Options,
    document: Document,
    startBlock: Node,
    endBlock: Node
): ?Block {
    const list = document.getCommonAncestor(startBlock.key, endBlock.key);

    if (isList(options, list)) {
        return list;
    }

    return document.getClosest(list.key, (node: Node) => isList(options, node));
}

function isSameLevel(sortedMappedNodes: Array<MappedNode>): boolean {
    if (!sortedMappedNodes.size) {
        return true;
    }

    const max = sortedMappedNodes.first().depth;
    const min = sortedMappedNodes.last().depth;

    return max === min;
}

/**
 * Toggle list on the selected range.
 */
function toggleList(options: Options, change: Change) {
    // Selection is not a list — we want to create one.
    if (!isSelectionInList(options, change.value)) {
        return wrapInList(options, change);
    }

    const { document, selection } = change.value;

    const startBlock = document.getClosestBlock(selection.start.key);
    const endBlock = document.getClosestBlock(selection.end.key);

    // The selection is in a single block.
    // Let's unwrap just the block, not the whole list.
    if (startBlock === endBlock) {
        return unwrapList(options, change);
    }

    // We need to find the closest list for the selection in its ancestors.
    const list = findAncestorList(options, document, startBlock, endBlock);

    // Filter all `ul`, `ol` and `li` blocks and sort them by their depth in hierarchy.
    const listsAndItems = list
        .filterDescendants(node => filterListDescendants(options, node))
        .map(mapListDescendants(document))
        .sort(sortListDescendants);

    // We don't want to destroy the whole list case the selection is not nested.
    if (isSameLevel(listsAndItems)) {
        return unwrapList(options, change);
    }

    const newChange = listsAndItems.reduce(unwrapMappedNodes, change);
    return newChange.unwrapBlockByKey(list.key);
}

export default toggleList;

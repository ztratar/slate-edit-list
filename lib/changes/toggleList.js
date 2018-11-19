// @flow

import { Document, Node } from 'slate';
import Options from '../options';
import { unwrapList, wrapInList } from '.';
import { isList, isItem, isSelectionInList } from '../utils';

type MappedNode = {
    depth: number,
    node: Node
};

function isListOrItem(options: Options, node: Node) {
    return isList(options, node) || isItem(options, node);
}

function mapListDescendants(document: Document) {
    return (node: Node) => ({
        depth: document.getDepth(node.key),
        node
    });
}

function sortListDescendants(
    options: Options,
    a: MappedNode,
    b: MappedNode
): number {
    if (a.depth !== b.depth) {
        return b.depth - a.depth;
    }

    if (a.node.type === b.node.type) {
        return 0;
    }

    if (a.node.type === options.typeItem) {
        return -1;
    }

    return 1;
}

function unwrapMappedNodes(change: Change, mappedNode: MappedNode) {
    return change.withoutNormalizing(() => {
        change.unwrapBlockByKey(mappedNode.node.key, mappedNode.node.type);
    });
}

function findAncestorList(
    change: Change,
    options: Options,
    commonAncestor: Block
): ?Block {
    const { document, selection } = change.value;
    // This flag should be true, when elements are in selection
    let flag = false;

    return commonAncestor
        .filterDescendants(node => isListOrItem(options, node))
        .filter(node => {
            const hasStart = node.hasNode(selection.start.key);
            const hasEnd = node.hasNode(selection.end.key);
            const isListItem = isItem(options, node);

            if (hasStart && isListItem) flag = true;
            if (hasEnd && isListItem) flag = false;

            return flag || hasStart || hasEnd;
        })
        .map(mapListDescendants(document))
        .sort((...params) => sortListDescendants(options, ...params));
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
    const { document, selection } = change.value;
    const startBlock = document.getClosestBlock(selection.start.key);
    const endBlock = document.getClosestBlock(selection.end.key);

    // -------- SINGLE BLOCK ---------------------------------------------------
    // The selection is in a single block.
    // Let's unwrap just the block, not the whole list.
    if (startBlock === endBlock) {
        return isSelectionInList(options, change.value)
            ? unwrapList(options, change)
            : wrapInList(options, change);
    }

    // -------- NOT A SINGLE BLOCK -------------------------------------------
    const commonAncestor = document.getCommonAncestor(
        startBlock.key,
        endBlock.key
    );

    const sortedMappedNodes = findAncestorList(change, options, commonAncestor);

    // There are no lists or items in selection => wrap them
    if (!sortedMappedNodes.size) {
        return wrapInList(options, change);
    }

    // All items are the same level => unwrap them
    if (isSameLevel(sortedMappedNodes)) {
        return unwrapList(options, change);
    }

    // Common Ancestor is not a list or item
    if (!isListOrItem(options, commonAncestor)) {
        const newChange = sortedMappedNodes
            // @TODO last item is filtered, so it wouldn't break down flat whole list -> unwrapNodeByKey should be solution (problem with key)
            .filter(item => sortedMappedNodes.last().depth !== item.depth)
            .reduce(unwrapMappedNodes, change);
        return newChange;
    }

    // Unwrap all nested nodes
    const newChange = sortedMappedNodes.reduce(unwrapMappedNodes, change);

    // Unwrap common ancestor
    return unwrapList(options, newChange);
}

export default toggleList;

// @flow

import { Document, Node } from 'slate';
import Options from '../options';
import { wrapInList } from '.';
import isList from '../utils/isList';
import isItem from '../utils/isItem';

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
    return change.unwrapBlockByKey(mappedNode.node.key, undefined, {
        normalize: false
    });
}

/**
 * Toggle list on the selected range.
 */
function toggleList(options: Options, change: Change) {
    const { document, selection } = change.value;

    const startBlock = document.getClosestBlock(selection.start.key);
    const endBlock = document.getClosestBlock(selection.end.key);
    const commonAncestor = document.getCommonAncestor(
        startBlock.key,
        endBlock.key
    );

    if (!isList(options, commonAncestor)) {
        return wrapInList(options, change);
    }

    const listsAndItems = commonAncestor
        .filterDescendants(node => filterListDescendants(options, node))
        .map(mapListDescendants(document))
        .sort(sortListDescendants);

    const newChange = listsAndItems.reduce(unwrapMappedNodes, change);
    return newChange.unwrapBlockByKey(commonAncestor.key);
}

export default toggleList;

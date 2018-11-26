// @flow
import { Block, type Change } from 'slate';

import type Options from '../options';
import {
    getDeepestItemDepth,
    getPreviousItem,
    getCurrentItem,
    getListForItem,
    isList
} from '../utils';

/**
 * Increase the depth of the current item by putting it in a sub-list
 * of previous item.
 * For first items in a list, does nothing.
 */
function increaseItemDepth(opts: Options, change: Change): Change {
    const previousItem = getPreviousItem(opts, change.value);
    const currentItem = getCurrentItem(opts, change.value);
    const maxDepth = opts.maxDepth * 2;

    if (!previousItem) {
        return change;
    }

    if (!currentItem) {
        return change;
    }

    // Get the depth of the focused list item.
    const currentItemDepth = change.value.document.getDepth(currentItem.key);

    // Make sure the level of the focused item is below the defined maximum.
    if (currentItemDepth >= maxDepth) {
        return change;
    }

    // Get the depth of the deepest `li` descendant of the focused item.
    const deepestItemDepth = getDeepestItemDepth(
        currentItem,
        change.value.document
    );

    // This prevents from indenting parents of too deeply nested list items.
    if (deepestItemDepth >= maxDepth) {
        return change;
    }

    // Move the item in the sublist of previous item
    return moveAsSubItem(opts, change, currentItem, previousItem.key);
}

/**
 * Move the given item to the sublist at the end of destination item,
 * creating a sublist if needed.
 */
function moveAsSubItem(
    opts: Options,
    change: Change,
    // The list item to add
    item: Block,
    // The key of the destination node
    destKey: string
): Change {
    const destination = change.value.document.getDescendant(destKey);
    const lastIndex = destination.nodes.size;
    const lastChild = destination.nodes.last();

    // The potential existing last child list
    const existingList = isList(opts, lastChild) ? lastChild : null;

    if (existingList) {
        return change.moveNodeByKey(
            item.key,
            existingList.key,
            existingList.nodes.size // as last item
        );
    }
    const currentList = getListForItem(opts, change.value, destination);
    if (!currentList) {
        throw new Error('Destination is not in a list');
    }

    // Creating empty list creates also empty list item - placeholder item is meant to be easily deleted in the end
    const tmpBlock = Block.create({
        object: 'block',
        type: opts.typeItem
    });

    // @TODO Why does empty list contain empty item?
    const newSublist = Block.create({
        object: 'block',
        type: currentList.type,
        data: currentList.data,
        nodes: [tmpBlock]
    });

    change.withoutNormalizing(() => {
        change.insertNodeByKey(destKey, lastIndex, newSublist);
    });

    change.moveNodeByKey(item.key, newSublist.key, 0);
    change.removeNodeByKey(tmpBlock.key);

    return change;
}

export default increaseItemDepth;

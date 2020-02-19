// @flow
import { Editor, Node } from 'slate';

import type Options from '../options';
import getCurrentItem from './getCurrentItem';
import getListForItem from './getListForItem';

/**
 * Return the parent list block, from current selection or from a node (paragraph in a list item).
 */
// TODO: refactor all usages of the function
function getCurrentList(opts: Options, editor: Editor, node?: Node): ?Node {
    const item = getCurrentItem(opts, editor, node);

    if (!item) {
        return null;
    }

    return getListForItem(opts, editor, item);
}

export default getCurrentList;

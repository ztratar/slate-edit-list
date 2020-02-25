// @flow
import { Editor, NodeEntry, Path } from 'slate';

import { type OptionsFormat } from '../options';
import getCurrentItem from './getCurrentItem';
import getListForItem from './getListForItem';

/**
 * Return the parent list block, from current selection or from a node (paragraph in a list item).
 */
// TODO: refactor all usages of the function
function getCurrentList(
    options: OptionsFormat,
    editor: Editor,
    path?: Path
): ?NodeEntry<Element> {
    const itemEntry = getCurrentItem(options, editor, path);

    if (!itemEntry) {
        return null;
    }

    const [, itemPath] = getCurrentItem(options, editor, path);

    return getListForItem(options, editor, itemPath);
}

export default getCurrentList;

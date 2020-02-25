// @flow
import { Editor, Element, Node, NodeEntry, Path } from 'slate';

import { type Options } from '..';
import { isItem } from '.';

/**
 * Return the current list item, from current selection or from a node.
 */
// TODO: refactor all usages of the function
export const getCurrentItem = (options: Options) => (
    editor: Editor,
    path?: Path
): ?NodeEntry<Element> => {
    if (!path) {
        if (!editor.selection) return null;
        [, path] = Editor.first(editor, editor.selection);
    }

    return (
        Editor.above(editor, {
            at: path,
            match: (node: Node) => isItem(options)(node),
            mode: 'lowest',
        }) || null
    );
};

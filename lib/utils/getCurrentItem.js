// @flow
import { Editor, Element, Node, Path } from 'slate';

import { type OptionsFormat } from '../options';

/**
 * Return the current list item, from current selection or from a node.
 */
// TODO: refactor all usages of the function
function getCurrentItem(
    options: OptionsFormat,
    editor: Editor,
    path?: Path
): ?Element {
    if (!path) {
        if (!editor.selection) return null;
        [, path] = Editor.first(editor, editor.selection);
    }

    const [parent] = Editor.above(editor, {
        at: path,
        match: (node: Node) => node.type === options.typeItem,
        mode: 'lowest',
    });

    return parent || null;
}

export default getCurrentItem;

// @flow
import { Editor, Element } from 'slate';

import type Options from '../options';

/**
 * Return the current list item, from current selection or from a node.
 */
// TODO: refactor all usages of the function
function getCurrentItem(
    opts: Options,
    editor: Editor,
    selectedElement?: Element
): ?Element {
    let path;

    if (!selectedElement) {
        if (!editor.selection) return null;
        [, path] = Editor.first(editor, editor.selection);
    }

    const [parent] = Editor.above(editor, {
        at: path,
        match: (node: Node) => node.type === opts.typeItem,
        mode: 'lowest',
    });

    return parent || null;
}

export default getCurrentItem;

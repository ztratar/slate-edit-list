// @flow
import { Editor, Node, NodeEntry, Path, Transforms } from 'slate';

import { type OptionsFormat } from '../options';
import { getCurrentList, getItemsAtRange } from '../utils';

/**
 * Unwrap items at range from their list.
 */
function unwrapList(
    options: OptionsFormat,
    editor: Editor,
    path?: Path
): Editor {
    let items: Array<NodeEntry> = [];

    if (path) {
        const currentList = getCurrentList(options, editor, path);

        if (currentList) {
            items = Array.from(Node.children(editor, path));
        }
    } else {
        items = getItemsAtRange(options, editor);
    }

    if (items.length === 0) {
        return editor;
    }

    Editor.withoutNormalizing(editor, () => {
        const itemPaths = items.map(([, itemPath]) =>
            Editor.pathRef(editor, itemPath)
        );

        itemPaths.forEach(itemPath => {
            Transforms.liftNodes(editor, {
                at: itemPath.current,
            });
            Transforms.unwrapNodes(editor, {
                at: itemPath.current,
            });
        });
    });

    return editor;
}

export default unwrapList;

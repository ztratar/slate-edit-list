// @flow
import { Editor, NodeEntry, Transforms } from 'slate';

import { type OptionsFormat } from '../options';
import { getItemsAtRange } from '../utils';

/**
 * Unwrap items at range from their list.
 */
function unwrapList(options: OptionsFormat, editor: Editor): Editor {
    const items: Array<NodeEntry> = getItemsAtRange(options, editor);

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

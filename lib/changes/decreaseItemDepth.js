// @flow
import { Editor, Node, Path, Transforms } from 'slate';

import { type OptionsFormat } from '../options';
import { getCurrentItem, getItemDepth, isItem, isList } from '../utils';

/**
 * Decreases the depth of the current item. The following items will
 * be moved as sublist of the decreased item.
 *
 * No-op for root items.
 */
function decreaseItemDepth(options: OptionsFormat, editor: Editor): void {
    if (getItemDepth(options, editor) === 1) {
        return;
    }

    const currentItem = getCurrentItem(options, editor);
    if (!currentItem) {
        return;
    }

    const parentPathRef = Editor.pathRef(editor, Path.parent(currentItem[1]));

    Transforms.moveNodes(editor, {
        match: n => n === currentItem[0],
        to: currentItem[1].splice(0, currentItem[1].length - 2),
    });

    const parentPath = parentPathRef.unref();

    if (
        Array.from(Node.children(editor, parentPath)).filter(([node]) =>
            isItem(options, node)
        ).length === 0
    ) {
        Transforms.removeNodes(editor, {
            at: parentPath,
            match: n => isList(options, n),
        });
    }

    const potentialDanglingLiPath = Path.parent(parentPath);

    if (
        Array.from(Node.children(editor, potentialDanglingLiPath)).filter(
            ([node]) =>
                Editor.isBlock(editor, node) || Editor.isInline(editor, node)
        ).length === 0
    ) {
        Transforms.removeNodes(editor, {
            at: potentialDanglingLiPath,
            match: n => isItem(options, n),
        });
    }
}

export default decreaseItemDepth;

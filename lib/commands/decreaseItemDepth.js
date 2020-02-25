// @flow
import { Editor, Node, Path, Transforms } from 'slate';
import { type Options } from '..';
import { getCurrentItem, getItemDepth, isItem, isList } from '../utils';

/**
 * Decreases the depth of the current item. The following items will
 * be moved as sublist of the decreased item.
 *
 * No-op for root items.
 */
export const decreaseItemDepth = (options: Options) => (
    editor: Editor
): void => {
    if (getItemDepth(options)(editor) === 1) {
        return;
    }

    const currentItem = getCurrentItem(options)(editor);
    if (!currentItem) {
        return;
    }

    const parentPathRef = Editor.pathRef(editor, Path.parent(currentItem[1]));

    Editor.withoutNormalizing(editor, () => {
        Transforms.moveNodes(editor, {
            match: n => n === currentItem[0],
            to: Path.parent(parentPathRef.current),
        });

        const parentPath = parentPathRef.unref();

        if (
            Array.from(Node.children(editor, parentPath)).filter(([node]) =>
                isItem(options)(node)
            ).length === 0
        ) {
            Transforms.removeNodes(editor, {
                at: parentPath,
                match: n => isList(options)(n),
            });
        }

        const potentialDanglingLiPath = Path.parent(parentPath);

        if (
            Array.from(Node.children(editor, potentialDanglingLiPath)).filter(
                ([node]) =>
                    Editor.isBlock(editor, node) ||
                    Editor.isInline(editor, node)
            ).length === 0
        ) {
            Transforms.removeNodes(editor, {
                at: potentialDanglingLiPath,
                match: n => isItem(options)(n),
            });
        }
    });
};

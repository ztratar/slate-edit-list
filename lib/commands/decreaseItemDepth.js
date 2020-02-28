// @flow
import { Editor, Path, Transforms } from 'slate';
import { type Options } from '..';
import { getCurrentItem, getItemDepth } from '../utils';

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

    const currentItemTuple = getCurrentItem(options)(editor);

    if (!currentItemTuple) {
        return;
    }

    const [currentItem, currentItemPath] = currentItemTuple;
    const [currentList, currentListPath] = Editor.parent(
        editor,
        currentItemPath
    );
    const parentItemPath = Path.parent(currentListPath);
    const parentListPath = Path.parent(parentItemPath);
    const followingItems = currentList.children.slice(
        Path.relative(currentItemPath, currentListPath)[0] + 1
    );

    const currentListPathRef = Editor.pathRef(editor, currentListPath);

    Editor.withoutNormalizing(editor, () => {
        if (followingItems.length > 0) {
            const newList = {
                type: currentList.type,
                ...(currentList.data && { data: currentList.data }),
                children: followingItems,
            };

            Transforms.removeNodes(editor, {
                at: currentListPath,
                match: n => followingItems.includes(n),
            });

            Transforms.insertNodes(editor, newList, {
                at: currentItemPath.concat([currentItem.children.length]),
            });

            Transforms.moveNodes(editor, {
                at: currentItemPath,
                to: parentListPath.concat([
                    Path.relative(parentItemPath, parentListPath)[0] + 1,
                ]),
            });
        } else {
            Transforms.moveNodes(editor, {
                at: currentItemPath,
                to: parentListPath.concat([
                    Path.relative(parentItemPath, parentListPath)[0] + 1,
                ]),
            });
        }

        const currentListChildren = Editor.node(
            editor,
            currentListPathRef.current
        )[0].children;

        if (currentListChildren.length === 0) {
            Transforms.removeNodes(editor, {
                at: currentListPathRef.current,
            });
        }

        const parentItemHasBlocks = Editor.node(
            editor,
            parentItemPath
        )[0].children.some(node => Editor.isBlock(editor, node));

        if (!parentItemHasBlocks) {
            Transforms.removeNodes(editor, {
                at: parentItemPath,
            });
        }
    });
};

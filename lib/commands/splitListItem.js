// @flow
import { type Editor, Transforms, Path } from 'slate';
import { type Options } from '..';
import { getCurrentItem } from '../utils';

/**
 * Split a list item at the start of the current range.
 */
export const splitListItem = (options: Options) => (
    editor: Editor,
    path?: Path
): void => {
    const [curItemElement, curItemPath] = getCurrentItem(options)(editor, path);

    const currentItemText = curItemElement.children[0].children[0].text;
    const cursorPosition = editor.selection.focus.offset;
    const textForNewItem = currentItemText.slice(cursorPosition);

    const nextPath = curItemPath.map((v, i) => {
        // If the last index, increment
        if (i === curItemPath.length - 1) {
            return v + 1;
        }

        return v;
    });

    if (textForNewItem.length) {
        // Only delete the last part of the current selected node
        // if there is content to delete, else this will remove
        // many nodes for some reason.
        Transforms.delete(editor, { distance: textForNewItem.length });
    }

    Transforms.insertNodes(
        editor,
        {
            type: 'list_item',
            children: [
                {
                    type: 'paragraph',
                    children: [{ text: textForNewItem }],
                },
            ],
        },
        {
            at: nextPath,
        }
    );

    Transforms.select(editor, nextPath);
    Transforms.collapse(editor, { edge: 'start' });
};

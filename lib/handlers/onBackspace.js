// @flow
import { type Editor, Range } from 'slate';

import { type Options } from '..';
import { unwrapList } from '../commands';
import { getCurrentItem } from '../utils';

/**
 * User pressed Delete in an editor
 */
function onBackspace(options: Options, event: *, editor: Editor): void {
    const { selection } = editor;

    const isCollapsed = Range.isCollapsed(selection);
    const startOffset = Range.start(selection).offset;
    const hasOffset = startOffset > 0;
    const currentItem = getCurrentItem(options)(editor);

    if (
        isCollapsed &&
        !hasOffset &&
        currentItem &&
        currentItem[1] === selection.anchor.path
    ) {
        event.preventDefault();
        unwrapList(options)(editor);
    }
}

export default onBackspace;

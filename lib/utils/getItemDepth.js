// @flow
import { Editor, type Path } from 'slate';

import { type OptionsFormat } from '../options';
import getCurrentItem from './getCurrentItem';

/**
 * Get depth of current block in a document list
 */
function getItemDepth(
    options: OptionsFormat,
    editor: Editor,
    path?: Path
): number {
    const item = getCurrentItem(options, editor, path);

    if (item) {
        path = item[1];
    } else {
        return 0;
    }

    const [, parentPath] = Editor.parent(editor, path);

    return 1 + getItemDepth(options, editor, parentPath);
}

export default getItemDepth;

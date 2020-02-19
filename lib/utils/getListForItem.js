// @flow
import { Editor, type Path } from 'slate';
import { type OptionsFormat } from '../options';
import isList from './isList';

/**
 * Return the parent list block for an item block.
 */
function getListForItem(
    options: OptionsFormat,
    editor: Editor,
    path: Path
): ?Node {
    const ancestors = Editor.above(editor, {
        at: path,
        match: node => isList(options, node),
    });

    return ancestors ? ancestors[0] : null;
}

export default getListForItem;

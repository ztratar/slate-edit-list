// @flow
import { Editor, type Element, type NodeEntry, type Path } from 'slate';
import { type OptionsFormat } from '../options';
import isList from './isList';

/**
 * Return the parent list block for an item block.
 */
function getListForItem(
    options: OptionsFormat,
    editor: Editor,
    path: Path
): ?NodeEntry<Element> {
    const ancestor = Editor.above(editor, {
        at: path,
        match: node => isList(options, node),
    });

    return ancestor || null;
}

export default getListForItem;

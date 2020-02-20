// @flow
import { Editor, type Path } from 'slate';
import type { OptionsFormat } from '../options';

/**
 * Find all `list_item` descendants of a node and retrieve the deepest depth.
 */

function getDeepestItemDepth(
    options: OptionsFormat,
    editor: Editor,
    path: Path
) {
    return Array.from(
        Editor.nodes(editor, {
            at: path,
            match: descendant => descendant.type === options.typeItem,
        })
    ).reduce(
        (maxLevel, [, itemPath]) =>
            Math.max(maxLevel, itemPath.length - path.length),
        0
    );
}

export default getDeepestItemDepth;

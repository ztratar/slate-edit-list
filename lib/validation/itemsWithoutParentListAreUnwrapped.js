// @flow
import { Editor, NodeEntry, Node, Transforms, Path } from 'slate';

import { isItem, isList } from '../utils';
import type { Options } from '..';

/**
 * A rule that unwraps list items if they are not in list
 */
export function itemsWithoutParentListAreUnwrapped(
    options: Options,
    nodeEntry: NodeEntry,
    editor: Editor
): void {
    const [node, nodePath] = nodeEntry;
    let parentNodePath;

    if (!isItem(options, node)) {
        return;
    }

    try {
        parentNodePath = Path.parent(nodePath);
    } catch (e) {
        // has no parent (ie. [0] node)
        return;
    }

    const parentNode = parentNodePath && Node.get(editor, parentNodePath);

    // either no parent or not a list parent
    // in both cases, we unwrap list item
    if (!parentNode || !isList(options)(parentNode)) {
        Transforms.unwrapNodes(editor, {
            at: nodePath,
        });
    }
}

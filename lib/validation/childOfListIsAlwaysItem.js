// @flow
import { Editor, NodeEntry, Node, Transforms, Path } from 'slate';

import { isItem, isList } from '../utils';
import type { OptionsFormat } from '../options';

/**
 * A rule that wraps children of lists with list item
 */
export function childOfListIsAlwaysItem(
    options: OptionsFormat,
    nodeEntry: NodeEntry,
    editor: Editor
): void {
    const [node, nodePath] = nodeEntry;
    let parentNodePath;

    if (isItem(options, node)) {
        // we don't care for those that are items already
        return;
    }

    try {
        parentNodePath = Path.parent(nodePath);
    } catch (e) {
        // has no parent (ie. [0] node)
        return;
    }

    const parentNode = Node.get(editor, parentNodePath);

    if (isList(options, parentNode)) {
        const wrapperItem = {
            type: options.typeItem,
            children: [],
        };

        Transforms.wrapNodes(editor, wrapperItem, {
            at: nodePath,
        });
    }
}

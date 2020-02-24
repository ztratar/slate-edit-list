// @flow
import { Editor, NodeEntry, Node, Transforms, Path, Element } from 'slate';

import { isItem } from '../utils';
import type { OptionsFormat } from '../options';

/**
 * A rule that wraps children of lists with list item
 */
export function itemChildrenAreAlwaysElements(
    options: OptionsFormat,
    nodeEntry: NodeEntry,
    editor: Editor
): void {
    const [node, nodePath] = nodeEntry;
    let parentNodePath;

    try {
        parentNodePath = Path.parent(nodePath);
    } catch (e) {
        // has no parent (ie. editor)
        return;
    }

    const parentNode = Node.get(editor, parentNodePath);

    if (!Element.isElement(node) && isItem(options, parentNode)) {
        const wrapperItem = {
            type: options.typeDefault,
            children: [],
        };

        Transforms.wrapNodes(editor, wrapperItem, {
            at: nodePath,
        });
    }
}

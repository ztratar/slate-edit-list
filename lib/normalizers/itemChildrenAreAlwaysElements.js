// @flow
import { Editor, NodeEntry, Node, Transforms, Path, Element } from 'slate';

import { isItem } from '../utils';
import type { Options } from '..';

/**
 * A rule that wraps children of lists with list item
 */
export function itemChildrenAreAlwaysElements(
    options: Options,
    editor: Editor
): void {
    const { normalizeNode } = editor;

    editor.normalizeNode = (entry: NodeEntry): void => {
        const [node, nodePath] = entry;
        let parentNodePath;

        try {
            parentNodePath = Path.parent(nodePath);
        } catch (e) {
            // has no parent (ie. editor)
            normalizeNode(entry);

            return;
        }

        const parentNode = Node.get(editor, parentNodePath);

        if (!Element.isElement(node) && isItem(options)(parentNode)) {
            const wrapperItem = {
                type: options.typeDefault,
                children: [],
            };

            Transforms.wrapNodes(editor, wrapperItem, {
                at: nodePath,
            });

            return;
        }

        normalizeNode(entry);
    };
}

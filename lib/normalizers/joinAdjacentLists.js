// @flow
import { Editor, NodeEntry, Node, Transforms, Element, Path } from 'slate';

import { isList } from '../utils';
import type { Options } from '..';

/**
 * A rule that joins adjacent lists of the same type
 */
export function joinAdjacentLists(options: Options, editor: Editor): void {
    const { normalizeNode } = editor;

    editor.normalizeNode = (entry: NodeEntry): void => {
        const [node, nodePath] = entry;

        if (Element.isElement(node) && isList(options)(node)) {
            let previousSiblingNodePath;
            try {
                previousSiblingNodePath = Path.previous(nodePath);
            } catch (e) {
                // the node doesn't have a previous sibling (ie. first)
                normalizeNode(entry);

                return;
            }

            const previousSiblingNode = Node.get(
                editor,
                previousSiblingNodePath
            );

            if (
                isList(options)(previousSiblingNode) &&
                options.canMerge(node, previousSiblingNode)
            ) {
                const targetNodeLastChildIndex =
                    previousSiblingNode.children.length - 1;

                Editor.withoutNormalizing(editor, () => {
                    const targetNodePath = [
                        ...previousSiblingNodePath,
                        // as the new last child of previous sibling list
                        targetNodeLastChildIndex + 1,
                    ];

                    Transforms.insertNodes(editor, node.children, {
                        at: targetNodePath,
                    });

                    Transforms.removeNodes(editor, {
                        at: nodePath,
                    });
                });
                return;
            }
        }

        normalizeNode(entry);
    };
}

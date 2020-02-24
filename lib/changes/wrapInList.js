// @flow
import {
    Editor,
    Element,
    Node,
    NodeEntry,
    Path,
    Range,
    Transforms,
} from 'slate';

import { type OptionsFormat } from '../options';
import { isList } from '../utils';

/**
 * Wrap the blocks in the current selection in a new list. Selected
 * lists are merged together.
 */
function wrapInList(
    options: OptionsFormat,
    editor: Editor,
    type?: string,
    data?: Object
): void {
    type = type || options.types[0];

    Editor.withoutNormalizing(editor, () => {
        const selectedElements = convertPathsToRefs(
            editor,
            getHighestSelectedElements(editor)
        );
        const newList = {
            type,
            ...(data && { data }),
        };

        Transforms.wrapNodes(editor, newList, {
            match: n => Editor.isBlock(editor, n),
        });

        // Wrap in list items
        selectedElements.forEach(([node, pathRef]) => {
            if (isList(options, node)) {
                // Merge its items with the created list
                Transforms.unwrapNodes(editor, {
                    at: pathRef.current,
                });
            } else {
                Transforms.wrapNodes(
                    editor,
                    { type: options.typeItem },
                    {
                        at: pathRef.current,
                    }
                );
            }
        });
    });
}

/**
 * Returns the highest list of elements that cover the current selection
 */
function getHighestSelectedElements(editor: Editor): Array<NodeEntry<Element>> {
    const [ancestor, ancestorPath] = Editor.above(editor, {
        match: n => Editor.isBlock(editor, n),
    });

    const startPath = Path.relative(editor.selection.anchor.path, ancestorPath);
    const endPath = Path.relative(editor.selection.focus.path, ancestorPath);

    return Range.isCollapsed(editor.selection)
        ? [[ancestor, ancestorPath]]
        : [
              ...Node.descendants(ancestor, {
                  from: startPath,
                  to: endPath,
                  pass: n => !Editor.isBlock(editor, n),
              }),
          ];
}

function convertPathsToRefs(
    editor,
    nodeEntries: Array<NodeEntry<Node>>
): Array<NodeEntry<Node>> {
    return nodeEntries.map(([node, path]) => [
        node,
        Editor.pathRef(editor, path),
    ]);
}

export default wrapInList;

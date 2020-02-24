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
    if (Range.isCollapsed(editor.selection)) {
        const ancestor = Editor.above(editor, {
            match: n => Editor.isBlock(editor, n),
        });

        return [ancestor];
    }

    const ancestorPath = Path.common(
        editor.selection.anchor.path,
        editor.selection.focus.path
    );

    const startIndex = Path.relative(
        editor.selection.anchor.path,
        ancestorPath
    )[0];
    const endIndex = Path.relative(
        editor.selection.focus.path,
        ancestorPath
    )[0];

    return [...Node.children(editor, ancestorPath)].slice(
        startIndex,
        endIndex + 1
    );
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

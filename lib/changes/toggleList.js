// @flow

import { Editor, Node, NodeEntry, Path, Range } from 'slate';
import { unwrapList, wrapInList } from '.';
import { isList, isItem, isSelectionInList } from '../utils';
import type { OptionsFormat } from '../options';

function isListOrItem(options: OptionsFormat, node: Node) {
    return isList(options, node) || isItem(options, node);
}

const isSameLevel = (nodeEntries: Array<NodeEntry>): boolean => {
    if (nodeEntries.length === 0) {
        return true;
    }

    const referenceDepth = nodeEntries[0][1].length;

    return !nodeEntries.some(
        ([, nodeEntryPath]) => nodeEntryPath.length !== referenceDepth
    );
};

const unwrapAllLists = (
    options: OptionsFormat,
    editor: Editor,
    nodes: Array<NodeEntry>
) => {
    const ancestorDescendantsLists = nodes
        .filter(([node]) => isList(options, node))
        .reverse();

    const descendantListsPathRefs = ancestorDescendantsLists.map(
        ([, descendantPath]) => Editor.pathRef(editor, descendantPath)
    );

    // Unwrap all nested lists
    Editor.withoutNormalizing(editor, () => {
        descendantListsPathRefs.forEach(descendantListPathRef => {
            unwrapList(options, editor, descendantListPathRef.current);
        });
    });

    // Unwrap common ancestor
    return unwrapList(options, editor);
};

/**
 * Toggle list on the selected range.
 */
function toggleList(options: OptionsFormat, editor: Editor) {
    const range = editor.selection;
    const [startElement, startElementPath] = Editor.parent(
        editor,
        Range.start(range)
    );
    const [endElement, endElementPath] = Editor.parent(
        editor,
        Range.end(range)
    );

    // -------- SINGLE BLOCK ---------------------------------------------------
    // The selection is in a single block.
    // Let's unwrap just the block, not the whole list.
    if (startElement === endElement) {
        return isSelectionInList(options, editor)
            ? unwrapList(options, editor)
            : wrapInList(options, editor);
    }

    // -------- NOT A SINGLE BLOCK -------------------------------------------
    const ancestorPath = Path.common(startElementPath, endElementPath);
    const ancestor = Node.get(editor, ancestorPath);

    const ancestorDescendants = Array.from(
        Editor.nodes(editor, {
            at: editor.selection,
            match: node => isListOrItem(options, node),
        })
    ).filter(([, descendantPath]) => descendantPath >= ancestorPath);

    // There are no items or lists in selection => wrap them
    if (ancestorDescendants.length === 0) {
        return wrapInList(options, editor); // TODO test scenario
    }

    // All items and lists are the same level => unwrap them
    if (isSameLevel(ancestorDescendants)) {
        return unwrapList(options, editor);
    }

    // // Common Ancestor is not a list or item
    if (!isListOrItem(options, ancestor)) {
        return editor;
    }

    return unwrapAllLists(options, editor, ancestorDescendants);
}

export default toggleList;

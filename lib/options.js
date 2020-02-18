// @flow
import type { Node } from 'slate';

export type OptionsFormat = {
    types?: string[],
    typeItem?: string,
    typeDefault?: string,
    canMerge?: (listA: Node, listB: Node) => boolean
};

/**
 * The plugin options
 */
const optionsMerger = (partialOptions: OptionsFormat) => ({
    maxDepth: 6,
    types: ['ul_list', 'ol_list'],
    typeItem: 'list_item',
    typeDefault: 'paragraph',
    canMerge: (a: Node, b: Node) => a.type === b.type,
    ...partialOptions
});

export default optionsMerger;

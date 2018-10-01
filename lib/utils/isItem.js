// @flow
import { type Node } from 'slate';

import type Options from '../options';

/**
 * True if the node is a list item
 */
function isItem(opts: Options, node: Node): boolean {
    return opts.typeItem.includes(node.type);
}

export default isItem;

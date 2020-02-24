// @flow
import { Element, type Node } from 'slate';
import { type OptionsFormat } from '../options';

/**
 * True if the node is a list container
 */
function isList({ types }: OptionsFormat, node: Node): boolean {
    return Element.isElement(node) && types.includes(node.type);
}

export default isList;

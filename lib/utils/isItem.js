// @flow
import { Element, type Node } from 'slate';
import { type OptionsFormat } from '../options';

/**
 * True if the node is a list item
 */
function isItem({ typeItem }: OptionsFormat, node: Node): boolean {
    return Element.isElement(node) && typeItem === node.type;
}

export default isItem;

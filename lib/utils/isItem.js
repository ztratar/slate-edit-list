// @flow
import { type Node } from 'slate';
import { type OptionsFormat } from '../options';

/**
 * True if the node is a list item
 */
function isItem({ typeItem }: OptionsFormat, { type }: Node): boolean {
    return typeItem === type;
}

export default isItem;

// @flow
import { type Node } from 'slate';
import { type OptionsFormat } from '../options';

/**
 * True if the node is a list container
 */
function isList({ types }: OptionsFormat, { type }: Node): boolean {
    return types.includes(type);
}

export default isList;

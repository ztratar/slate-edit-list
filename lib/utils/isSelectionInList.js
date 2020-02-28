// @flow
import { Editor } from 'slate';

import { type Options } from '..';
import { getItemsAtRange } from '.';
/**
 * Return the current list item, from current selection or from a node.
 */
export const isSelectionInList = (options: Options) => (
    editor: Editor
): boolean => getItemsAtRange(options)(editor).length !== 0;

// @flow
import { Editor } from 'slate';

import { OptionsFormat } from '../options';
import getItemsAtRange from './getItemsAtRange';

/**
 * True if selection is inside a list (and can be unwrapped)
 */
function isSelectionInList(options: OptionsFormat, editor: Editor): boolean {
    return getItemsAtRange(options, editor).length !== 0;
}

export default isSelectionInList;

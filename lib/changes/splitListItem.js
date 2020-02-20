// @flow
import { type Editor, Transforms } from 'slate';

import { type OptionsFormat } from '../options';
import { isItem } from '../utils';

/**
 * Split a list item at the start of the current range.
 */
function splitListItem(options: OptionsFormat, editor: Editor): void {
    Transforms.splitNodes(editor, {
        match: n => isItem(options, n),
        always: true,
    });
}

export default splitListItem;

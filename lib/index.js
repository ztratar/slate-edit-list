// @flow
import optionsMerger, { type OptionsFormat } from './options';
import { onEnter, onTab, onBackspace } from './handlers';
import core from './core';
import { normalizeNode } from './validation';

const KEY_ENTER = 'Enter';
const KEY_TAB = 'Tab';
const KEY_BACKSPACE = 'Backspace';

/**
 * A Slate plugin to handle keyboard events in lists.
 */
function EditList(
    // Options for the plugin
    opts: OptionsFormat = {}
): Object {
    opts = optionsMerger(opts);
    const corePlugin = core(opts);

    return {
        ...corePlugin,

        onKeyDown: onKeyDown.bind(null, opts)
    };
}

const withEditList = (options: OptionsFormat = {}) => editor => {
    options = optionsMerger(options);

    editor.normalizeNode = normalizeNode(options);
    editor.onKeyDown = onKeyDown.bind(null, options);

    return editor;
};

/**
 * User is pressing a key in the editor
 */
function onKeyDown(opts: Options, event, editor, next): void | any {
    const args = [event, editor, next, opts];

    switch (event.key) {
        case KEY_ENTER:
            return onEnter(...args);
        case KEY_TAB:
            return onTab(...args);
        case KEY_BACKSPACE:
            return onBackspace(...args);
        default:
            return next();
    }
}

export default withEditList;

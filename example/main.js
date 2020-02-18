// @flow
/* global document */
/* eslint-disable import/no-extraneous-dependencies */
import React, { useMemo, useState } from 'react';
import ReactDOM from 'react-dom';
import { createEditor } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';

import withEditList from '../lib';

import INITIAL_VALUE from './value';

function renderNode(props: *) {
    const { node, attributes, children, editor } = props;
    const isCurrentItem = plugin.utils
        .getItemsAtRange(editor.value)
        .contains(node);

    switch (node.type) {
        case 'ul_list':
            return <ul {...attributes}>{children}</ul>;
        case 'ol_list':
            return <ol {...attributes}>{children}</ol>;

        case 'list_item':
            return (
                <li
                    className={isCurrentItem ? 'current-item' : ''}
                    title={isCurrentItem ? 'Current Item' : ''}
                    {...props.attributes}
                >
                    {props.children}
                </li>
            );

        case 'paragraph':
            return <p {...attributes}>{children}</p>;
        case 'heading':
            return <h1 {...attributes}>{children}</h1>;
        default:
            return <p {...attributes}>{children}</p>;
    }
}

function renderToolbar() {
    const {
        toggleList,
        wrapInList,
        unwrapList,
        increaseItemDepth,
        decreaseItemDepth
    } = plugin.changes;
    const inList = plugin.utils.isSelectionInList(this.state.value);

    return (
        <div>
            <button
                className={inList ? 'active' : ''}
                onClick={() => this.call(inList ? unwrapList : wrapInList)}
            >
                <i className="fa fa-list-ul fa-lg" />
            </button>

            <button
                className={inList ? '' : 'disabled'}
                onClick={() => this.call(decreaseItemDepth)}
            >
                <i className="fa fa-outdent fa-lg" />
            </button>

            <button
                className={inList ? '' : 'disabled'}
                onClick={() => this.call(increaseItemDepth)}
            >
                <i className="fa fa-indent fa-lg" />
            </button>

            <span className="sep">·</span>

            <button onClick={() => this.call(wrapInList)}>
                Wrap in list
            </button>
            <button onClick={() => this.call(unwrapList)}>
                Unwrap from list
            </button>

            <button onClick={() => this.call(toggleList)}>
                Toggle list
            </button>
        </div>
    );
}

const Example = () => {
    const editor = useMemo(() => withEditList()(withReact(createEditor())), []);

    const [value, setValue] = useState(INITIAL_VALUE);

    return (
        <Slate
            editor={editor}
            value={value}
            onChange={newValue => setValue(newValue)}
        >
            <Editable placeholder="Enter some text...." />
        </Slate>
    );
};

// $FlowFixMe
ReactDOM.render(<Example />, document.getElementById('example'));

// @flow
/* global document */
/* eslint-disable import/no-extraneous-dependencies */
import React, { useCallback, useMemo, useState } from 'react';
import ReactDOM from 'react-dom';
import { createEditor } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';

import { EditListPlugin } from '../lib';

import INITIAL_VALUE from './value';

function renderToolbar() {
    const {
        toggleList,
        wrapInList,
        unwrapList,
        increaseItemDepth,
        decreaseItemDepth,
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

            <button onClick={() => this.call(wrapInList)}>Wrap in list</button>
            <button onClick={() => this.call(unwrapList)}>
                Unwrap from list
            </button>

            <button onClick={() => this.call(toggleList)}>Toggle list</button>
        </div>
    );
}

const Example = () => {
    const [withEditList, onKeyDown] = EditListPlugin();

    const editor = useMemo(() => withEditList(withReact(createEditor())), []);
    const renderElement = useCallback(
        ({ attributes, children, element }: *) => {
            switch (element.type) {
                case 'ul_list':
                    return <ul {...attributes}>{children}</ul>;
                case 'ol_list':
                    return <ol {...attributes}>{children}</ol>;

                case 'list_item':
                    return <li {...attributes}>{children}</li>;

                case 'heading':
                    return <h1 {...attributes}>{children}</h1>;
                case 'paragraph':
                default:
                    return <p {...attributes}>{children}</p>;
            }
        }
    );

    const [value, setValue] = useState(INITIAL_VALUE);

    return (
        <Slate
            editor={editor}
            value={value}
            onChange={newValue => setValue(newValue)}
        >
            <Editable
                placeholder="Enter some text...."
                onKeyDown={onKeyDown(editor)}
                renderElement={renderElement}
            />
        </Slate>
    );
};

ReactDOM.render(<Example />, document.getElementById('example'));

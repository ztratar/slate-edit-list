import expect from 'expect';
import { createEditor, Transforms } from 'slate';

import { withReact } from 'slate-react';
import { getPreviousItem } from '../../lib/utils';
import optionsMerger from '../options';

const value = [
    {
        type: 'ul_list',
        children: [
            {
                type: 'list_item',
                key: 'previous_item',
                children: [
                    {
                        type: 'paragraph',
                        children: [
                            { key: 'first_leaf_node', text: 'First item' },
                        ],
                    },
                ],
            },
            {
                type: 'list_item',
                key: 'current_item',
                children: [
                    {
                        type: 'paragraph',
                        children: [
                            { key: 'second_leaf_node', text: 'Second item' },
                        ],
                    },
                ],
            },
        ],
    },
];

const pathFirstLeafNode = [0, 0, 0, 0];
const pathSecondLeafNode = [0, 1, 0, 0];

let editor;
const options = optionsMerger();

describe('getPreviousItem', () => {
    beforeEach(() => {
        editor = withReact(createEditor());
        editor.children = value;
    });

    describe('from selection', () => {
        it('returns parent list item', () => {
            Transforms.select(editor, pathSecondLeafNode);

            const [currentItem] = getPreviousItem(options, editor);

            expect(currentItem.key).toBe('previous_item');
        });
    });

    describe('from path', () => {
        it('returns parent list item', () => {
            const [currentItem] = getPreviousItem(
                options,
                editor,
                pathSecondLeafNode
            );

            expect(currentItem.key).toBe('previous_item');
        });
    });

    describe('when first list element', () => {
        it('returns null', () => {
            const currentItem = getPreviousItem(
                options,
                editor,
                pathFirstLeafNode
            );

            expect(currentItem).toBe(null);
        });
    });
});

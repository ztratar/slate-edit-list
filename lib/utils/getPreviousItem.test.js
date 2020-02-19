import expect from 'expect';
import { createEditor, Transforms } from 'slate';

import { withReact } from 'slate-react';
import { getPreviousItem } from '../../lib/utils';
import Options from '../../lib/options';

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

describe('getPreviousItem', () => {
    describe('from selection', () => {
        it('returns parent list item', () => {
            const editor = withReact(createEditor());
            editor.children = value;

            Transforms.select(editor, pathSecondLeafNode);

            const options = new Options();
            const [currentItem] = getPreviousItem(options, editor);

            expect(currentItem.key).toBe('previous_item');
        });
    });

    describe('from path', () => {
        it('returns parent list item', () => {
            const editor = withReact(createEditor());
            editor.children = value;

            const options = new Options();
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
            const editor = withReact(createEditor());
            editor.children = value;

            const options = new Options();
            const currentItem = getPreviousItem(
                options,
                editor,
                pathFirstLeafNode
            );

            expect(currentItem).toBe(null);
        });
    });
});

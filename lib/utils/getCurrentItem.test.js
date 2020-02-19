import expect from 'expect';
import { createEditor, Transforms } from 'slate';

import { withReact } from 'slate-react';
import { getCurrentItem } from '../../lib/utils';
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
                        children: [{ text: 'First item' }],
                    },
                ],
            },
            {
                type: 'list_item',
                key: 'normal_current_item',
                children: [
                    {
                        type: 'paragraph',
                        children: [
                            { key: 'flat_list_leaf_node', text: 'Second item' },
                        ],
                    },
                ],
            },
            {
                type: 'list_item',
                key: 'item_with_nesting',
                children: [
                    {
                        type: 'ul_list',
                        children: [
                            {
                                type: 'list_item',
                                key: 'nested_current_item',
                                children: [
                                    {
                                        type: 'paragraph',
                                        children: [
                                            {
                                                key: 'nested_list_leaf_node',
                                                text: 'Nested item',
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
        ],
    },
];

const pathFlatListLeafNode = [0, 1, 0, 0];
const pathNestedListLeafNode = [0, 2, 0, 0, 0, 0];

describe('getCurrentItem', () => {
    describe('from selection', () => {
        it('returns parent list item', () => {
            const editor = withReact(createEditor());
            editor.children = value;

            Transforms.select(editor, pathFlatListLeafNode);

            const options = new Options();
            const [currentItem] = getCurrentItem(options, editor);

            expect(currentItem.key).toBe('normal_current_item');
        });

        it('returns first parent list item', () => {
            const editor = withReact(createEditor());
            editor.children = value;

            Transforms.select(editor, pathNestedListLeafNode);

            const options = new Options();
            const [currentItem] = getCurrentItem(options, editor);

            expect(currentItem.key).toBe('nested_current_item');
        });
    });

    describe('from path', () => {
        it('returns parent list item', () => {
            const editor = withReact(createEditor());
            editor.children = value;

            const options = new Options();
            const [currentItem] = getCurrentItem(
                options,
                editor,
                pathFlatListLeafNode
            );

            expect(currentItem.key).toBe('normal_current_item');
        });

        it('returns first parent list item', () => {
            const editor = withReact(createEditor());
            editor.children = value;

            const options = new Options();
            const [currentItem] = getCurrentItem(
                options,
                editor,
                pathNestedListLeafNode
            );

            expect(currentItem.key).toBe('nested_current_item');
        });
    });
});

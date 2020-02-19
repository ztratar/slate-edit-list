import expect from 'expect';
import { createEditor, Transforms } from 'slate';

import { withReact } from 'slate-react';
import { getCurrentList } from '../../lib/utils';
import Options from '../../lib/options';

const value = [
    {
        type: 'ul_list',
        key: 'first_top_list',
        children: [
            {
                type: 'list_item',
                children: [
                    {
                        type: 'paragraph',
                        children: [{ text: 'First item' }],
                    },
                ],
            },
            {
                type: 'list_item',
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
                children: [
                    {
                        type: 'ul_list',
                        key: 'first_nested_list',
                        children: [
                            {
                                type: 'list_item',
                                children: [
                                    {
                                        type: 'paragraph',
                                        children: [
                                            {
                                                key:
                                                    'first_nested_list_leaf_node',
                                                text: 'Nested item',
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        type: 'ul_list',
                        key: 'second_nested_list',
                        children: [
                            {
                                type: 'list_item',
                                children: [
                                    {
                                        type: 'paragraph',
                                        children: [
                                            {
                                                key:
                                                    'second_nested_list_leaf_node',
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
const pathFirstNestedListLeafNode = [0, 2, 0, 0, 0, 0];
const pathSecondNestedListLeafNode = [0, 2, 1, 0, 0, 0];

describe('getCurrentList', () => {
    describe('from selection', () => {
        it('returns list', () => {
            const editor = withReact(createEditor());
            editor.children = value;

            Transforms.select(editor, pathFlatListLeafNode);

            const options = new Options();
            const [currentItem] = getCurrentList(options, editor);

            expect(currentItem.key).toBe('first_top_list');
        });

        it('returns first parent list', () => {
            const editor = withReact(createEditor());
            editor.children = value;

            Transforms.select(editor, pathFirstNestedListLeafNode);

            const options = new Options();
            const [currentItem] = getCurrentList(options, editor);

            expect(currentItem.key).toBe('first_nested_list');
        });

        it('returns first of 2 siblings list', () => {
            const editor = withReact(createEditor());
            editor.children = value;

            Transforms.select(editor, pathFirstNestedListLeafNode);

            const options = new Options();
            const [currentItem] = getCurrentList(options, editor);

            expect(currentItem.key).toBe('first_nested_list');
        });

        it('returns second of 2 siblings list', () => {
            const editor = withReact(createEditor());
            editor.children = value;

            Transforms.select(editor, pathSecondNestedListLeafNode);

            const options = new Options();
            const [currentItem] = getCurrentList(options, editor);

            expect(currentItem.key).toBe('second_nested_list');
        });
    });

    describe('from path', () => {
        it('returns list', () => {
            const editor = withReact(createEditor());
            editor.children = value;

            const options = new Options();
            const [currentItem] = getCurrentList(
                options,
                editor,
                pathFlatListLeafNode
            );

            expect(currentItem.key).toBe('first_top_list');
        });

        it('returns first parent list', () => {
            const editor = withReact(createEditor());
            editor.children = value;

            const options = new Options();
            const [currentItem] = getCurrentList(
                options,
                editor,
                pathFirstNestedListLeafNode
            );

            expect(currentItem.key).toBe('first_nested_list');
        });

        it('returns first of 2 siblings list', () => {
            const editor = withReact(createEditor());
            editor.children = value;

            const options = new Options();
            const [currentItem] = getCurrentList(
                options,
                editor,
                pathFirstNestedListLeafNode
            );

            expect(currentItem.key).toBe('first_nested_list');
        });

        it('returns second of 2 siblings list', () => {
            const editor = withReact(createEditor());
            editor.children = value;

            const options = new Options();
            const [currentItem] = getCurrentList(
                options,
                editor,
                pathSecondNestedListLeafNode
            );

            expect(currentItem.key).toBe('second_nested_list');
        });
    });
});

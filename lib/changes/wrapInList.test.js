import expect from 'expect';
import { createEditor } from 'slate';
import { withReact } from 'slate-react';
import wrapInList from './wrapInList';
import { NESTED_LIST, SIMPLE_LIST } from '../../tests/constants';

const options = {
    types: ['ul_list'],
    typeItem: 'list_item',
};

let editor;

describe('wrapInList command', () => {
    beforeEach(() => {
        editor = withReact(createEditor());
        editor.isBlock = node => node.type === 'paragraph';
        editor.isInline = node => node.type === 'link';
    });

    describe('should wrap items in a list', () => {
        describe('with simple selection (caret): ', () => {
            it('a single paragraph', () => {
                editor.children = [
                    {
                        type: 'paragraph',
                        children: [
                            {
                                text: 'List item',
                            },
                        ],
                    },
                ];
                editor.selection = {
                    anchor: {
                        path: [0, 0],
                        offset: 0,
                    },
                    focus: {
                        path: [0, 0],
                        offset: 0,
                    },
                };

                wrapInList(options, editor);

                expect(editor.children).toEqual(SIMPLE_LIST);
            });

            it('a list', () => {
                editor.children = [
                    {
                        type: 'ul_list',
                        children: [
                            {
                                type: 'list_item',
                                children: [
                                    {
                                        type: 'paragraph',
                                        children: [
                                            {
                                                text: 'Nested list item',
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                ];
                editor.selection = {
                    anchor: {
                        path: [0, 0, 0, 0],
                        offset: 0,
                    },
                    focus: {
                        path: [0, 0, 0, 0],
                        offset: 0,
                    },
                };

                wrapInList(options, editor);

                expect(editor.children).toEqual(NESTED_LIST);
            });
        });

        describe('with advanced selection: ', () => {
            it('multiple paragraphs (same level)', () => {
                editor.children = [
                    { type: 'paragraph', children: [{ text: 'First item' }] },
                    {
                        type: 'paragraph',
                        children: [
                            {
                                text: 'Second item',
                            },
                        ],
                    },
                ];
                editor.selection = {
                    anchor: {
                        path: [0, 0],
                        offset: 0,
                    },
                    focus: {
                        path: [1, 0],
                        offset: 0,
                    },
                };

                const expected = [
                    {
                        type: 'ul_list',
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
                                        children: [{ text: 'Second item' }],
                                    },
                                ],
                            },
                        ],
                    },
                ];

                wrapInList(options, editor);

                expect(editor.children).toEqual(expected);
            });

            it('paragraph + list', () => {
                editor.children = [
                    { type: 'paragraph', children: [{ text: 'First item' }] },
                    {
                        type: 'ul_list',
                        children: [
                            {
                                type: 'list_item',
                                children: [
                                    {
                                        type: 'paragraph',
                                        children: [
                                            {
                                                text: 'Second item',
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                ];
                editor.selection = {
                    anchor: {
                        path: [0, 0],
                        offset: 0,
                    },
                    focus: {
                        path: [1, 0, 0, 0],
                        offset: 0,
                    },
                };

                const expected = [
                    {
                        type: 'ul_list',
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
                                        children: [{ text: 'Second item' }],
                                    },
                                ],
                            },
                        ],
                    },
                ];

                wrapInList(options, editor);

                expect(editor.children).toEqual(expected);
            });

            it('nested list', () => {
                editor.children = [
                    {
                        type: 'ul_list',
                        children: [
                            {
                                type: 'list_item',
                                children: [
                                    {
                                        type: 'paragraph',
                                        children: [{ text: 'First item' }],
                                    },
                                    {
                                        type: 'ul_list',
                                        children: [
                                            {
                                                type: 'list_item',
                                                children: [
                                                    {
                                                        type: 'paragraph',
                                                        children: [
                                                            {
                                                                text:
                                                                    'Second item',
                                                            },
                                                        ],
                                                    },
                                                ],
                                            },
                                        ],
                                    },
                                    {
                                        type: 'paragraph',
                                        children: [{ text: 'Third item' }],
                                    },
                                ],
                            },
                        ],
                    },
                ];
                editor.selection = {
                    anchor: {
                        path: [0, 0, 0, 0],
                        offset: 0,
                    },
                    focus: {
                        path: [0, 0, 1, 0, 0, 0],
                        offset: 0,
                    },
                };

                const expected = [
                    {
                        type: 'ul_list',
                        children: [
                            {
                                type: 'list_item',
                                children: [
                                    {
                                        type: 'ul_list',
                                        children: [
                                            {
                                                type: 'list_item',
                                                children: [
                                                    {
                                                        type: 'paragraph',
                                                        children: [
                                                            {
                                                                text:
                                                                    'First item',
                                                            },
                                                        ],
                                                    },
                                                ],
                                            },
                                            {
                                                type: 'list_item',
                                                children: [
                                                    {
                                                        type: 'paragraph',
                                                        children: [
                                                            {
                                                                text:
                                                                    'Second item',
                                                            },
                                                        ],
                                                    },
                                                ],
                                            },
                                        ],
                                    },
                                    {
                                        type: 'paragraph',
                                        children: [
                                            {
                                                text: 'Third item',
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                ];

                wrapInList(options, editor);

                expect(editor.children).toEqual(expected);
            });

            it('nested list between paragraphs', () => {
                editor.children = [
                    {
                        type: 'ul_list',
                        children: [
                            {
                                type: 'list_item',
                                children: [
                                    {
                                        type: 'paragraph',
                                        children: [{ text: 'First item' }],
                                    },
                                    {
                                        type: 'ul_list',
                                        children: [
                                            {
                                                type: 'list_item',
                                                children: [
                                                    {
                                                        type: 'paragraph',
                                                        children: [
                                                            {
                                                                text:
                                                                    'Second item',
                                                            },
                                                        ],
                                                    },
                                                ],
                                            },
                                        ],
                                    },
                                    {
                                        type: 'paragraph',
                                        children: [{ text: 'Third item' }],
                                    },
                                ],
                            },
                        ],
                    },
                ];
                editor.selection = {
                    anchor: {
                        path: [0, 0, 0, 0],
                        offset: 0,
                    },
                    focus: {
                        path: [0, 0, 2, 0],
                        offset: 0,
                    },
                };

                const expected = [
                    {
                        type: 'ul_list',
                        children: [
                            {
                                type: 'list_item',
                                children: [
                                    {
                                        type: 'ul_list',
                                        children: [
                                            {
                                                type: 'list_item',
                                                children: [
                                                    {
                                                        type: 'paragraph',
                                                        children: [
                                                            {
                                                                text:
                                                                    'First item',
                                                            },
                                                        ],
                                                    },
                                                ],
                                            },
                                            {
                                                type: 'list_item',
                                                children: [
                                                    {
                                                        type: 'paragraph',
                                                        children: [
                                                            {
                                                                text:
                                                                    'Second item',
                                                            },
                                                        ],
                                                    },
                                                ],
                                            },
                                            {
                                                type: 'list_item',
                                                children: [
                                                    {
                                                        type: 'paragraph',
                                                        children: [
                                                            {
                                                                text:
                                                                    'Third item',
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

                wrapInList(options, editor);

                expect(editor.children).toEqual(expected);
            });
        });
    });
});

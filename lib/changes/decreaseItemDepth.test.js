import expect from 'expect';
import { createEditor } from 'slate';
import { withReact } from 'slate-react';
import decreaseItemDepth from './decreaseItemDepth';
import {
    COMPLEX_LIST,
    COMPLICATED_LIST,
    NESTED_LIST,
    NESTED_LIST_MULTIPLE_NODES,
    PARAGRAPH,
    SIMPLE_LIST,
} from '../../tests/constants';

const options = {
    typeItem: 'list_item',
    types: ['ul_list'],
};

let editor;

const getSelectionByPath = path => ({
    anchor: {
        path,
        offset: 0,
    },
    focus: {
        path,
        offset: 0,
    },
});

describe('decreaseItemDepth command function', () => {
    beforeEach(() => {
        editor = withReact(createEditor());
    });

    it("shouldn't do anything if there are no lists", () => {
        const selectionPath = [0, 0];

        editor.children = PARAGRAPH;
        editor.selection = getSelectionByPath(selectionPath);

        const expected = PARAGRAPH;

        decreaseItemDepth(options, editor);

        expect(editor.children).toEqual(expected);
    });

    it("shouldn't do anything if the list is already top level", () => {
        const selectionPath = [0, 0, 0, 0];

        editor.children = SIMPLE_LIST;
        editor.selection = getSelectionByPath(selectionPath);

        const expected = SIMPLE_LIST;

        decreaseItemDepth(options, editor);

        expect(editor.children).toEqual(expected);
    });

    describe('should decrease item depth', () => {
        it('for a simple nested list', () => {
            const selectionPath = [0, 0, 0, 0, 0, 0];

            editor.children = NESTED_LIST;
            editor.selection = getSelectionByPath(selectionPath);

            const expected = [
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

            decreaseItemDepth(options, editor);

            expect(editor.children).toEqual(expected);
        });

        it('for a list with multiple nodes and a nested list', () => {
            const selectionPath = [0, 0, 0, 0, 0, 0];

            editor.children = NESTED_LIST_MULTIPLE_NODES;
            editor.selection = getSelectionByPath(selectionPath);

            const expected = [
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
                        {
                            type: 'list_item',
                            children: [
                                {
                                    type: 'paragraph',
                                    children: [
                                        {
                                            text: 'List item',
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ];

            decreaseItemDepth(options, editor);

            expect(editor.children).toEqual(expected);
        });

        it('for a complex list', () => {
            const selectionPath = [0, 0, 0, 0, 0, 0];

            editor.children = COMPLEX_LIST;
            editor.selection = getSelectionByPath(selectionPath);

            const expected = [
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
                                            text: 'Nested list item no. 1',
                                        },
                                    ],
                                },
                            ],
                        },
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
                                                                'Nested list item no. 2',
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
                                                                'Nested list item no. 3',
                                                        },
                                                    ],
                                                },
                                            ],
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
                                            text: 'List item no. 2',
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
                                            text: 'List item no. 3',
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ];

            decreaseItemDepth(options, editor);

            expect(editor.children).toEqual(expected);
        });

        it('for a complicated list', () => {
            const selectionPath = [0, 0, 0, 0, 0, 0];

            editor.children = COMPLICATED_LIST;
            editor.selection = getSelectionByPath(selectionPath);

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
                                                    type: 'ul_list',
                                                    children: [
                                                        {
                                                            type: 'list_item',
                                                            children: [
                                                                {
                                                                    type:
                                                                        'ul_list',
                                                                    children: [
                                                                        {
                                                                            type:
                                                                                'list_item',
                                                                            children: [
                                                                                {
                                                                                    type:
                                                                                        'paragraph',
                                                                                    children: [
                                                                                        {
                                                                                            text:
                                                                                                'Complicated list item',
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
                                            ],
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ];

            decreaseItemDepth(options, editor);

            expect(editor.children).toEqual(expected);
        });
    });
});

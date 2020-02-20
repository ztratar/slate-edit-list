import expect from 'expect';
import { createEditor } from 'slate';
import { withReact } from 'slate-react';
import splitListItem from './splitListItem';
import { SIMPLE_LIST } from '../../tests/constants';

const options = {
    typeItem: 'list_item',
};

const selectionPath = [0, 0, 0, 0];

let editor;

describe('splitListItem command', () => {
    beforeEach(() => {
        editor = withReact(createEditor());
        editor.children = SIMPLE_LIST;
    });

    describe('should split a list item in two', () => {
        it('at the start of a node', () => {
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
                                            text: '',
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

            editor.selection = {
                anchor: {
                    path: selectionPath,
                    offset: 0,
                },
                focus: {
                    path: selectionPath,
                    offset: 0,
                },
            };

            splitListItem(options, editor);

            expect(editor.children).toEqual(expected);
        });

        it('in the middle of a node', () => {
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
                                            text: 'List',
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
                                            text: ' item',
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
                    path: selectionPath,
                    offset: 4,
                },
                focus: {
                    path: selectionPath,
                    offset: 4,
                },
            };

            splitListItem(options, editor);

            expect(editor.children).toEqual(expected);
        });

        it('at the end of a node', () => {
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
                                            text: 'List item',
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
                                            text: '',
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
                    path: selectionPath,
                    offset: 9,
                },
                focus: {
                    path: selectionPath,
                    offset: 9,
                },
            };

            splitListItem(options, editor);

            expect(editor.children).toEqual(expected);
        });
    });
});

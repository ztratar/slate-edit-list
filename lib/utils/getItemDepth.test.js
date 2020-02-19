import expect from 'expect';
import { createEditor, Transforms } from 'slate';
import { withReact } from 'slate-react';
import getItemDepth from './getItemDepth';
import { COMPLICATED_LIST } from '../../tests/constants';

const options = {
    typeItem: 'list_item',
};

let editor;

describe('getItemDepth util function', () => {
    describe('from selection', () => {
        beforeEach(() => {
            editor = withReact(createEditor());
        });

        it("should return 0 if there isn't any list item in tree", () => {
            editor.children = [
                {
                    type: 'paragraph',
                    children: [
                        {
                            text: 'Just a text',
                        },
                    ],
                },
            ];

            Transforms.select(editor, [0]);

            expect(getItemDepth(options, editor)).toBe(0);
        });

        it('should return 1 for a simple list', () => {
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
                                            text: 'List item',
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ];

            Transforms.select(editor, [0]);

            expect(getItemDepth(options, editor)).toBe(1);
        });

        it('should return 2 for a nested list', () => {
            editor.children = [
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
                                                                'Nested list item',
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

            Transforms.select(editor, [0]);

            expect(getItemDepth(options, editor)).toBe(2);
        });

        it('should return 5 for a complicated list', () => {
            editor.children = COMPLICATED_LIST;

            Transforms.select(editor, [0]);

            expect(getItemDepth(options, editor)).toBe(5);
        });
    });

    describe('from path', () => {
        beforeEach(() => {
            editor = withReact(createEditor());
        });

        it("should return 0 if there isn't any list item in tree", () => {
            editor.children = [
                {
                    type: 'paragraph',
                    children: [
                        {
                            text: 'Just a text',
                        },
                    ],
                },
            ];

            const path = [0, 0];

            expect(getItemDepth(options, editor, path)).toBe(0);
        });

        it('should return 1 for a simple list', () => {
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
                                            text: 'List item',
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ];

            const path = [0, 0, 0, 0];

            expect(getItemDepth(options, editor, path)).toBe(1);
        });

        it('should return 2 for a nested list', () => {
            editor.children = [
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
                                                                'Nested list item',
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

            const path = [0, 0, 0, 0, 0, 0];

            expect(getItemDepth(options, editor, path)).toBe(2);
        });

        it('should return 5 for a complicated list', () => {
            editor.children = COMPLICATED_LIST;

            const path = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

            expect(getItemDepth(options, editor, path)).toBe(5);
        });
    });
});

import expect from 'expect';
import { createEditor, Transforms } from 'slate';

import { withReact } from 'slate-react';
import optionsMerger from '../options';
import { joinAdjacentLists } from './joinAdjacentLists';

const valueSimple = {
    input: [
        {
            type: 'ul_list',
            children: [
                {
                    type: 'list_item',
                    children: [
                        {
                            type: 'paragraph',
                            children: [{ text: 'Item 1' }],
                        },
                    ],
                },
            ],
        },
        {
            type: 'ul_list',
            children: [
                {
                    type: 'list_item',
                    children: [
                        {
                            type: 'paragraph',
                            children: [{ text: 'Item 2' }],
                        },
                    ],
                },
            ],
        },
    ],
    output: [
        {
            type: 'ul_list',
            children: [
                {
                    type: 'list_item',
                    children: [
                        {
                            type: 'paragraph',
                            children: [{ text: 'Item 1' }],
                        },
                    ],
                },
                {
                    type: 'list_item',
                    children: [
                        {
                            type: 'paragraph',
                            children: [{ text: 'Item 2' }],
                        },
                    ],
                },
            ],
        },
    ],
};

const valueMultiple = {
    input: [
        {
            type: 'ul_list',
            children: [
                {
                    type: 'list_item',
                    children: [
                        {
                            type: 'paragraph',
                            children: [{ text: 'Item 1' }],
                        },
                    ],
                },
            ],
        },
        {
            type: 'ul_list',
            children: [
                {
                    type: 'list_item',
                    children: [
                        {
                            type: 'paragraph',
                            children: [{ text: 'Item 2' }],
                        },
                    ],
                },
            ],
        },
        {
            type: 'ul_list',
            children: [
                {
                    type: 'list_item',
                    children: [
                        {
                            type: 'paragraph',
                            children: [{ text: 'Item 3' }],
                        },
                    ],
                },
            ],
        },
    ],
    output: [
        {
            type: 'ul_list',
            children: [
                {
                    type: 'list_item',
                    children: [
                        {
                            type: 'paragraph',
                            children: [{ text: 'Item 1' }],
                        },
                    ],
                },
                {
                    type: 'list_item',
                    children: [
                        {
                            type: 'paragraph',
                            children: [{ text: 'Item 2' }],
                        },
                    ],
                },
                {
                    type: 'list_item',
                    children: [
                        {
                            type: 'paragraph',
                            children: [{ text: 'Item 3' }],
                        },
                    ],
                },
            ],
        },
    ],
};

const valueValidSeparation = {
    input: [
        {
            type: 'ul_list',
            children: [
                {
                    type: 'list_item',
                    children: [
                        {
                            type: 'paragraph',
                            children: [{ text: 'Item 1' }],
                        },
                    ],
                },
            ],
        },
        {
            type: 'paragraph',
            children: [{ text: 'Item intermediate' }],
        },
        {
            type: 'ul_list',
            children: [
                {
                    type: 'list_item',
                    children: [
                        {
                            type: 'paragraph',
                            children: [{ text: 'Item 2' }],
                        },
                    ],
                },
            ],
        },
        {
            type: 'ul_list',
            children: [
                {
                    type: 'list_item',
                    children: [
                        {
                            type: 'paragraph',
                            children: [{ text: 'Item 3' }],
                        },
                    ],
                },
            ],
        },
    ],
    output: [
        {
            type: 'ul_list',
            children: [
                {
                    type: 'list_item',
                    children: [
                        {
                            type: 'paragraph',
                            children: [{ text: 'Item 1' }],
                        },
                    ],
                },
            ],
        },
        {
            type: 'paragraph',
            children: [{ text: 'Item intermediate' }],
        },
        {
            type: 'ul_list',
            children: [
                {
                    type: 'list_item',
                    children: [
                        {
                            type: 'paragraph',
                            children: [{ text: 'Item 2' }],
                        },
                    ],
                },
                {
                    type: 'list_item',
                    children: [
                        {
                            type: 'paragraph',
                            children: [{ text: 'Item 3' }],
                        },
                    ],
                },
            ],
        },
    ],
};

const valueDifferentListTypes = {
    input: [
        {
            type: 'ul_list',
            children: [
                {
                    type: 'list_item',
                    children: [
                        {
                            type: 'paragraph',
                            children: [{ text: 'Item 1' }],
                        },
                    ],
                },
            ],
        },
        {
            type: 'ol_list',
            children: [
                {
                    type: 'list_item',
                    children: [
                        {
                            type: 'paragraph',
                            children: [{ text: 'Item 2' }],
                        },
                    ],
                },
            ],
        },
        {
            type: 'ul_list',
            children: [
                {
                    type: 'list_item',
                    children: [
                        {
                            type: 'paragraph',
                            children: [{ text: 'Item 3' }],
                        },
                    ],
                },
            ],
        },
    ],
};

let editor;
const options = optionsMerger();

describe('joinAdjacentLists', () => {
    beforeEach(() => {
        editor = withReact(createEditor());
        const defaultNormalizeNode = editor.normalizeNode;
        editor.normalizeNode = nodeEntry => {
            joinAdjacentLists(options, nodeEntry, editor);

            defaultNormalizeNode(nodeEntry);
        };
    });

    describe('when more lists follow each other', () => {
        it('joins two into one list', () => {
            Transforms.insertNodes(editor, valueSimple.input, {
                at: [0],
            });

            expect(editor.children).toEqual(valueSimple.output);
        });

        it('joins three into one list', () => {
            Transforms.insertNodes(editor, valueMultiple.input, {
                at: [0],
            });

            expect(editor.children).toEqual(valueMultiple.output);
        });

        it('joins only lists that are immediately after each other', () => {
            Transforms.insertNodes(editor, valueValidSeparation.input, {
                at: [0],
            });

            expect(editor.children).toEqual(valueValidSeparation.output);
        });

        it('joins only lists that are of a same type', () => {
            Transforms.insertNodes(editor, valueDifferentListTypes.input, {
                at: [0],
            });

            expect(editor.children).toEqual(valueDifferentListTypes.input);
        });
    });
});

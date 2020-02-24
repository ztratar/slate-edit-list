import expect from 'expect';
import { createEditor, Transforms } from 'slate';

import { withReact } from 'slate-react';
import optionsMerger from '../options';
import { itemChildrenAreAlwaysElements } from './itemChildrenAreAlwaysElements';

const valueSimple = {
    input: [
        {
            type: 'ul_list',
            children: [
                {
                    type: 'list_item',
                    children: [],
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
    ],
};

const valueIntermediate = {
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
                {
                    type: 'list_item',
                    children: [],
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

const valueNestedList = {
    input: [
        {
            type: 'ul_list',
            children: [
                {
                    type: 'list_item',
                    children: [
                        {
                            type: 'ol_list',
                            children: [
                                {
                                    type: 'list_item',
                                    children: [],
                                },
                            ],
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
                            type: 'ol_list',
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
                    ],
                },
            ],
        },
    ],
};

let editor;
const options = optionsMerger();

describe('itemChildrenAreAlwaysElements', () => {
    beforeEach(() => {
        editor = withReact(createEditor());
        const defaultNormalizeNode = editor.normalizeNode;
        editor.normalizeNode = nodeEntry => {
            itemChildrenAreAlwaysElements(options, nodeEntry, editor);

            defaultNormalizeNode(nodeEntry);
        };
    });

    it('it wraps item child with default element if not element', () => {
        editor.children = valueSimple.input;
        Transforms.insertNodes(editor, [{ text: 'Item 1' }], {
            at: [0, 0, 0],
        });

        expect(editor.children).toEqual(valueSimple.output);
    });

    it('it does not affect surrounding items in list by wrapping', () => {
        editor.children = valueIntermediate.input;
        Transforms.insertNodes(editor, [{ text: 'Item 2' }], {
            at: [0, 1, 0],
        });

        expect(editor.children).toEqual(valueIntermediate.output);
    });

    it('it works in deeply nested list items', () => {
        editor.children = valueNestedList.input;
        Transforms.insertNodes(editor, [{ text: 'Item 1' }], {
            at: [0, 0, 0, 0, 0],
        });

        expect(editor.children).toEqual(valueNestedList.output);
    });
});

// @flow
import expect from 'expect';
import { createEditor } from 'slate';
import { withReact } from 'slate-react';
import getListForItem from './getListForItem';
import { type OptionsFormat } from '../options';

const options: OptionsFormat = {
    types: ['ul_list'],
    typeItem: 'list_item',
};

let editor;

describe('getListForItem util function', () => {
    beforeEach(() => {
        editor = withReact(createEditor());
    });

    it('should get the list parent for a list item', () => {
        const list = {
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
        };

        editor.children = [list];

        const path = [0, 0];

        expect(getListForItem(options, editor, path)).toBe(list);
    });

    it("should return null if list item doesn't have a list parent", () => {
        const list = {
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
        };

        editor.children = [list];

        const path = [0];

        expect(getListForItem(options, editor, path)).toBe(null);
    });

    it("should return null if list item's parent isn't a list", () => {
        const list = {
            type: 'paragraph',
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
        };

        editor.children = [list];

        const path = [0, 0];

        expect(getListForItem(options, editor, path)).toBe(null);
    });
});

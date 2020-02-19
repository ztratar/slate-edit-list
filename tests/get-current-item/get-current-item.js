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
                key: 'current_item',
                children: [
                    {
                        type: 'paragraph',
                        children: [{ key: 'cursor', text: 'Second item' }],
                    },
                ],
            },
        ],
    },
];

describe('getCurrentItem', () => {
    describe('from selection', () => {
        it('returns first parent list item', () => {
            const editor = withReact(createEditor());
            editor.children = value;

            Transforms.select(editor, [0, 1]);

            const opt = new Options();
            const currentItem = getCurrentItem(opt, editor);

            expect(currentItem.key).toBe('current_item');
        });
    });
});

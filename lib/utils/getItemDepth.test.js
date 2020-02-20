import expect from 'expect';
import { createEditor, Transforms } from 'slate';
import { withReact } from 'slate-react';
import getItemDepth from './getItemDepth';
import {
    COMPLICATED_LIST,
    NESTED_LIST,
    PARAGRAPH,
    SIMPLE_LIST,
} from '../../tests/constants';

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
            editor.children = PARAGRAPH;

            Transforms.select(editor, [0]);

            expect(getItemDepth(options, editor)).toBe(0);
        });

        it('should return 1 for a simple list', () => {
            editor.children = SIMPLE_LIST;

            Transforms.select(editor, [0]);

            expect(getItemDepth(options, editor)).toBe(1);
        });

        it('should return 2 for a nested list', () => {
            editor.children = NESTED_LIST;

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
            editor.children = PARAGRAPH;

            const path = [0, 0];

            expect(getItemDepth(options, editor, path)).toBe(0);
        });

        it('should return 1 for a simple list', () => {
            editor.children = SIMPLE_LIST;

            const path = [0, 0, 0, 0];

            expect(getItemDepth(options, editor, path)).toBe(1);
        });

        it('should return 2 for a nested list', () => {
            editor.children = NESTED_LIST;

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

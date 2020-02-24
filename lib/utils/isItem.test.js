// @flow
import expect from 'expect';
import isItem from './isItem';
import { type OptionsFormat } from '../options';

describe('isItem util function', () => {
    it('should return true if node is of list item type', () => {
        const options: OptionsFormat = {
            typeItem: 'list_item',
        };

        const node = {
            type: 'list_item',
            children: [],
        };

        expect(isItem(options, node)).toBeTruthy();
    });

    it('should return false if node is not of list item type', () => {
        const options: OptionsFormat = {
            typeItem: 'list_item',
        };

        const node = {
            type: 'paragraph',
            children: [],
        };

        expect(isItem(options, node)).toBeFalsy();
    });
});

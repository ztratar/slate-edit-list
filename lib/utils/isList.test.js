// @flow
import expect from 'expect';
import isList from './isList';
import { type OptionsFormat } from '../options';

describe('isList util function', () => {
    it('should return true if node is a list type', () => {
        const options: OptionsFormat = {
            types: ['ul_list'],
        };

        const node = {
            type: 'ul_list',
            children: [],
        };

        expect(isList(options, node)).toBeTruthy();
    });

    it('should return false if node is not a list type', () => {
        const options: OptionsFormat = {
            types: ['ul_list'],
        };

        const node = {
            type: 'paragraph',
            children: [],
        };

        expect(isList(options, node)).toBeFalsy();
    });
});

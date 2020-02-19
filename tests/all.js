import expect from 'expect';
import fs from 'fs';
import path from 'path';
import Slate, { createEditor } from 'slate';
import readMetadata from 'read-metadata';

import EditList from '../lib';
import { withReact } from 'slate-react';

function deserializeValue(plugin, json) {
    const SCHEMA = Slate.Schema.create({
        plugins: [plugin]
    });

    return Slate.Value.fromJSON(
        { ...json, schema: SCHEMA },
        { normalize: false }
    );
}

// describe('slate-edit-list', () => {
//     const tests = fs.readdirSync(__dirname);
//
//     tests.forEach((test, index) => {
//         if (test[0] === '.' || path.extname(test).length > 0) return;
//         it(test, () => {
//             const plugin = EditList();
//
//             const dir = path.resolve(__dirname, test);
//             // input slate state, yaml turned into object
//             const input = readMetadata.sync(path.resolve(dir, 'input.yaml'));
//             const expectedPath = path.resolve(dir, 'expected.yaml');
//             // output slate state, yaml turned into object
//             const expected =
//                 fs.existsSync(expectedPath) && readMetadata.sync(expectedPath);
//
//             // the function representing the test
//             // can expect() or encapsulate a change
//             // that should result in expected.yaml
//             // eslint-disable-next-line
//             const runChange = require(path.resolve(dir, 'change.js')).default;
//
//             const editor = withReact(createEditor());
//             editor.children = input;
//             // const valueInput = deserializeValue(plugin, input);
//
//             const newChange = runChange(plugin, editor);
//
//             if (expected) {
//                 const newDocJSon = newChange.value.toJSON();
//                 expect(newDocJSon).toEqual(
//                     deserializeValue(plugin, expected).toJSON()
//                 );
//             }
//         });
//     });
// });

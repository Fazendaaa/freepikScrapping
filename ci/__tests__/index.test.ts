/**
 * Main tests.
 */

import { readFileSync } from 'fs';
import { join } from 'path';
import { searchFreepik } from '../../src/index';

interface Mock {
    label: string;
    input: any;
    output: any;
}

const basePath = join(__dirname, '../__mocks__/searchFreepik');
const mocks = JSON.parse(readFileSync(basePath, 'utf8'));

describe('Testing searchFreepik function', () => {
    mocks.forEach(({ label, input, output }) => {
        test(label, () => {
            expect(searchFreepik(input)).resolves.toEqual(output);
        });
    });
});

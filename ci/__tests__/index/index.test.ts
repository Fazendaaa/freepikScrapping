/**
 * Main tests.
 */

import { readFileSync } from 'fs';
import { join } from 'path';
import { searchFreepik } from '../../../src/index';

interface Mock {
    response: string;
    label: string;
    input: any;
    output: any;
}

const basePath = join(__dirname, '../../__mocks__/index/searchFreepik.json');
const mocks: Array<Mock> = JSON.parse(readFileSync(basePath, 'utf8'));

describe('Testing searchFreepik function', () => {
    mocks.forEach(({ response, label, input, output }) => {
        test(label, () => {
            if ('resolves' === response) {
                expect(searchFreepik(input)).resolves.toEqual(output);
            } else {
                expect(searchFreepik(input)).rejects.toThrow();
            }
        });
    });
});

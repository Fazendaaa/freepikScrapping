/**
 * Parse functions.
 */

import { matchH1, regexMultiples, regexOne } from './regex';

export const parsePageNumber = (page: number): string => (undefined !== page && null !== page) ? `&order=${page}&vars=${page}` : '';

export const parseFree = (input: string): boolean => {
    const option = regexOne({
        input: matchH1(input),
        regex: /<span class="type">(.*)<\/span>/,
        toReplace: /(<span class="type">)|(<\/span>)/g
    })

    return option.includes('grátis') || option.includes('gratuita');
};

export const parseTitle = (input: string): string => regexOne({
    input: matchH1(input),
    regex: /<span class="title">(.*)<\/span>/,
    toReplace: /(<span class="title">)|(<\/span>)/g
});

export const parseThumb = (input: string): string => regexOne({
    input,
    regex: /(<!-- Image preview -->(\s*\n*)<img(\s*)src="(.*?)")/g,
    toReplace: /(<!-- Image preview -->(\s*\n*)<img(\s*)src=")|(")/g
});

export const parseDownload = (input: string): string => regexOne({
    input,
    regex: /(<!-- Direct download button -->(\s*|\n*)<(.*)href="(.*)" )/g,
    toReplace: /(<!-- Direct download button -->(\s*)|(\n*)<(.*)href=")|(" )/g
});

export const parseCreator = (input: string): string => regexOne({
    input,
    regex: /(<!-- Author Detail -->(\n*\s*.*?)<\/a>(\n*\s*.*?)<\/span>)/g,
    toReplace: /(<!-- Author(\s*\w*\W*.*)href=")|(".*\s*\w*<\/span>)/g
});

export const removeListTag = (input: string): string => regexOne({
    input,
    regex: /">(.*?)<\/a>/,
    toReplace: /(">)|(<\/a>)/g
});

const parseTagItem = (input: string): Array<string> => {
    const output = regexMultiples({
        input,
        regex: /<li><a href="(.*?)" title="(.*?)">(.*?)<\/a>/gm,
        toReplace: /\s/
    });

    return output.map(removeListTag);
};

export const parseTags = (input: string): Array<string> => parseTagItem(regexOne({
    input,
    regex: /<!-- Tags -->(\s*\n*)<ul class="tags">(\s*\n*)[^]*<\/ul>(\s*\n*)<!-- END Tags -->/g,
    toReplace: /(<!-- Tags -->(\s*\n*)<ul class="tags">)|(<\/ul>(\s*\n*)<!-- END Tags -->)/g
}));

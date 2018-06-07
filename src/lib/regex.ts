/**
 * Regex functions.
 */

export interface RegexContext {
    input: string;
    regex: RegExp;
    toReplace: RegExp;
}

export const matchH1 = (input: string): string => {
    const header = <RegExpMatchArray>input.match(/<h1>[^]*<\/h1>/gm);

    return header[0];
}

export const regexOne = ({ input, regex, toReplace }: RegexContext): string => {
    const matched = <RegExpMatchArray>input.match(regex);
    const first = matched[0];

    return first.replace(toReplace, '');
};

export const regexMultiples = ({ input, regex, toReplace }: RegexContext): Array<string> => {
    const matched = <RegExpMatchArray>input.match(regex);

    return matched.map(element => element.replace(toReplace, ''));
};

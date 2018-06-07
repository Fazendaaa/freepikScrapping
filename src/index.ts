/**
 * Main application.
 */

import { IncomingMessage } from 'http';
import { get } from 'https';

export interface SearchContext {
    term: string;
    page?: number;
}

interface FetchContext {
    search: Function;
    url: string;
}

interface HomepageContext extends SearchContext {
    search: Function;
}

export interface ElementContent {
    title: string;
    tags: Array<string>;
    is_free: boolean;
    thumb_url: string;
    download_url: string;
    creator_profile: string;
}

export interface FreepikElement extends ElementContent {
    url: string;
}

interface RegexContext {
    input: string;
    regex: RegExp;
    toReplace: RegExp;
}

const handleIncomingMessage = (message: IncomingMessage) => new Promise((resolve: (response: string) => void) => {
    let chunk = '';

    if (200 !== message.statusCode) {
        throw new Error('Connection dropped.');
    }

    message.setEncoding('utf8');
    message.on('data', (data: string) => chunk += data);

    message.on('end', () => resolve(chunk));
});

const fetchWebsite = ({ search, url }: FetchContext) => new Promise((resolve: (response: string) => void) => {
    search(url, async (res: IncomingMessage) => resolve(await handleIncomingMessage(res)))
    .on('error', (err: Error) => {
        throw err;
    });
});

const parsePageNumber = (page: number): string => (undefined !== page && null !== page) ? `&order=${page}&vars=${page}` : '';

const fetchHomepage = async ({ term, page, search }: HomepageContext): Promise<string> =>  {
    const baseUrl = 'https://br.freepik.com/index.php?goto=2&k='.concat(term).concat(parsePageNumber(<number> page));

    return await fetchWebsite({ url: baseUrl, search });
};

const fetchLinks = (input: string): RegExpMatchArray | null => {
    const links = <RegExpMatchArray> input.match(/<a id="" href="(.*?)"/gm);

    return links.map(matched => matched.replace(/(<a id="" href=")|"/gm, ''));
};

const matchH1 = (input: string): string => {
    const header = <RegExpMatchArray> input.match(/<h1>[^]*<\/h1>/gm);

    return header[0];
}

const regexMe = ({ input, regex, toReplace }: RegexContext): string => {
    const matched = <RegExpMatchArray> input.match(regex);
    const first = matched[0];

    return first.replace(toReplace, '');
};

const parseFree = (input: string): boolean => {
    const option = regexMe({
        input: matchH1(input),
        regex: /<span class="type">(.*)<\/span>/,
        toReplace: /(<span class="type">)|(<\/span>)/g
    })

    return option.includes('grátis') || option.includes('gratuita');
};

const parseTitle = (input: string): string => regexMe({
    input: matchH1(input),
    regex: /<span class="title">(.*)<\/span>/,
    toReplace: /(<span class="title">)|(<\/span>)/g
});

const parseThumb = (input: string): string => regexMe({
    input,
    regex: /(<!-- Image preview -->(\s*\n*)<img(\s*)src="(.*?)")/g,
    toReplace: /(<!-- Image preview -->(\s*\n*)<img(\s*)src=")|("\s)/g
});

const parseDownload = (input: string): string => regexMe({
    input,
    regex: /(<!-- Direct download button -->(\s*|\n*)<(.*)href="(.*)" )/g,
    toReplace: /(<!-- Direct download button -->(\s*)|(\n*)<(.*)href=")|(" )/g
});

const parseCreator = (input: string): string => regexMe({
    input,
    regex: /(<!-- Author Detail -->(\n*\s*.*?)<\/a>(\n*\s*.*?)<\/span>)/g,
    toReplace: /(<!-- Author(\s*\w*\W*.*)href=")|(".*\s*\w*<\/span>)/g
});

const removeListTag = (input: string): string => regexMe({
    input,
    regex: /">(.*?)<\/a>/,
    toReplace: /(">)|(<\/a>)/g
});

const parseTagItem = (tags: string): Array<string> => {
    const regex = /<li><a href="(.*?)" title="(.*?)">(.*?)<\/a>/gm;
    const matched = <RegExpMatchArray> tags.match(regex);

    return matched.map(removeListTag);
};

const parseTags = (input: string): Array<string> => parseTagItem(regexMe({
    input,
    regex: /<!-- Tags -->(\s*\n*)<ul class="tags">(\s*\n*)[^]*<\/ul>(\s*\n*)<!-- END Tags -->/g,
    toReplace: /(<!-- Tags -->(\s*\n*)<ul class="tags">)|(<\/ul>(\s*\n*)<!-- END Tags -->)/g
}));

const fetchElementContent = async (url: string): Promise<ElementContent> => {
    const page = await fetchWebsite({ search: get, url });
    const tags = parseTags(page);
    const title = parseTitle(page);
    const is_free = parseFree(page);
    const thumb_url = parseThumb(page);
    const download_url = parseDownload(page);
    const creator_profile = parseCreator(page);

    return { title, thumb_url, download_url, creator_profile, is_free, tags };
};

const createElement = async (url: string): Promise<FreepikElement> => {
    const fetched = await fetchElementContent(url);

    return { url, ...fetched };
};

const fetchElements = async ({ term }: SearchContext): Promise<Array<FreepikElement> | Error> => {
    try {
        const homePage = await fetchHomepage({ term, search: get });
        const regex = /<div class="slide slide-square\s*" id="\d*" data-epoc="\d*">([^]*)<\/div>/gm;
        const matched = <RegExpMatchArray> homePage.match(regex);
        const links = <Array<RegExpMatchArray>> matched.map(fetchLinks);
        const toBeScraped = links.reduce((acc, cur) => acc.concat(cur), []);

        return Promise.all(toBeScraped.map(createElement));
    } catch (e) {
        throw e;
    }
};

export const searchFreepik = ({ term }: SearchContext) => fetchElements({ term });

searchFreepik({ term: 'bola' }).then(console.log);

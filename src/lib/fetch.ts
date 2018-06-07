/**
 * Handles the communication.
 */

import { IncomingMessage } from 'http';
import { get } from 'https';
import { parseCreator, parseDownload, parseFree, parsePageNumber, parseTags, parseThumb, parseTitle } from './parse';

interface FetchContext {
    search: Function;
    url: string;
}

export interface HomepageContext {
    term: string;
    page?: number;
    search?: Function;
}

export interface ElementContent {
    title: string;
    tags: Array<string>;
    is_free: boolean;
    thumb_url: string;
    download_url: string;
    creator_profile: string;
}

const handleIncomingMessage = (message: IncomingMessage) => new Promise((resolve: (response: string) => void) => {
    let chunk = '';

    if (200 !== message.statusCode) {
        throw new Error('Connection not established.');
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

const fetchLinks = (input: string): RegExpMatchArray | null => {
    const links = <RegExpMatchArray>input.match(/<a id="" href="(.*?)"/gm);

    return links.map(matched => matched.replace(/(<a id="" href=")|"/gm, ''));
};

export const fetchHomepage = async ({ term, page, search = get }: HomepageContext): Promise<string | Error> => {
    const baseUrl = 'https://br.freepik.com/index.php?goto=2&k='.concat(term).concat(parsePageNumber(<number>page));

    if ('' === term || undefined === term || null === term) {
        throw new Error('No term to be searched for.');
    }

    return await fetchWebsite({ url: baseUrl, search });
};

export const fetchElementsLinks = (homePage: string): Array<string> => {
    const regex = /<div class="slide slide-square\s*" id="\d*" data-epoc="\d*">([^]*)<\/div>/gm;
    const matched = <RegExpMatchArray>homePage.match(regex);
    const links = <Array<RegExpMatchArray>>matched.map(fetchLinks);

    return links.reduce((acc, cur) => acc.concat(cur), []);
}

export const fetchElementContent = async (url: string): Promise<ElementContent> => {
    const page = await fetchWebsite({ search: get, url });
    const tags = parseTags(page);
    const title = parseTitle(page);
    const is_free = parseFree(page);
    const thumb_url = parseThumb(page);
    const download_url = parseDownload(page);
    const creator_profile = parseCreator(page);

    return { title, thumb_url, download_url, creator_profile, is_free, tags };
};

/**
 * Main application.
 */

import { IncomingMessage } from 'http';
import { get } from 'https';

export interface SearchContext {
    term: string;
    page?: number;
}

interface FetchContext extends SearchContext {
    search: Function;
}

const parsePage = (page: number): string => (undefined !== page && null !== page) ? `&order=${page}&vars=${page}` : '';

const fetchWebsite = ({ term, page, search }: FetchContext) => new Promise((resolve: (response: string) => void) => {
    const baseUrl = 'https://br.freepik.com/index.php?goto=2&k='.concat(term).concat(parsePage(<number> page));

    search(baseUrl, (res: IncomingMessage) => {
        let chunk = '';

        if (200 !== res.statusCode) {
            throw new Error('Connection dropped.');
        }

        res.setEncoding('utf8');
        res.on('data', (data: string) => chunk += data);
        res.on('end', () => resolve(chunk));
    }).on('error', (err: Error) => {
        throw err;
    });
});

const fetchElements = async ({ term }: SearchContext): Promise<RegExpMatchArray | null | Error> => {
    try {
        const website = await fetchWebsite({ term, search: get });
        const regex = /<div class="slide slide-square\s*" id="\d*" data-epoc="\d*">([^]*)<\/div>/gi;
        // const regex = /<div class="img-holder" > <a id="" href = "(.*?)"  class="preview " onclick = /gi;
        const matched = <RegExpMatchArray> website.match(regex);

        console.log(matched.length);

        return matched;
    } catch (e) {
        throw e;
    }
};

export const searchFreepik = ({ term }: SearchContext) => fetchElements({ term });

searchFreepik({ term: 'bola' })//.then(console.log);

/**
 * Main application.
 */

import { ElementContent, fetchElementContent, fetchElementsLinks, fetchHomepage } from './lib/fetch';

export interface SearchContext {
    term: string;
    page?: number;
}

export interface FreepikElement extends ElementContent {
    url: string;
}

const createFreepikElement = async (url: string): Promise<FreepikElement> => {
    const fetched = await fetchElementContent(url);

    return { url, ...fetched };
};

const searchFreepikElement = async ({ term }: SearchContext): Promise<Array<FreepikElement> | Error> => {
    try {
        const homePage = <string> await fetchHomepage({ term });
        const toBeScraped = fetchElementsLinks(homePage);

        return Promise.all(toBeScraped.map(createFreepikElement));
    } catch (e) {
        throw e;
    }
};

export const searchFreepik = ({ term }: SearchContext) => searchFreepikElement({ term });
